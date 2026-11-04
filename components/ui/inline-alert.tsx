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
  return (
    <p role={roles[tone]} data-tone={tone}>
      {children}
    </p>
  );
}
