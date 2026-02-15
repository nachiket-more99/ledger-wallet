import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { login } from "@/api/auth.api";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(email, password);

      navigate("/dashboard");
    } catch (err: any) {
      // ✅ show backend error
      setErrors(err?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md py-8">
        <CardHeader className="flex flex-col space-y-1.5 p-0 items-center gap-0">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Ledger Wallet
          </CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <form onSubmit={handleSignIn}>
          <CardContent className="flex flex-col gap-6 px-6 pb-6">
            {/* Email */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full">
              Log In
            </Button>

            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                className="font-medium text-primary hover:underline"
                href="/register"
              >
                Register
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
