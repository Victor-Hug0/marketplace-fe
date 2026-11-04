export default function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-shell="conta" className="mx-auto w-full max-w-[28rem] px-4 py-8">
      {children}
    </div>
  );
}
