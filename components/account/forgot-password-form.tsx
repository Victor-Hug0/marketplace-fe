"use client";

import { forgotPasswordAction } from "@/lib/auth/actions";
import { AccountForm } from "@/components/account/account-form";
import { TextField } from "@/components/ui/text-field";

export function ForgotPasswordForm() {
  return (
    <AccountForm
      action={forgotPasswordAction}
      submitLabel="Enviar link"
      doneHref="/entrar"
      doneLabel="Voltar ao login"
    >
      {(state) => (
        <TextField
          id="forgot-email"
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          error={state.fieldErrors.email}
        />
      )}
    </AccountForm>
  );
}
