import { contrastChecks, PALETTES, ADMIN_THEMES, themeCss } from "../src/lib/themes";
import { DEFAULT_CONTENT } from "../src/lib/defaults";
import { normalizeContent } from "../src/lib/normalize";
import { toPublic, sameContent } from "../src/lib/public";
import { checkUrl, isValidEmail, validateContent, errorsOnly } from "../src/lib/validate";
import { hit } from "../src/lib/ratelimit";
import { sniff } from "../src/lib/media";
import { applyChange, diffContent, wordDiff } from "../src/lib/changes";
import { layoutFlow } from "../src/lib/flow";
import { buildContext, cleanHistory } from "../src/lib/ai";
import { isPublicHttpsUrl } from "../src/lib/screenshot";
import { isSafeSvgPath } from "../src/lib/icons";
import { suggestions } from "../src/lib/readiness";

let failed = 0;
const ok = (cond: boolean, name: string) => { if (!cond) { failed++; console.log("FAIL", name); } };

// Themes meet WCAG AA
for (const p of PALETTES) for (const m of ["light", "dark"] as const)
  for (const c of contrastChecks(p[m], m)) ok(c.ratio >= c.min, `${p.id} ${m} ${c.label} ${c.ratio.toFixed(2)}`);
for (const t of ADMIN_THEMES) for (const c of contrastChecks(t.colors, t.mode)) ok(c.ratio >= c.min, `admin ${t.id} ${c.label} ${c.ratio.toFixed(2)}`);
ok(PALETTES.length >= 5 && PALETTES.length <= 10, "5-10 palettes");
ok(ADMIN_THEMES.filter((t) => t.mode === "light").length === 2 && ADMIN_THEMES.filter((t) => t.mode === "dark").length === 2, "2 day + 2 night admin themes");
ok(themeCss().includes('data-admin-theme="system"'), "css has system admin");

// Email
for (const e of ["a@b.co", "first.last+tag@sub.example.com"]) ok(isValidEmail(e), "valid " + e);
for (const e of ["", "a@b", "a@@b.com", "a b@c.com", "a@b..com", ".a@b.com", "a@-b.com", "a@b.c", "x".repeat(70) + "@b.com"]) ok(!isValidEmail(e), "invalid " + e);

// URLs: bad links are reported, never silently dropped
ok(checkUrl("https://github.com/x") === null, "good url");
ok(checkUrl("github.com/x")?.fix === "https://github.com/x", "fix suggestion");
ok(checkUrl("javascript:alert(1)") !== null, "js url rejected");
ok(checkUrl("//evil.com") !== null, "protocol-relative rejected");
ok(checkUrl("/resume.pdf", true) === null && checkUrl("/resume.pdf") !== null, "path only when allowed");

// Normalize keeps bad link text, validate flags it
const bad = normalizeContent({ ...DEFAULT_CONTENT, contact: { ...DEFAULT_CONTENT.contact, github: "github.com/x", email: "nope" } });
ok(bad.contact.github === "github.com/x", "normalize keeps bad link (no silent loss)");
const issues = validateContent(bad);
ok(issues.some((i) => i.path === "contact.github" && i.fix), "github flagged with fix");
ok(issues.some((i) => i.path === "contact.email"), "email flagged");

// Caps
const big = normalizeContent({ ...DEFAULT_CONTENT, about: "x".repeat(7000) });
ok(errorsOnly(validateContent(big)).some((i) => i.path === "about"), "about cap");
ok(errorsOnly(validateContent(normalizeContent(DEFAULT_CONTENT))).length === 0, "defaults are publishable");

// Hidden content never leaks
const secret = "SECRET-HIDDEN-" + Date.now();
const c = normalizeContent(DEFAULT_CONTENT);
c.projects[0].name = secret; c.projects[0].visible = false;
c.work[0].blurb = secret; c.work[0].visible = false;
c.stack[0].items[0].name = secret; c.stack[0].items[0].visible = false;
c.testimonials.push({ uid: "t1", quote: secret, name: "n", role: "", visible: false });
ok(!JSON.stringify(toPublic(c)).includes(secret), "hidden items absent from public JSON");
ok(JSON.stringify(toPublic(c, { preview: true })).includes(secret), "preview shows hidden");
const hp = normalizeContent(DEFAULT_CONTENT);
hp.pages.find((p) => p.id === "projects")!.visible = false;
ok(toPublic(hp).projects.length === 0 && !toPublic(hp).pages.some((p) => p.id === "projects"), "hiding Projects hides project pages");
const js = normalizeContent(DEFAULT_CONTENT); js.projects[0].demoUrl = "javascript:alert(1)";
ok(toPublic(js).projects[0].demoUrl === "", "unsafe link never rendered");

// Stable uids survive reordering
const r = normalizeContent(DEFAULT_CONTENT); const ids = r.projects.map((p) => p.uid);
const rev = normalizeContent({ ...r, projects: [...r.projects].reverse() });
ok(JSON.stringify(rev.projects.map((p) => p.uid)) === JSON.stringify([...ids].reverse()), "uids stable");
ok(!sameContent(r, rev) && sameContent(r, { ...r, rev: 9, updated: "x" }), "sameContent");

// Rate limit + sniffing
ok(hit("k", 2, 1000, 0) === 0 && hit("k", 2, 1000, 1) === 0 && hit("k", 2, 1000, 2) > 0 && hit("k", 2, 1000, 2000) === 0, "rate limit");
ok(sniff(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]))?.type === "image/png", "png");
ok(sniff(new TextEncoder().encode("<svg onload=alert(1)>")) === null, "svg rejected");
ok(sniff(new TextEncoder().encode("<?php echo 1;")) === null, "php rejected");

// ---- v3 additions ----
// Input fields are distinct from page and cards (tested via contrast checks above)
ok(themeCss().includes("--field-border:"), "field tokens in css");

// Icons: only plain path data is stored
ok(isSafeSvgPath("M12 3l9 5-9 5z") && !isSafeSvgPath("M0 0<script>") && !isSafeSvgPath('M0 0" onload="x'), "svg path safety");
const withIcon = normalizeContent({ ...DEFAULT_CONTENT, stack: [{ uid: "g", name: "G", items: [{ uid: "i", name: "React", icon: { slug: "react", title: "React", path: "M1 1h2" } }, { uid: "j", name: "Bad", icon: { slug: "bad", title: "x", path: "<svg onload=1>" } }] }] });
ok(withIcon.stack[0].items[0].icon?.slug === "react" && withIcon.stack[0].items[1].icon === null, "unsafe icon dropped, safe kept");

// Flow layout
const nodes = ["a", "b", "c", "d", "e", "f", "g"].map((id, i, all) => ({ id, title: id, text: "", kind: "process" as const, icon: "", from: i ? [all[i - 1]] : [], chips: [] }));
const lay = layoutFlow(nodes, 4);
ok(lay[3].col === 3 && lay[3].band === 0 && lay[4].col === 0 && lay[4].band === 1, "flow wraps into bands");
const branch = layoutFlow([{ ...nodes[0] }, { ...nodes[1], from: ["a"] }, { ...nodes[2], from: ["a"] }], 4);
ok(branch[1].level === 1 && branch[2].level === 1 && branch[2].row === 1, "branches share a column");
ok(layoutFlow([{ ...nodes[0], from: ["b"] }, { ...nodes[1], from: ["a"] }], 3).length === 2, "cycles do not hang");

// Change tracking: old text is recoverable
const v1 = normalizeContent(DEFAULT_CONTENT);
const v2 = structuredClone(v1);
v2.about = "A completely new about text."; v2.projects[0].summary = "New PromptForge summary."; v2.projects[0].caseStudy.decisions = "We chose X.";
const removed = v2.projects.splice(1, 1)[0]; v2.work[0].items.push({ uid: "newitem", title: "New item", text: "t" });
const ch = diffContent(v1, v2);
ok(ch.some((c) => c.kind === "changed" && c.path === "about" && c.before.startsWith("I build admin")), "about change recorded with old text");
ok(ch.some((c) => c.kind === "removed" && c.path === `projects/${removed.uid}`) && ch.some((c) => c.kind === "added" && c.path === "work/w-dev/items/newitem"), "added/removed items recorded");
ok(!ch.some((c) => c.path.startsWith(`projects/${removed.uid}/`)), "removed item's fields are not listed separately");
const restored = structuredClone(v2);
ok(applyChange(restored, ch.find((c) => c.path === "about")!) && restored.about === v1.about, "restore a single old field");
ok(applyChange(restored, ch.find((c) => c.path === `projects/${removed.uid}`)!) && restored.projects.some((p) => p.uid === removed.uid), "restore a removed item");
ok(applyChange(restored, ch.find((c) => c.path.endsWith("/caseStudy/decisions"))!) && restored.projects[0].caseStudy.decisions === "", "restore nested field");
ok(diffContent(v1, v1).length === 0, "no changes when identical");
ok(wordDiff("the quick fox", "the slow fox").map((s) => s.t + ":" + s.s.trim()).join("|").includes("del:quick|add:slow"), "word diff");

// AI context only contains what it is given, and history is sanitised
const sec = "HIDDEN-" + Date.now();
const hc = normalizeContent(DEFAULT_CONTENT); hc.projects[0].name = sec; hc.projects[0].visible = false; hc.about = "Visible about.";
ok(!buildContext(toPublic(hc)).includes(sec) && buildContext(toPublic(hc)).includes("Visible about."), "AI context excludes hidden content");
ok(buildContext(normalizeContent(DEFAULT_CONTENT)).length < 9100, "AI context is capped");
const hist = cleanHistory([{ role: "system", content: "evil" }, { role: "assistant", content: "orphan" }, { role: "user", content: "hi" }, { role: "assistant", content: "yo" }, { role: "tool", content: "x" }, 5]);
ok(hist.length === 2 && hist[0].role === "user" && hist.every((m) => m.role !== ("system" as string)), "history sanitised");

// Screenshot URL safety
for (const u of ["https://example.com", "https://sub.site.dev/path?q=1"]) ok(isPublicHttpsUrl(u), "public ok " + u);
for (const u of ["http://example.com", "https://localhost", "https://127.0.0.1", "https://192.168.1.5", "https://intranet", "https://a.local", "https://user:pw@example.com", "https://example.com:8443", "file:///etc/passwd", "javascript:1", "https://[::1]/"]) ok(!isPublicHttpsUrl(u), "blocked " + u);

// Suggestions carry reasons, steps and a destination
const sg = suggestions(normalizeContent(DEFAULT_CONTENT));
ok(sg.length > 3 && sg.every((x) => x.why && x.how.length >= 2 && x.target.section && x.id), "suggestions have why/how/target");
ok(new Set(sg.map((x) => x.id)).size === sg.length, "suggestion ids unique");

console.log(failed ? `${failed} FAILED` : "all checks passed");
process.exit(failed ? 1 : 0);
