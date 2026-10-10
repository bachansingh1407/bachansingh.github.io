"use client";

import { useEffect, useState } from "react";
import { ADMIN_THEMES } from "@/lib/themes";

/** Four admin themes (two day, two night) plus System. Remembered per browser in a cookie, applied on the server. */
export function AdminThemeSwitch() {
  const [v, setV] = useState("system");
  useEffect(() => { setV(document.getElementById("adm-root")?.dataset.adminTheme ?? "system"); }, []);
  return (
    <div className="adm-field" style={{ margin: 0 }}>
      <label className="sr-only" htmlFor="adm-theme">Admin theme</label>
      <select id="adm-theme" value={v} style={{ minWidth: "8.5rem" }}
        onChange={(e) => {
          const t = e.target.value;
          setV(t);
          const root = document.getElementById("adm-root");
          if (root) root.dataset.adminTheme = t;
          document.cookie = `pf_admin_theme=${t}; path=/; max-age=31536000; samesite=lax`;
        }}>
        <optgroup label="Day">{ADMIN_THEMES.filter((t) => t.mode === "light").map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>
        <optgroup label="Night">{ADMIN_THEMES.filter((t) => t.mode === "dark").map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>
        <option value="system">System</option>
      </select>
    </div>
  );
}
