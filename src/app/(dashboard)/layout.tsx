import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatContainer } from "@/components/dashboard/ChatContainer";

export default async function DashboardLayout() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, redirect to login
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <ChatContainer user={user} />
    </div>
  );
}
