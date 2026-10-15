export type PageId = "start" | "about" | "experience" | "projects" | "how" | "stack" | "contact";
export type Mode = "system" | "light" | "dark";

export interface PageConfig { id: PageId; title: string; visible: boolean }
export interface Profile {
  name: string; role: string; positioning: string; intro: string;
  photo: string; photoAlt: string; location: string;
}
export interface WorkItem { uid: string; title: string; text: string }
export interface WorkEntry {
  uid: string; id: string; title: string; org: string; dates: string; blurb: string;
  tech: string[]; items: WorkItem[]; outcome: string; visible: boolean;
}
export interface CaseStudy {
  context: string; contribution: string; problem: string; approach: string;
  decisions: string; validation: string; outcome: string;
}
export interface ProjectImage { uid: string; media: string; alt: string }
export interface Project {
  uid: string; id: string; name: string; category: string; summary: string; outcomeLine: string;
  status: string; featured: boolean; cover: string; coverAlt: string; coverCapturedAt: string; images: ProjectImage[];
  tech: string[]; scope: string[]; caseStudy: CaseStudy;
  demoUrl: string; repoUrl: string; sourceNote: string; visible: boolean;
}
export interface StackIcon { slug: string; title: string; path: string }
export interface StackItem {
  uid: string; name: string; description: string; icon: StackIcon | null;
  why: string; how: string; alternatives: string; visible: boolean;
}
export interface StackGroup { uid: string; id: string; name: string; items: StackItem[]; visible: boolean }
export type StepKind = "start" | "process" | "end";
export interface Step { uid: string; title: string; text: string; kind: StepKind; icon: string; from: string[]; chips: string[] }
export interface Testimonial { uid: string; quote: string; name: string; role: string; visible: boolean }
export interface Contact {
  email: string; github: string; linkedin: string; resumeUrl: string;
  formEnabled: boolean; retentionDays: number; showOnAbout: boolean;
}
export interface AiSettings { enabled: boolean; questions: string[] }
export interface SiteSettings { palettes: string[]; defaultPalette: string; defaultMode: Mode; ai: AiSettings }

export interface Content {
  schema: 2;
  rev: number;
  updated: string;
  publishedAt: string;
  profile: Profile;
  pages: PageConfig[];
  about: string;
  work: WorkEntry[];
  projects: Project[];
  testimonials: Testimonial[];
  how: { intro: string; steps: Step[] };
  stack: StackGroup[];
  contact: Contact;
  site: SiteSettings;
}

export interface NavChild { title: string; href: string }
export interface NavItem { id: PageId; href: string; title: string; group: string; children?: NavChild[] }
export interface SearchEntry { title: string; kind: string; href: string; text?: string }

export interface Change {
  id: string; kind: "changed" | "added" | "removed"; section: string; label: string; path: string;
  before: string; after: string; item?: unknown; parent?: string;
}
export interface VersionInfo { id: string; at: string; note: string; counts: string; changeCount: number }
export interface Suggestion {
  id: string; title: string; why: string; how: string[];
  target: { section: string; uid?: string }; level: "important" | "nice";
}
export interface Message {
  id: string; at: string; name: string; email: string; topic: string; message: string;
  read: boolean; archived: boolean;
}
export interface Issue { path: string; message: string; level: "error" | "warn"; fix?: string }
