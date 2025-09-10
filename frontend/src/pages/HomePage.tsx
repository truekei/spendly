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
    <div className="justify-center p-4">
      <div className="flex justify-between">
        <div></div>

        {/* Welcome Message */}
        <div>
          {user ? (
            <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
          ) : (
            <h1 className="text-2xl font-bold">Welcome, Guest 👋</h1>
          )}
        </div>

        {/* Login/Logout Button */}
        <div>
          {user ? (
            <Button
                onClick={async () => {
                  await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
                  setUser(null);
                }}
              >
                Logout
              </Button>
          ) : (
            <Button onClick={() => (window.location.href = "/login")}>Login</Button>
          )}
        </div>
      </div>
        {user && (
          <>
            <Button onClick={() => (window.location.href = "/transaction")}>Add Spending</Button>
            <Button onClick={() => (window.location.href = "/transaction")}>Add Income</Button>
          </>
        )}
    </div>
  );
}
