import { site } from "@/data/site";

export default function Experience() {
  return (
    <section id="experience" className="py-11 scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl md:text-[26px] font-bold uppercase mb-5">
          Experience
        </h2>
        {site.experience.map((job, i) => (
          <div
            key={`${job.company}-${job.time}`}
            className={`grid grid-cols-1 md:grid-cols-[130px_1fr] gap-2 md:gap-5 py-5 ${
              i !== 0 ? "border-t-[1px] border-ink dark:border-ink-dark" : ""
            }`}
          >
            <div className="font-mono text-xs text-sub dark:text-sub-dark">
              {job.time}
            </div>
            <div>
              <div className="text-base font-bold tracking-[1px] uppercase font-montserrat">
                {job.role}
              </div>
              <div className="text-accent dark:text-accent-dark text-sm font-medium mt-0.5 mb-1.5 font-montserrat">
                {job.company}
              </div>
              <p className="text-sm text-sub dark:text-sub-dark font-medium font-montserrat">
                {job.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
