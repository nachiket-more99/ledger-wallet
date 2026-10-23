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
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Loader } from "@/components/Loader";

export type User = {
  firstName: string;
  lastName: string;
  balance: number;
  email: string;
  createdAt: string;
};

export default function AdminUsers() {
  // const [search, setSearch] = useState("");
  // const { data, isLoading } = useAdminUsers();
  // const users = data?.users || [];

  // const filtered = users.filter(
  //   (user: User) =>
  //     user.firstName.toLowerCase().includes(search.toLowerCase()) ||
  //     user.lastName.toLowerCase().includes(search.toLowerCase()) ||
  //     user.email.toLowerCase().includes(search.toLowerCase()),
  // );

  // const hasUsers = filtered.length > 0;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers(search, page);
  const users: User[] = data?.users || [];
  const hasUsers = users.length > 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users…"
            className="pl-9"
            value={search}
            // onChange={(e) => setSearch(e.target.value)}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <>
        {isLoading ? (
          <div className="flex flex-1 min-h-[400px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader className="inset-auto" />
            </div>
          </div>
        ) : (
          <>
            {!hasUsers ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <ArrowUpRight className="mb-2 h-10 w-10 opacity-20" />
                <p className="text-lg font-medium">
                  {search ? "No matches found" : "No Users yet"}
                </p>
                <p className="text-sm">
                  {search
                    ? "Try adjusting your search terms."
                    : "User information will appear here."}
                </p>
              </div>
            ) : (
              <>
                <Card className="p-0">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* {filtered.map((user: User) => ( */}
                        {users.map((user: User) => (
                          <TableRow key={user.email}>
                            <TableCell className="font-medium">
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell className="text-sm font-semibold">
                              ₹{user.balance.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.createdAt.split("T")[0]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="flex items-center justify-between py-4">
                  <p className="text-sm text-muted-foreground">
                    {data?.total ?? 0} users · Page {page} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      disabled={page <= 1 || isLoading}
                      onClick={() => setPage((current) => current - 1)}
                    >
                      Previous
                    </button>

                    <button
                      className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                      disabled={page >= totalPages || isLoading}
                      onClick={() => setPage((current) => current + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </>
    </div>
  );
}
