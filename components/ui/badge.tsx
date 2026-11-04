const tones = {
  promo: "border-promo bg-promo text-action-ink",
  warning: "border-warning bg-surface text-warning",
  success: "border-promo bg-surface text-promo",
  neutral: "border-line bg-surface text-ink",
} as const;

export function Badge({
  tone,
  children,
}: {
  tone: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-sm border px-2 text-[14px] leading-5 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const orderStatus = {
  pending_payment: { tone: "warning", label: "Aguardando pagamento" },
  delivered: { tone: "success", label: "Entregue" },
} as const;

export function OrderStatusBadge({
  status,
}: {
  status: keyof typeof orderStatus;
}) {
  const item = orderStatus[status];
  return <Badge tone={item.tone}>{item.label}</Badge>;
}
