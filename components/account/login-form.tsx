"use client";

import { loginAction } from "@/lib/auth/actions";
import { AccountForm } from "@/components/account/account-form";
import { TextField } from "@/components/ui/text-field";

export function LoginForm({ next }: { next: string }) {
  return (
    <AccountForm action={loginAction} submitLabel="Entrar">
      {(state) => (
        <>
          <input type="hidden" name="next" value={next} />
          <TextField
            id="email"
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            autoFocus
            error={state.fieldErrors.email}
          />
          <TextField
            id="password"
            name="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={state.fieldErrors.password}
          />
        </>
      )}
    </AccountForm>
  );
}
