"use client";

import { useActionState } from "react";

import { startGoogleLogin } from "@/lib/auth/actions";
import { emptyFormState } from "@/lib/auth/account";
import { Button } from "@/components/ui/button";
import { InlineAlert } from "@/components/ui/inline-alert";

export function GoogleButton() {
  const [state, action, pending] = useActionState(
    startGoogleLogin,
    emptyFormState,
  );

  return (
    <form action={action} className="grid gap-3">
      {state.formError ? (
        <InlineAlert tone="error">{state.formError}</InlineAlert>
      ) : null}
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Enviando…" : "Entrar com Google"}
      </Button>
    </form>
  );
}
