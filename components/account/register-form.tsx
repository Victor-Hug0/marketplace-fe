"use client";

import { registerAction } from "@/lib/auth/actions";
import { AccountForm } from "@/components/account/account-form";
import { TextField } from "@/components/ui/text-field";

export function RegisterForm() {
  return (
    <AccountForm
      action={registerAction}
      submitLabel="Criar conta"
      doneHref="/entrar"
      doneLabel="Ir para o login"
    >
      {(state) => (
        <>
          <TextField
            id="name"
            name="name"
            label="Nome"
            autoComplete="name"
            autoFocus
            error={state.fieldErrors.name}
          />
          <TextField
            id="register-email"
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            error={state.fieldErrors.email}
          />
          <TextField
            id="cpf"
            name="cpf"
            label="CPF"
            inputMode="numeric"
            autoComplete="off"
            error={state.fieldErrors.cpf}
          />
          <TextField
            id="phone_number"
            name="phone_number"
            label="Telefone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            error={state.fieldErrors.phone_number}
          />
          <TextField
            id="register-password"
            name="password"
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={state.fieldErrors.password}
          />
          <TextField
            id="password_confirmation"
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
