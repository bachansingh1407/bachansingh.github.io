"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="plain">
      <h1>Temporarily unavailable</h1>
      <p>The site can&apos;t load its content right now. Nothing is lost. Please try again in a moment.</p>
      <p><button className="btn primary" onClick={reset}>Try again</button></p>
    </main>
  );
}
