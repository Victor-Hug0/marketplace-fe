import Link from "next/link";

export function StatusPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link href="/">Voltar ao início</Link>
    </main>
  );
}
