"use client";

import { useActionState } from "react";

import { resendVerificationAction } from "@/lib/auth/actions";
import { emptyFormState } from "@/lib/auth/account";

export function ResendVerificationForm() {
  const [state, action, pending] = useActionState(
    resendVerificationAction,
    emptyFormState,
  );

  return (
    <form action={action} className="inline">
      <button
        type="submit"
        disabled={pending}
        className="font-semibold underline disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Reenviar e-mail"}
      </button>
      {state.done ? <span className="ml-2">{state.done}</span> : null}
      {state.formError ? <span className="ml-2">{state.formError}</span> : null}
    </form>
  );
}
