import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
