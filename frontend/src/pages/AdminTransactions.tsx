import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/Loader";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { Badge } from "@/components/ui/badge";

export type Transaction = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  type: string;
  referenceId: string;
  amount: number;
  createdAt: string;
};

export default function AdminTransaction() {
  const [search, setSearch] = useState("");
  const { data: transactions, isLoading } = useAdminTransactions();

  if (isLoading) {
    return <Loader />;
  }

  const filtered = transactions.filter(
    (transaction: Transaction) =>
      transaction.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      transaction.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(search.toLowerCase()),
  );

  const hasTransactions = filtered.length > 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Transactions</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!hasTransactions ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <ArrowUpRight className="mb-2 h-10 w-10 opacity-20" />
          <p className="text-lg font-medium">
            {search ? "No matches found" : "No transactions yet"}
          </p>
          <p className="text-sm">
            {search
              ? "Try adjusting your search terms."
              : "Transaction information will appear here."}
          </p>
        </div>
      ) : (
        <Card className="p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((transaction: Transaction) => (
                  <TableRow key={transaction.user.email}>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.createdAt.split("T")[0]}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.user.firstName} {transaction.user.lastName}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      <Badge
                        variant="secondary"
                        className={
                          transaction.type === "CREDIT"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }
                      >
                        {transaction.type === "CREDIT" ? "Credit" : "Debit"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.referenceId}
                    </TableCell>

                    <TableCell className="text-sm font-semibold">
                      {/* ₹{transaction.amount.toLocaleString("en-IN")} */}
                      <span
                        className={
                          transaction.type === "CREDIT"
                            ? "text-success"
                            : "text-destructive"
                        }
                      >
                        {transaction.type === "CREDIT" ? "+" : "–"}{" ₹"}
                        {transaction.amount.toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
