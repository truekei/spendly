import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
          <Button
            onClick={async () => {
              await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
              setUser(null);
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button onClick={() => (window.location.href = "/login")}>Login</Button>
      )}
    </div>
  );
}
