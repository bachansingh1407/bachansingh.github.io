import Link from "next/link";

export default function SiteNotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="lead">This page is hidden or doesn&apos;t exist.</p>
      <p><Link href="/" className="textlink">Back to the start</Link></p>
    </>
  );
}
