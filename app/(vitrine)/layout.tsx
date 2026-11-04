export default function VitrineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-shell="vitrine">{children}</div>;
}
