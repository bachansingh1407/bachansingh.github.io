import { site } from "@/data/site";

export default function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-t-[3px] border-ink dark:border-ink-dark mt-10">
      {site.stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`p-5 md:p-6 ${
            i !== 0 ? "border-l-[3px] border-ink dark:border-ink-dark" : ""
          } ${i < 2 ? "border-b-[3px] md:border-b-0 border-ink dark:border-ink-dark" : ""}`}
        >
          <div className="font-mono text-3xl md:text-4xl font-bold text-accent dark:text-accent-dark">
            {stat.value}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-sub dark:text-sub-dark">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
