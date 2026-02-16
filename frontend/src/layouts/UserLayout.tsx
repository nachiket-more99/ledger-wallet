import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useEffect } from "react";
import { http } from "@/api/http";

export function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await http.get("/user/me");
      } catch (err) {
        navigate("/", { replace: true });
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl p-6 px-4 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
