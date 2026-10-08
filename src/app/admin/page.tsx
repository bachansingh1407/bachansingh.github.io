import { authConfigured, isAuthed } from "@/lib/auth";
import { getContentStrict } from "@/lib/content";
import { AdminApp } from "./AdminApp";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!authConfigured()) {
    return (
      <main className="adm-login">
        <h1>Admin not configured</h1>
        <p>
          Set <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> (at least 16 characters) as environment
          variables, then restart. See the README.
        </p>
      </main>
    );
  }
  if (!(await isAuthed())) return <LoginForm />;
  const content = await getContentStrict();
  return <AdminApp initial={content} />;
}
