function Val({ s }: { s: string }) {
  const m = s.match(/^(\s*)("(?:[^"\\]|\\.)*")(,?)$/);
  if (m) {
    return (
      <>
        {m[1]}
        <span className="s">{m[2]}</span>
        <span className="p">{m[3]}</span>
      </>
    );
  }
  return <span className="p">{s}</span>;
}

function Line({ line }: { line: string }) {
  const m = line.match(/^(\s*)"([^"]+)":\s?(.*)$/);
  if (m) {
    return (
      <>
        {m[1]}
        <span className="k">{`"${m[2]}"`}</span>
        <span className="p">: </span>
        <Val s={m[3]} />
      </>
    );
  }
  return <Val s={line} />;
}

export function CodeBlock({ name, data }: { name: string; data: unknown }) {
  const lines = JSON.stringify(data, null, 2).split("\n");
  return (
    <div className="codeblock">
      <span className="fname">{name}</span>
      <pre>
        <code>
          {lines.map((l, i) => (
            <span key={i}>
              <Line line={l} />
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
