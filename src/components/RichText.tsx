/** Plain text with blank-line paragraphs and "- " bullet lists. No HTML is ever injected. */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^\s*[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="pre-line">{b}</p>;
      })}
    </>
  );
}
