
import { useState } from "react";
import {
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
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
  const [expandedTransfers, setExpandedTransfers] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: result = { transactions: [], totalPages: 1, total: 0 },
    isLoading,
    isFetching,
  } = useAdminTransactions(search, page, filter);

  // Group transfer entries by their shared reference ID.
  // Payments remain individual rows.
  const transferGroups = new Map<string, Transaction[]>();
  const displayRows: Array<
    | {
        kind: "PAYMENT";
        key: string;
        createdAt: string;
        transaction: Transaction;
      }
    | {
        kind: "TRANSFER";
        key: string;
        createdAt: string;
        referenceId: string;
        entries: Transaction[];
        debit?: Transaction;
        credit?: Transaction;
      }
  > = [];

  result.transactions.forEach((transaction: Transaction, index: number) => {
    if (transaction.referenceType === "TRANSFER") {
      const group = transferGroups.get(transaction.referenceId) ?? [];
      group.push(transaction);
      transferGroups.set(transaction.referenceId, group);
    } else {
      displayRows.push({
        kind: "PAYMENT",
        key: `payment:${transaction.id ?? `${transaction.referenceId}:${transaction.createdAt}:${transaction.user.email}:${index}`}`,
        createdAt: transaction.createdAt,
        transaction,
      });
    }
  });

  for (const [referenceId, entries] of transferGroups) {
    const debit = entries.find((entry) => entry.type === "DEBIT");
    const credit = entries.find((entry) => entry.type === "CREDIT");

    displayRows.push({
      kind: "TRANSFER",
      key: `transfer:${referenceId}`,
      referenceId,
      createdAt: entries.reduce(
        (latest, entry) =>
          entry.createdAt > latest ? entry.createdAt : latest,
        entries[0].createdAt,
      ),
      entries: [...entries].sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "DEBIT" ? -1 : 1;
      }),
      debit,
      credit,
    });
  }

  // Keep the newest grouped transaction first.
  displayRows.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const hasTransactions = result.transactions.length > 0;

  const toggleTransfer = (key: string) => {
    setExpandedTransfers((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-IN");

  const fullName = (user: Transaction["user"]) =>
    `${user.firstName} ${user.lastName}`;

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
                setExpandedTransfers(new Set());
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
              setExpandedTransfers(new Set());
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
                    <TableHead>User / Parties</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Reference ID</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {displayRows.map((row) => {
                    if (row.kind === "PAYMENT") {
                      const transaction = row.transaction;

                      return (
                        <TableRow key={row.key}>
                          <TableCell className="text-sm text-muted-foreground">
                            {transaction.createdAt.split("T")[0]}
                          </TableCell>

                          <TableCell className="font-medium">
                            {fullName(transaction.user)}
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {transaction.user.email}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-blue-500/30 bg-blue-500/10 text-blue-600"
                            >
                              Payment
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                transaction.type === "CREDIT"
                                  ? "bg-success/10 text-success"
                                  : "bg-destructive/10 text-destructive"
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
                              {formatAmount(transaction.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    const isExpanded = expandedTransfers.has(row.key);
                    const amount =
                      row.debit?.amount ??
                      row.credit?.amount ??
                      row.entries[0]?.amount ??
                      0;

                    return (
                      <>
                        <TableRow key={row.key} className="bg-muted/20">
                          <TableCell className="text-sm text-muted-foreground">
                            {row.createdAt.split("T")[0]}
                          </TableCell>

                          <TableCell className="font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="-ml-3 h-auto gap-1 px-2 py-1 font-medium"
                              onClick={() => toggleTransfer(row.key)}
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span>
                                {row.debit && row.credit
                                  ? `${fullName(row.debit.user)} → ${fullName(row.credit.user)}`
                                  : row.debit
                                    ? `${fullName(row.debit.user)} → Recipient`
                                    : row.credit
                                      ? `Sender → ${fullName(row.credit.user)}`
                                      : "Transfer"}
                              </span>
                            </Button>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {row.debit && row.credit
                              ? "Between wallets"
                              : "Entry incomplete"}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-violet-500/30 bg-violet-500/10 text-violet-600"
                            >
                              Transfer
                            </Badge>
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {row.entries.length}{" "}
                            {row.entries.length === 1 ? "entry" : "entries"}
                          </TableCell>

                          <TableCell className="max-w-48 truncate text-sm text-muted-foreground">
                            {row.referenceId}
                          </TableCell>

                          <TableCell className="text-sm font-semibold">
                            ₹{formatAmount(amount)}
                          </TableCell>
                        </TableRow>

                        {isExpanded &&
                          row.entries.map((entry) => (
                            <TableRow
                              key={`${row.key}:${entry.user.email}:${entry.type}`}
                              className="bg-muted/40"
                            >
                              <TableCell className="pl-8 text-xs text-muted-foreground">
                                Ledger entry
                              </TableCell>

                              <TableCell className="pl-8 text-sm">
                                {fullName(entry.user)}
                              </TableCell>

                              <TableCell className="text-sm text-muted-foreground">
                                {entry.user.email}
                              </TableCell>

                              <TableCell>
                                <Badge variant="outline">Transfer entry</Badge>
                              </TableCell>

                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    entry.type === "CREDIT"
                                      ? "bg-success/10 text-success"
                                      : "bg-destructive/10 text-destructive"
                                  }
                                >
                                  {entry.type === "CREDIT" ? "Credit" : "Debit"}
                                </Badge>
                              </TableCell>

                              <TableCell className="max-w-48 truncate text-xs text-muted-foreground">
                                {entry.referenceId}
                              </TableCell>

                              <TableCell className="text-sm font-semibold">
                                <span
                                  className={
                                    entry.type === "CREDIT"
                                      ? "text-success"
                                      : "text-destructive"
                                  }
                                >
                                  {entry.type === "CREDIT" ? "+" : "−"} ₹
                                  {formatAmount(entry.amount)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    );
                  })}
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
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      setExpandedTransfers(new Set());
                    }}
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
                    onClick={() => {
                      setPage((p) => Math.min(result.totalPages, p + 1));
                      setExpandedTransfers(new Set());
                    }}
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
