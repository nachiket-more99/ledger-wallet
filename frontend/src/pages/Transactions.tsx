import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAllTransactions } from "@/hooks/useAllTransactions";
import { ArrowUpRight } from "lucide-react"; // Import the icon

export type Transaction = {
  title: string;
  date: string;
  amount: number;
  type: string;
  direction: "IN" | "OUT";
  referenceId: string;
};

export function Transactions() {
  const { data: transactions, isLoading: transactionsLoading } = useAllTransactions();

  if (transactionsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Transactions</h1>
      <Card className="p-0">
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            /* Empty State: Matching Dashboard Style */
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <ArrowUpRight className="mb-2 h-10 w-10 opacity-20" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here.</p>
            </div>
          ) : (
            /* Table State */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn: Transaction) => (
                  <TableRow key={txn.referenceId}>
                    <TableCell className="text-sm">
                      {txn.date.split("T")[0]}
                    </TableCell>
                    <TableCell className="text-sm">{txn.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          txn.type === "CREDIT"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }
                      >
                        {txn.type === "CREDIT" ? "Credit" : "Debit"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {txn.referenceId}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      <span
                        className={
                          txn.type === "CREDIT"
                            ? "text-success"
                            : "text-destructive"
                        }
                      >
                        {txn.type === "CREDIT" ? "+" : "–"} ₹
                        {txn.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}