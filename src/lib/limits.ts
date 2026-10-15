/** Per-field length and per-list count caps. Enforced on publish and shown live in the admin. */
export const L = {
  name: 80, role: 120, positioning: 240, intro: 600, location: 80, alt: 200,
  about: 6000,
  pageTitle: 40,
  work: 8, workTitle: 80, org: 80, dates: 60, blurb: 400, workItems: 10, itemTitle: 120, itemText: 600, outcome: 1200,
  projects: 12, projectName: 80, category: 60, summary: 400, outcomeLine: 140, status: 40,
  tech: 12, techItem: 40, scope: 12, scopeItem: 160, caseSection: 4000, images: 6, sourceNote: 240, slug: 60,
  url: 300,
  stackGroups: 8, groupName: 60, stackItems: 20, stackName: 60, stackDesc: 120,
  steps: 10, stepTitle: 60, stepText: 400, howIntro: 400,
  testimonials: 6, quote: 400, personName: 80,
  email: 254,
  messageName: 80, messageBody: 2000, messageMin: 10,
  retentionMax: 3650,
  why: 400, how: 400, alternatives: 200, chip: 40, chips: 8, workTech: 10, iconTitle: 60, iconPath: 2000, iconSlug: 60,
  questions: 4, question: 80, askMessage: 400, improveText: 4000,
} as const;

export const MEDIA_MAX = { image: 2 * 1024 * 1024, pdf: 4 * 1024 * 1024 };
export const MAX_MESSAGES = 500;
export const MAX_VERSIONS = 100;
