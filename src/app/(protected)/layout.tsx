import { getCurrentAdminContext } from "@/utils/admin";
import { redirect } from "next/navigation";
import Header from "@/components/header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await getCurrentAdminContext();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header userEmail={user.email ?? null} isAdmin={isAdmin} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
