"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";

import { emptyFormState, type FormState } from "@/lib/auth/account";
import { Button } from "@/components/ui/button";
import { InlineAlert } from "@/components/ui/inline-alert";

export function AccountForm({
  action,
  submitLabel,
  doneHref,
  doneLabel,
  children,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  doneHref?: string;
  doneLabel?: string;
  children: (state: FormState) => ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, emptyFormState);

  if (state.done) {
    return (
      <div className="grid gap-3">
        <InlineAlert tone="info">{state.done}</InlineAlert>
        {doneHref && doneLabel ? (
          <Link href={doneHref} className="font-semibold text-action">
            {doneLabel}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-3" noValidate>
      {state.formError ? (
        <InlineAlert tone="error">{state.formError}</InlineAlert>
      ) : null}
      {children(state)}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : submitLabel}
      </Button>
    </form>
  );
}
