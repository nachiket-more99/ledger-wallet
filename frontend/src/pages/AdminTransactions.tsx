
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Loader } from "@/components/Loader";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Transaction = {
  id?: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  type: "CREDIT" | "DEBIT";
  referenceType: "PAYMENT" | "TRANSFER";
  referenceId: string;
  amount: number;
  createdAt: string;
};

type TransactionFilter = "ALL" | "PAYMENT" | "TRANSFER";

export default function AdminTransaction() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>("ALL");

  const {
    data: result = { transactions: [], totalPages: 1, total: 0 },
    isLoading,
    isFetching,
  } = useAdminTransactions(search, page, filter);

  console.log("Admin transactions:", result.transactions);

  const hasTransactions = result.transactions.length > 0;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">All Transactions</h1>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            aria-label="Filter transaction type"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as TransactionFilter);
              setPage(1);
            }}
          >
            <option value="ALL">All transactions</option>
            <option value="PAYMENT">Payments</option>
            <option value="TRANSFER">Transfers</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] w-full items-center justify-center">
          <Loader className="inset-auto" />
        </div>
      ) : !hasTransactions ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <ArrowUpRight className="mb-2 h-10 w-10 opacity-20" />
          <p className="text-lg font-medium">
            {search || filter !== "ALL"
              ? "No matches found"
              : "No transactions yet"}
          </p>
          <p className="text-sm">
            Try changing your search or transaction filter.
          </p>
        </div>
      ) : (
        <>
          <Card className="p-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Reference ID</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {result.transactions.map(
                    (transaction: Transaction, index: number) => (
                      <TableRow
                        key={
                          transaction.id ??
                          `${transaction.referenceId}-${transaction.user.email}-${transaction.type}-${index}`
                        }
                      >
                        <TableCell className="text-sm text-muted-foreground">
                          {transaction.createdAt.split("T")[0]}
                        </TableCell>

                        <TableCell className="font-medium">
                          {transaction.user.firstName}{" "}
                          {transaction.user.lastName}
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {transaction.user.email}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              transaction.referenceType === "PAYMENT"
                                ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                                : "border-violet-500/30 bg-violet-500/10 text-violet-600"
                            }
                          >
                            {transaction.referenceType === "PAYMENT"
                              ? "Payment"
                              : "Transfer"}
                          </Badge>
                        </TableCell>

                        <TableCell>
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

                        <TableCell className="max-w-48 truncate text-sm text-muted-foreground">
                          {transaction.referenceId}
                        </TableCell>

                        <TableCell className="text-sm font-semibold">
                          <span
                            className={
                              transaction.type === "CREDIT"
                                ? "text-success"
                                : "text-destructive"
                            }
                          >
                            {transaction.type === "CREDIT" ? "+" : "−"} ₹
                            {transaction.amount.toLocaleString("en-IN")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Pagination className="mx-0 flex w-auto items-center justify-center">
              <PaginationContent className="flex items-center gap-8">
                <PaginationItem>
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                </PaginationItem>

                <PaginationItem>
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    Page {page} of {result.totalPages}
                    {isFetching && " • Updating…"}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <Button
                    variant="outline"
                    disabled={page >= result.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(result.totalPages, p + 1))
                    }
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
