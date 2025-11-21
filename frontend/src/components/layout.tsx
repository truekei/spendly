import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { UserContext } from "@/contexts/UserContext";
import type { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refetchUser() {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      setUser(res.data.user);
      console.log("User data refetched");
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <UserContext.Provider value={{ user, refetchUser }}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {user && <AppSidebar />}
          <main className="flex-1 bg-background pt-3 space-y-8 pr-1">
            <div className="flex justify-between pr-5">
              <div className="flex flex-row items-center">
                <SidebarTrigger />
                <DynamicBreadcrumb />
              </div>
              <Switch />
            </div>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </UserContext.Provider>
  );
}
