import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {user && <AppSidebar {...user} />}
        <main className="flex-1 bg-background pt-3 space-y-8 pr-1">
          <div className="flex justify-between pr-5">
            <div className="flex flex-row items-center">
              <SidebarTrigger />
              <DynamicBreadcrumb />
            </div>
            <Switch />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
