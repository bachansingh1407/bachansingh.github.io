import { site } from "@/data/site";

export default function Hero() {
  return (
    <header id="top" className="pt-24 pb-0 md:pt-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border-[1px] border-ink font-mono text-xs font-bold dark:border-ink-dark">
            {site.firstName.charAt(0)}
          </span>
          <div className="font-mono text-xs uppercase tracking-widest text-ink/70 dark:text-ink-dark/70">
            {"// "}
            {site.role.toLowerCase()}
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95] tracking-tight mb-5">
          {site.hero.heading}
          <br />
          <span className="text-accent dark:text-accent-dark">
            {site.hero.headingAccent}
          </span>
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-sub dark:text-sub-dark font-medium mb-7 font-montserrat">
          {site.hero.subtext}
        </p>
        <div className="inline-flex items-center gap-2 border-[1px] border-accent dark:border-accent-dark px-4 py-2 font-montserrat tracking-[1px] text-xs mb-10">
          <span className="h-2 w-2 bg-green-600" />
          {site.hero.availability}
        </div>
      </div>
    </header>
  );
}
