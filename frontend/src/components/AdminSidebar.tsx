import { Outlet, useNavigate } from "react-router-dom";
import { Wallet, Users, ArrowLeftRight, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { logout } from "@/api/auth.api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useMe } from "@/hooks/useMe";

const adminNav = [
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Transactions", url: "/admin/transactions", icon: ArrowLeftRight },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { data: user, isError } = useMe();

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/");
  };

  if (isError || !user) {
    navigate("/");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="bg-sidebar-background border-r">
          <div className="flex h-16 items-center gap-2 px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-primary-foreground">Admin</span>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-primary-foreground/70">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary-foreground font-medium flex items-center px-2 py-2 rounded"
                            : "flex items-center px-2 py-2 rounded text-sidebar-primary-foreground"
                        }
                      >
                        <item.icon className="mr-4 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="pl-2 py-1.5 pr-11">
                  <p className="text-sm font-medium text-sidebar-primary-foreground">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-sidebar-primary-foreground/70">{user.email}</p>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sidebar-primary-foreground w-full px-2 py-1.5 flex items-center gap-2 justify-start hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-normal">Log out</span>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">
              Ledger Wallet Admin
            </span>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
