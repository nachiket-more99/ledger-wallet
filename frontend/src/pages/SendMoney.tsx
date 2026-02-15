import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useBalance } from "@/hooks/useBalance";
import { sendMoney } from "@/api/transfer.api";

type Status = "form" | "pending" | "success" | "failed";

export default function SendMoney() {
  const navigate = useNavigate();
  const { data: balance, isLoading: balanceLoading } = useBalance();

  if (balanceLoading) {
    return <div>Loading...</div>;
  }
  const queryClient = useQueryClient();
  const [recipientEmail, setrecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("form");
  const [errors, setErrors] = useState<{
    recipientEmail?: string;
    amount?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    const val = parseFloat(amount);
    if (!val || val <= 0) newErrors.amount = "Enter a valid amount";
    if (val > 100000) newErrors.amount = "Maximum ₹1,00,000 per transaction";
    if (!recipientEmail)
      newErrors.recipientEmail = "Recipient email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    setStatus("pending");

    const transferRes = await sendMoney(recipientEmail, amount);

    setStatus(transferRes.status == "SUCCESS" ? "success" : "failed");

    // refresh app data
    queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    queryClient.invalidateQueries({ queryKey: ["transactions", "recent"] });
    queryClient.invalidateQueries({ queryKey: ["transactions", "all"] });
  };

  if (status === "pending") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="py-12">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Processing transfer</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while we transfer the money
            </p>
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
            <p className="text-lg font-semibold">
              ₹{parseFloat(amount)} sent
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Money sent to {recipientEmail}
            </p>
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
            <p className="text-lg font-semibold">Transfer failed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong. Please try again.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => setStatus("form")}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
            Send Money
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Recipient Email</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  className="pl-7"
                  value={recipientEmail}
                  onChange={(e) => setrecipientEmail(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.recipientEmail && <p className="text-xs text-destructive">{errors.recipientEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  ₹
                </span>
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
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
              <p className="text-xs text-muted-foreground">
                Available: ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Send Money
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
