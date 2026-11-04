type Tone = "error" | "warning" | "info";

const roles = {
  error: "alert",
  warning: "status",
  info: "status",
} as const;

export function InlineAlert({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  const tones = {
    error: "border-danger text-danger",
    warning: "border-warning text-warning",
    info: "border-line text-ink",
  } as const;

  return (
    <p
      role={roles[tone]}
      data-tone={tone}
      className={`rounded-sm border bg-surface px-3 py-2 ${tones[tone]}`}
    >
      {children}
    </p>
  );
}
