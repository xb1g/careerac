import { getCurrentAdminContext } from "@/utils/admin";
import Header from "@/components/header";

export default async function PlaybooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await getCurrentAdminContext();

  return (
    <div className="flex min-h-screen flex-col">
      <Header userEmail={user?.email ?? null} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
