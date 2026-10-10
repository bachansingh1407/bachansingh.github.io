import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_THEME_IDS } from "@/lib/themes";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = (await cookies()).get("pf_admin_theme")?.value ?? "";
  const theme = ADMIN_THEME_IDS.includes(t) ? t : "system";
  return <div className="adm-scope" id="adm-root" data-admin-theme={theme}>{children}</div>;
}
