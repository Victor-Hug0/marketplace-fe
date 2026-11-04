"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { apiRequest } from "@/lib/api/client";
import {
  messageSchema,
  tokenPairSchema,
  userEnvelope,
} from "@/lib/api/envelopes";
import { ApiError } from "@/lib/api/failure";
import { apiRequestWithSession } from "@/lib/api/authed";
import {
  EMAIL_ALREADY_CONFIRMED,
  EMAIL_CONFIRMED,
  EMAIL_LINK_INVALID,
  FORGOT_PASSWORD_MESSAGE,
  GOOGLE_UNAVAILABLE,
  REGISTERED_MESSAGE,
  emptyFormState,
  formStateFromError,
  googleFailureNotice,
  isEmail,
  type GoogleNotice,
  isSafePathSegment,
  onlyDigits,
  passwordError,
  registerFieldErrors,
  type FormState,
} from "@/lib/auth/account";
import { oauthStateMatches } from "@/lib/auth/oauth-state";
import { safeNextPath } from "@/lib/auth/next-path";
import {
  clearOAuthState,
  clearSessionCookies,
  readOAuthState,
  writeOAuthState,
  writeSession,
} from "@/lib/auth/session";

const registeredUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const googleRedirectSchema = z.object({
  data: z.object({
    url: z.string().url(),
  }),
});

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email").trim();
  const password = text(formData, "password");
  const next = safeNextPath(text(formData, "next"));
  const fieldErrors: Record<string, string> = {};

  if (!isEmail(email)) fieldErrors.email = "Informe um e-mail válido.";
  if (password === "") fieldErrors.password = "A senha é obrigatória.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ...emptyFormState, fieldErrors };
  }

  try {
    const pair = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
      schema: tokenPairSchema,
    });
    await writeSession({
      accessToken: pair.access_token,
      refreshToken: pair.refresh_token,
    });
  } catch (error) {
    return formStateFromError(error);
  }

  redirect(next);
}

export async function registerAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const input = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    cpf: text(formData, "cpf"),
    phone: text(formData, "phone_number"),
    password: text(formData, "password"),
    confirmation: text(formData, "password_confirmation"),
  };
  const fieldErrors = registerFieldErrors(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { ...emptyFormState, fieldErrors };
  }

  try {
    await apiRequest("/api/v1/auth/register", {
      method: "POST",
      body: {
        name: input.name.trim(),
        email: input.email.trim(),
        cpf: onlyDigits(input.cpf),
        phone_number: onlyDigits(input.phone),
        password: input.password,
        password_confirmation: input.confirmation,
      },
      schema: userEnvelope(registeredUserSchema),
    });
  } catch (error) {
    return formStateFromError(error);
  }

  return { ...emptyFormState, done: REGISTERED_MESSAGE };
}

export async function forgotPasswordAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = text(formData, "email").trim();
  if (!isEmail(email)) {
    return {
      ...emptyFormState,
      fieldErrors: { email: "Informe um e-mail válido." },
    };
  }

  try {
    await apiRequest("/api/v1/auth/forgot-password", {
      method: "POST",
      body: { email },
      schema: messageSchema,
    });
  } catch (error) {
    return formStateFromError(error);
  }

  return { ...emptyFormState, done: FORGOT_PASSWORD_MESSAGE };
}

export async function resetPasswordAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = text(formData, "token");
  const email = text(formData, "email").trim();
  const password = text(formData, "password");
  const confirmation = text(formData, "password_confirmation");
  const fieldErrors: Record<string, string> = {};

  if (token === "")
    fieldErrors.token = "O link de redefinição está incompleto.";
  if (!isEmail(email)) fieldErrors.email = "Informe um e-mail válido.";
  const passwordProblem = passwordError(password);
  if (passwordProblem) fieldErrors.password = passwordProblem;
  if (password !== confirmation) {
    fieldErrors.password_confirmation = "A confirmação da senha não confere.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ...emptyFormState, fieldErrors };
  }

  try {
    await apiRequest("/api/v1/auth/reset-password", {
      method: "POST",
      body: {
        token,
        email,
        password,
        password_confirmation: confirmation,
      },
      schema: messageSchema,
    });
    await clearSessionCookies();
  } catch (error) {
    const state = formStateFromError(error);
    if (state.fieldErrors.token) {
      const { token: tokenError, ...rest } = state.fieldErrors;
      return {
        ...state,
        formError: tokenError ?? state.formError,
        fieldErrors: rest,
      };
    }
    return state;
  }

  redirect("/entrar?aviso=senha");
}

export async function resendVerificationAction(): Promise<FormState> {
  try {
    await apiRequestWithSession(
      "/api/v1/auth/email/verification-notification",
      {
        method: "POST",
        schema: messageSchema,
      },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return { ...emptyFormState, done: EMAIL_ALREADY_CONFIRMED };
    }
    return formStateFromError(error);
  }

  return {
    ...emptyFormState,
    done: "Enviamos um novo link de confirmação para o seu e-mail.",
  };
}

export async function startGoogleLogin(): Promise<FormState> {
  let destination: string | null = null;

  try {
    const result = await apiRequest("/api/v1/auth/google/redirect", {
      schema: googleRedirectSchema,
    });
    const state = new URL(result.data.url).searchParams.get("state");
    if (!state) {
      return { ...emptyFormState, formError: GOOGLE_UNAVAILABLE };
    }
    await writeOAuthState(state);
    destination = result.data.url;
  } catch (error) {
    if (error instanceof ApiError && error.status === 503) {
      return { ...emptyFormState, formError: GOOGLE_UNAVAILABLE };
    }
    return formStateFromError(error);
  }

  redirect(destination);
}

export async function confirmEmailLink(input: {
  id: string;
  hash: string;
  expires: string;
  signature: string;
}): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  if (
    input.id === "" &&
    input.hash === "" &&
    input.expires === "" &&
    input.signature === ""
  ) {
    return {
      ok: false,
      message: "Abra o link que enviamos para o seu e-mail.",
    };
  }

  if (
    !isSafePathSegment(input.id) ||
    !isSafePathSegment(input.hash) ||
    !/^\d+$/.test(input.expires) ||
    !isSafePathSegment(input.signature)
  ) {
    return { ok: false, message: EMAIL_LINK_INVALID };
  }

  try {
    const result = await apiRequest(
      `/api/v1/auth/email/verify/${input.id}/${input.hash}`,
      {
        query: { expires: input.expires, signature: input.signature },
        schema: messageSchema,
      },
    );
    return { ok: true, message: result.message || EMAIL_CONFIRMED };
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 403 || error.status === 404)
    ) {
      return { ok: false, message: EMAIL_LINK_INVALID };
    }
    return {
      ok: false,
      message: formStateFromError(error).formError ?? EMAIL_LINK_INVALID,
    };
  }
}

export async function completeGoogleCallback(input: {
  code: string;
  state: string;
  error: string;
}): Promise<{ ok: true } | { ok: false; notice: GoogleNotice }> {
  if (input.error !== "") {
    await clearOAuthState();
    return { ok: false, notice: "denied" };
  }

  const stored = await readOAuthState();
  if (!oauthStateMatches(stored, input.state) || input.code === "") {
    await clearOAuthState();
    return { ok: false, notice: "state" };
  }

  try {
    const pair = await apiRequest("/api/v1/auth/google/callback", {
      query: { code: input.code },
      schema: tokenPairSchema,
    });
    await writeSession({
      accessToken: pair.access_token,
      refreshToken: pair.refresh_token,
    });
    await clearOAuthState();
  } catch (error) {
    await clearOAuthState();
    if (error instanceof ApiError) {
      return { ok: false, notice: googleFailureNotice(error.status) };
    }
    return { ok: false, notice: "failed" };
  }

  return { ok: true };
}
