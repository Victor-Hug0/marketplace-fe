"use client";

import { resetPasswordAction } from "@/lib/auth/actions";
import { AccountForm } from "@/components/account/account-form";
import { TextField } from "@/components/ui/text-field";

export function ResetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  return (
    <AccountForm action={resetPasswordAction} submitLabel="Salvar senha">
      {(state) => (
        <>
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />
          <TextField
            id="reset-password"
            name="password"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            autoFocus
            error={state.fieldErrors.password}
          />
          <TextField
            id="reset-password-confirmation"
            name="password_confirmation"
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            error={state.fieldErrors.password_confirmation}
          />
        </>
      )}
    </AccountForm>
  );
}
