import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Status = "form" | "pending" | "success" | "failed";

export default function AddMoney() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("form");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError("Enter a valid amount"); return; }
    if (val > 100000) { setError("Maximum ₹1,00,000 per transaction"); return; }
    setError("");
    setStatus("pending");
    // Simulate payment
    setTimeout(() => {
      setStatus(Math.random() > 0.2 ? "success" : "failed");
    }, 2000);
  };

  if (status === "pending") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="py-12">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Processing payment…</p>
            <p className="mt-1 text-sm text-muted-foreground">Please wait while we add money to your wallet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="py-12">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-success" />
            <p className="text-lg font-semibold">₹{parseFloat(amount)} added successfully</p>
            <p className="mt-1 text-sm text-muted-foreground">Your wallet has been updated</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-6">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="py-12">
            <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <p className="text-lg font-semibold">Payment failed</p>
            <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
            <div className="mt-6 flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button onClick={() => setStatus("form")}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight">Add Money</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg">
              Proceed to Pay
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
