import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  async function fetchUser() {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {user && <AppSidebar {...user} />}
        <main className="flex-1 bg-background">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
