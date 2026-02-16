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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader } from "@/components/Loader";
import { useAdminTransactions } from "@/hooks/useAdminTransactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const {
    data: result,
    isLoading,
    isFetching,
  } = useAdminTransactions(page);

  if (isLoading) {
    return <Loader />;
  }

  const filtered = result.transactions.filter(
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
        <>
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
                    <TableRow>
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
                          {transaction.type === "CREDIT" ? "+" : "–"}
                          {" ₹"}
                          {transaction.amount.toLocaleString("en-IN")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="mt-6">
            {hasTransactions && (
              <Pagination className="w-auto mx-0 flex items-center justify-center">
                <PaginationContent className="flex items-center gap-8">
                  <PaginationItem>
                    <Button
                      variant="outline"
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                  </PaginationItem>

                  {/* Wrap the span in an item to keep flex behavior consistent */}
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Page {page} of {result.totalPages}
                      {isFetching && " • Updating…"}
                    </span>
                  </PaginationItem>

                  <PaginationItem>
                    <Button
                      variant="outline"
                      className={
                        page === result.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      onClick={() =>
                        setPage((p) => Math.min(result.totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}
    </div>
  );
}
