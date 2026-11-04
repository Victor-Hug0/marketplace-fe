import {
  ApiContractError,
  ApiError,
  ApiUnavailableError,
  failureCopy,
} from "@/lib/api/failure";

export const FORGOT_PASSWORD_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.";

export const PASSWORD_RULE =
  "A senha precisa ter de 8 a 64 caracteres, com maiúscula, minúscula, número e símbolo.";

export const GOOGLE_UNAVAILABLE =
  "O login com Google não está disponível agora.";

export const GOOGLE_DENIED = "O login com Google foi cancelado ou negado.";

export const GOOGLE_STATE =
  "Não foi possível confirmar o login com Google. Tente de novo.";

export const EMAIL_CONFIRMED = "E-mail confirmado.";

export const EMAIL_LINK_INVALID =
  "O link de confirmação é inválido ou expirou.";

export const EMAIL_ALREADY_CONFIRMED = "O e-mail já foi confirmado.";

export const REGISTERED_MESSAGE =
  "Conta criada. Enviamos um link de confirmação para o seu e-mail. Entre depois de confirmar.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FormState = {
  formError: string | null;
  fieldErrors: Record<string, string>;
  done: string | null;
};

export const emptyFormState: FormState = {
  formError: null,
  fieldErrors: {},
  done: null,
};

export function firstQuery(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function passwordError(value: string): string | null {
  if (
    value.length < 8 ||
    value.length > 64 ||
    !/[a-z]/.test(value) ||
    !/[A-Z]/.test(value) ||
    !/\d/.test(value) ||
    !/[^A-Za-z0-9]/.test(value)
  ) {
    return PASSWORD_RULE;
  }

  return null;
}

export function isSafePathSegment(value: string): boolean {
  return /^[A-Za-z0-9]+$/.test(value);
}

export function registerFieldErrors(input: {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  confirmation: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = input.name.trim();

  if (name === "" || name.length > 255) {
    errors.name = "O nome é obrigatório.";
  }
  if (!isEmail(input.email)) {
    errors.email = "Informe um e-mail válido.";
  }
  if (onlyDigits(input.cpf).length !== 11) {
    errors.cpf = "O CPF precisa ter 11 dígitos.";
  }
  const phone = onlyDigits(input.phone);
  if (phone.length < 10 || phone.length > 11) {
    errors.phone_number = "Informe o telefone com DDD.";
  }
  const password = passwordError(input.password);
  if (password) errors.password = password;
  if (input.password !== input.confirmation) {
    errors.password_confirmation = "A confirmação da senha não confere.";
  }

  return errors;
}

export function formStateFromError(error: unknown): FormState {
  if (error instanceof ApiError) {
    if (error.status === 422) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(error.errors)) {
        const message = messages[0];
        if (message) fieldErrors[key] = message;
      }
      return {
        formError: Object.keys(fieldErrors).length === 0 ? error.message : null,
        fieldErrors,
        done: null,
      };
    }

    if (error.status === 429) {
      return {
        formError: failureCopy(error).detail,
        fieldErrors: {},
        done: null,
      };
    }

    return { formError: error.message, fieldErrors: {}, done: null };
  }

  if (
    error instanceof ApiUnavailableError ||
    error instanceof ApiContractError
  ) {
    return { formError: error.message, fieldErrors: {}, done: null };
  }

  return {
    formError: "Não foi possível concluir agora.",
    fieldErrors: {},
    done: null,
  };
}

export type GoogleNotice =
  | "denied"
  | "state"
  | "unavailable"
  | "conflict"
  | "failed";

export function googleNoticeCopy(notice: string | undefined): string | null {
  switch (notice) {
    case "denied":
      return GOOGLE_DENIED;
    case "state":
      return GOOGLE_STATE;
    case "unavailable":
      return GOOGLE_UNAVAILABLE;
    case "conflict":
      return "Esta conta está desativada.";
    case "failed":
      return "Não foi possível entrar com Google.";
    default:
      return null;
  }
}

export function googleFailureNotice(status: number): GoogleNotice {
  if (status === 503) return "unavailable";
  if (status === 409) return "conflict";
  if (status === 401) return "denied";
  return "failed";
}
