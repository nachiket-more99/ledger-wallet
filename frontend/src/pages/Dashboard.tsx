import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  SendHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  mockTransactions,
  mockBalance,
  mockUserDetails,
} from "@/lib/mock-data";

interface Transactions {
  title: string;
  date: string;
  amount: number;
  direction: string;
  referenceId: string;
}

export function Dashboard() {
  const userTxns: Transactions[] = mockTransactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <Card className="bg-primary text-primary-foreground shadow-xl py-0">
        <div className="p-8">
          <p className="text-sm font-medium opacity-80">Available Balance</p>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            ₹{mockBalance.balance.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-sm opacity-70">
            {mockUserDetails.firstName} {mockUserDetails.lastName} ·{" "}
            {mockUserDetails.email}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button asChild size="lg" className="h-14 text-base">
          <Link to="/add-money">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Money
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14 text-base">
          <Link to="/send-money">
            <SendHorizontal className="mr-2 h-5 w-5" />
            Send Money
          </Link>
        </Button>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <Card className="py-0">
          <CardContent className="divide-y p-0">
            {userTxns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ArrowUpRight className="mb-2 h-8 w-8" />
                <p className="font-medium">No transactions yet</p>
                <p className="text-sm">Add money to get started</p>
              </div>
            ) : (
              userTxns.map((txn) => (
                <div
                  key={txn.referenceId}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        txn.direction === "IN"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {txn.direction === "IN" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.date.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      txn.direction === "IN"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {txn.direction === "IN" ? "+" : "–"} ₹
                    {txn.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
