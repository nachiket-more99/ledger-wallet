import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { UserLayout } from "./layouts/UserLayout";
import { Transactions } from "./pages/Transactions";
import AddMoney from "./pages/AddMoney";
import SendMoney from "./pages/SendMoney";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add-money" element={<AddMoney />} />
          <Route path="/send-money" element={<SendMoney />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
