import { Sidebar } from "@/components/sidebar";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getSession();
  return (
    <div className="min-h-screen">
      <Sidebar name={profile.full_name} email={user.email ?? ""} />
      <main className="px-4 py-6 sm:px-6 sm:py-8 lg:ml-[264px] lg:px-10 lg:py-10">
        <div className="fade-in mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
