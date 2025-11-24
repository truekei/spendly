import { AppSidebar } from "@/components/app-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { ThemeContext } from "@/contexts/ThemeContext";
import { UserContext } from "@/contexts/UserContext";
import { getCookie, setCookie } from "@/lib/utils";
import type { User } from "@/types/User";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

type Theme = "light" | "dark";

export default function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(
    (getCookie("theme") as Theme) || "light"
  );

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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

  useEffect(() => {
    const root = document.documentElement;

    root.classList.add("no-theme-transition");

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    setCookie("theme", theme);

    setTimeout(() => {
      root.classList.remove("no-theme-transition");
    }, 50);
  }, [theme]);

  if (loading) return <p>Loading...</p>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <UserContext.Provider value={{ user, refetchUser }}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {user && <AppSidebar />}
            <main className="flex-1 bg-background pr-1">
              <div className="flex justify-between pr-5 py-3 mb-5 items-center sticky top-0 z-20 bg-background">
                <div className="flex flex-row items-center">
                  <SidebarTrigger />
                  <DynamicBreadcrumb />
                </div>
                <Switch
                  onCheckedChange={toggleTheme}
                  defaultChecked={theme === "dark"}
                />
              </div>
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
