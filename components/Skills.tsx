import { Code2, LayoutTemplate, Server, Database, Sparkles, Wrench } from "lucide-react";
import { site } from "@/data/site";

const ICONS: Record<string, typeof Code2> = {
  Languages: Code2,
  Frontend: LayoutTemplate,
  Backend: Server,
  Database: Database,
  "AI & Automation": Sparkles,
  Tools: Wrench,
};

const maxItems = Math.max(...site.skills.map((g) => g.items.length));

export default function Skills() {
  return (
    <section id="skills" className="py-11 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl md:text-[26px] font-bold uppercase mb-8">
          Skills &amp; Tech Stack
        </h2>

        <div className="border-t-[1px] border-ink dark:border-ink-dark">
          {site.skills.map((group, gi) => {
            const Icon = ICONS[group.category] ?? Code2;
            const load = Math.round((group.items.length / maxItems) * 100);
            return (
              <div
                key={group.category}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-3 border-b-[1px] border-ink dark:border-ink-dark py-5"
              >
                {/* icon block — filled, not outlined, so it reads as a mark not a bullet */}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-ink dark:bg-ink-dark text-bg dark:text-bg-dark">
                  <Icon size={20} strokeWidth={2} />
                </span>

                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 mb-2.5">
                    <h3 className="font-medium uppercase tracking-tight text-base font-montserrat">
                      {group.category}
                    </h3>
                    <span className="font-mono text-[11px] text-sub dark:text-sub-dark">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, ii) => (
                      <span
                        key={item}
                        className={`px-2.5 py-1 font-mono text-xs border-[1px] transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#0a0a0a] dark:hover:shadow-[3px_3px_0_0_#f2f2ed] ${
                          ii === 0
                            ? "bg-accent dark:bg-accent-dark border-accent dark:border-accent-dark text-white font-semibold"
                            : "border-ink dark:border-ink-dark"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* stat + meter — a real number (item count relative to the
                    biggest category), not a fabricated proficiency score */}
                <div className="sm:w-24 sm:text-right">
                  <div className="font-mono text-2xl font-bold leading-none">
                    {group.items.length}
                    <span className="text-sub dark:text-sub-dark text-sm">
                      /{maxItems}
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full sm:ml-auto bg-ink/10 dark:bg-ink-dark/10">
                    <div
                      className="h-full bg-accent dark:bg-accent-dark transition-[width] duration-500"
                      style={{ width: `${load}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}