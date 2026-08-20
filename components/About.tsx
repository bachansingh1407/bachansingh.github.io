import { site } from "@/data/site";
import Stats from "./Stats";

export default function About() {
  return (
    <section id="about" className="py-11 font-montserrat scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl md:text-[26px] font-bold uppercase mb-4">
          {site.about.heading}
        </h2>
        <p className="max-w-2xl text-[15px] text-sub dark:text-sub-dark font-medium">
          {site.about.text}
        </p>
        <Stats />
      </div>
    </section>
  );
}
