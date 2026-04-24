import { createClient, getSafeUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = await getSafeUser(supabase);

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header userEmail={user.email ?? null} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
