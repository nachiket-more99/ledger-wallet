import { Wallet, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { mockUserDetails } from "@/lib/mock-data";

export function Navbar() {
  const user = mockUserDetails

  const initials = user.firstName[0] +  user.lastName[0];

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="text-lg font-bold tracking-tight text-foreground">
            Ledger Wallet
          </div>
        </NavLink>

        {/* Center */}
        <div className="flex flex-1 justify-center gap-1 mx-auto ">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "rounded-md px-3 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground"
                : "rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "rounded-md px-3 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground"
                : "rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            }
          >
            Transactions
          </NavLink>
        </div>

        {/* Right: Avatar */}
        <div className="ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <button>
                <Avatar className="h-9 w-9 cursor-pointer ">
                  <AvatarFallback className="text-sm bg-primary/10 font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-1" align="end">
              <div className="pl-2 py-1.5 pr-11">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full px-2 py-1.5 flex items-center gap-2 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-normal">Log out</span>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </header>
  );
}
