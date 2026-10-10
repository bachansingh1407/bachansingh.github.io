import type { CaseStudy, Content, Suggestion } from "./types";

const PLACEHOLDER = /\b(lorem|todo|tbd|placeholder|coming soon|to be added|to confirm|xxx)\b/i;

/** Advice only, each with the reason and the steps. Hard rules (length, links, alt text) live in validateContent and block publishing. */
export function suggestions(c: Content): Suggestion[] {
  const out: Suggestion[] = [];
  const add = (s: Suggestion) => out.push(s);
  const k = c.contact;

  if (!k.email && !k.github && !k.linkedin && !k.formEnabled) add({
    id: "contact-route", level: "important", title: "Add a way to contact you",
    why: "A reader who likes your work needs a next step. Without one, interest is lost.",
    how: ["Open Contact & resume.", "Turn the contact form on, or add an email, GitHub or LinkedIn link.", "Save the draft."],
    target: { section: "contact" },
  });
  if (!k.resumeUrl) add({
    id: "resume", level: "nice", title: "Upload your resume",
    why: "Recruiters often want a one-page summary they can forward.",
    how: ["Open Contact & resume.", "Choose Upload resume and pick a PDF (up to 4 MB).", "Save the draft."],
    target: { section: "contact" },
  });
  if (!c.profile.photo) add({
    id: "photo", level: "nice", title: "Add a hero photo",
    why: "A real photo makes the home page feel personal. Without one a graphic is shown, which is fine.",
    how: ["Open Profile.", "Upload an image and write alt text that describes it.", "Save the draft."],
    target: { section: "profile" },
  });
  if (!c.about) add({
    id: "about", level: "important", title: "Write your About text",
    why: "The About page stays hidden while it is empty, and visitors often check it first.",
    how: ["Open About.", "Write three short paragraphs: what you do, how you work, what you want next.", "Save the draft."],
    target: { section: "about" },
  });

  for (const w of c.work.filter((x) => x.visible)) {
    if (!w.outcome) add({
      id: `work-outcome-${w.uid}`, level: "nice", title: `Add an outcome to "${w.title || "this role"}"`,
      why: "Context, your contribution and the outcome matter more than a list of tools.",
      how: ["Open Experience and select the role.", "In Outcome, write one decision you owned and what came of it. Skip numbers you can't source.", "Save the draft."],
      target: { section: "work", uid: w.uid },
    });
  }

  const vp = c.projects.filter((p) => p.visible);
  if (vp.length > 5) add({
    id: "too-many-projects", level: "nice", title: "Show fewer projects",
    why: "Three to five well-explained projects beat a long list. Many thin ones weaken the whole.",
    how: ["Open Projects.", "Hide the projects you can't explain in depth.", "Save the draft."],
    target: { section: "projects" },
  });
  if (vp.length && !vp.some((p) => p.featured)) add({
    id: "no-featured", level: "nice", title: "Choose your featured projects",
    why: "Featured projects lead the home page. Without a choice, the first three are shown.",
    how: ["Open Projects and select a project.", "Switch on Featured on home.", "Repeat for up to three projects."],
    target: { section: "projects", uid: vp[0].uid },
  });
  for (const p of vp) {
    const name = p.name || "this project";
    const filled = (Object.keys(p.caseStudy) as (keyof CaseStudy)[]).filter((x) => p.caseStudy[x]).length;
    if (filled === 0) add({
      id: `case-${p.uid}`, level: "important", title: `Write the case study for "${name}"`,
      why: "A project with only a one-line summary gives a reader nothing to evaluate.",
      how: ["Open Projects and select it.", "Fill in Context, My contribution and Decisions first.", "Hide the project until you have time, if you prefer."],
      target: { section: "projects", uid: p.uid },
    });
    else if (!p.caseStudy.decisions) add({
      id: `decisions-${p.uid}`, level: "important", title: `Add Decisions to "${name}"`,
      why: "Decisions (options, choice, reason) show judgment, which is what technical interviewers look for.",
      how: ["Open Projects and select it.", "In Decisions, list the options you considered, the one you chose and why.", "Save the draft."],
      target: { section: "projects", uid: p.uid },
    });
    if (!p.cover) add({
      id: `cover-${p.uid}`, level: "nice", title: `Add a cover image to "${name}"`,
      why: "Cards with a picture are opened far more often than text-only cards.",
      how: ["Open Projects and select it.", "Use Capture from live URL (after adding the demo link), or upload an image.", "Add alt text."],
      target: { section: "projects", uid: p.uid },
    });
    if (!p.outcomeLine) add({
      id: `outcome-${p.uid}`, level: "nice", title: `Add a one-line outcome to "${name}"`,
      why: "The outcome line is the first thing a skimming reader sees on the card.",
      how: ["Open Projects and select it.", "Write one true sentence about the result. Leave it empty if you're unsure.", "Save the draft."],
      target: { section: "projects", uid: p.uid },
    });
    if (!p.demoUrl && !p.repoUrl && !p.sourceNote) add({
      id: `proof-${p.uid}`, level: "nice", title: `Give proof for "${name}"`,
      why: "Clickable proof (a demo or repository) is what makes a claim believable.",
      how: ["Open Projects and select it.", "Add a live demo or repository link, or say why the source isn't available."],
      target: { section: "projects", uid: p.uid },
    });
    const blob = [p.summary, p.status, ...p.scope, ...Object.values(p.caseStudy)].join(" ");
    if (PLACEHOLDER.test(blob)) add({
      id: `placeholder-${p.uid}`, level: "important", title: `Replace placeholder wording in "${name}"`,
      why: "Text like “to confirm” reads as unfinished and hurts trust.",
      how: ["Open Projects and select it.", "Clear the Status label and rewrite any placeholder scope or text.", "Or hide the project until it is ready."],
      target: { section: "projects", uid: p.uid },
    });
  }

  const items = c.stack.flatMap((g) => g.items.filter((i) => i.visible));
  if (items.length && !items.some((i) => i.why)) add({
    id: "stack-why", level: "nice", title: "Explain why you use your main tools",
    why: "A list of logos says little. A sentence on why you chose each tool shows judgment.",
    how: ["Open Stack and select a group.", "For your top three tools fill in Why I use it, How I use it and Alternatives.", "Only write what is true."],
    target: { section: "stack" },
  });
  if (items.length && items.some((i) => !i.icon)) add({
    id: "stack-icons", level: "nice", title: "Add icons to your stack",
    why: "Recognisable logos make the Stack page quicker to scan.",
    how: ["Open Stack and select a group.", "Use Find icons automatically, or pick an icon per technology."],
    target: { section: "stack" },
  });
  return out;
}
