export type PageId = "start" | "about" | "experience" | "projects" | "how" | "stack" | "contact";

export interface PageConfig { id: PageId; title: string; visible: boolean }
export interface Profile { name: string; role: string; positioning: string; intro: string }
export interface WorkItem { title: string; text: string }
export interface WorkEntry {
  id: string; title: string; org: string; dates: string; blurb: string;
  items: WorkItem[]; outcome: string; visible: boolean;
}
export interface CaseStudy {
  context: string; contribution: string; problem: string; approach: string;
  decisions: string; validation: string; outcome: string;
}
export interface Project {
  id: string; name: string; category: string; summary: string; status: string;
  tech: string[]; scope: string[]; caseStudy: CaseStudy;
  demoUrl: string; repoUrl: string; sourceNote: string; visible: boolean;
}
export interface StackItem { name: string; description: string; visible: boolean }
export interface StackGroup { id: string; name: string; items: StackItem[]; visible: boolean }
export interface Step { title: string; text: string }
export interface Contact { email: string; github: string; linkedin: string; resumeUrl: string }

export interface Content {
  profile: Profile;
  pages: PageConfig[];
  about: string;
  work: WorkEntry[];
  projects: Project[];
  how: { intro: string; steps: Step[] };
  stack: StackGroup[];
  contact: Contact;
  updated: string;
}

export interface NavChild { title: string; href: string }
export interface NavItem { id: PageId; href: string; title: string; group: string; children?: NavChild[] }
export interface SearchEntry { title: string; kind: string; href: string; text?: string }
