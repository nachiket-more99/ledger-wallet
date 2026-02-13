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

export function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md py-8">
        <CardHeader className="flex flex-col space-y-1.5 p-0 items-center gap-0">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription>Join Ledger Wallet today</CardDescription>
        </CardHeader>

        <form onSubmit={handleSignUp}>
          <CardContent className="flex flex-col gap-6 px-6 pb-6">
            {/* Email */}
            <div className="grid gap-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-1">
              <Label>Confirm Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full">
              Register
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                className="font-medium text-primary hover:underline"
                href="/"
              >
                Log in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
