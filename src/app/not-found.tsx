import Link from "next/link";

export default function NotFound() {
  return (
    <main className="plain">
      <h1>Page not found</h1>
      <p>This page is hidden or doesn&apos;t exist.</p>
      <p><Link href="/">Back to the start</Link></p>
    </main>
  );
}
