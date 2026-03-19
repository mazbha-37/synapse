"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";

interface AuditLog {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  action: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

const actionTypes = [
  "all",
  "user.login",
  "user.register",
  "user.profile.update",
  "dashboard.create",
  "dashboard.update",
  "dashboard.delete",
  "widget.add",
  "widget.remove",
  "admin.user.update",
];

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page, search, action]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const actionParam = action !== "all" ? `&action=${action}` : "";
      const response = await fetch(
        `/api/admin/logs?page=${page}&limit=50&search=${encodeURIComponent(
          search
        )}${actionParam}`
      );
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setTotalPages(data.pagination.pages);
      }
    } catch {
      toast.error("Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.startsWith("user.")) return "bg-blue-500";
    if (action.startsWith("dashboard.")) return "bg-green-500";
    if (action.startsWith("widget.")) return "bg-yellow-500";
    if (action.startsWith("admin.")) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">
          Review system activity and user actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={action} onValueChange={(v) => setAction(v ?? "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Actions" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="whitespace-nowrap">
                      <span title={new Date(log.createdAt).toLocaleString()}>
                        {formatRelativeTime(log.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.userId ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={log.userId.image} />
                            <AvatarFallback>
                              {getInitials(log.userId.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{log.userId.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          System
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-sm truncate block" title={log.details}>
                        {log.details}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {log.ipAddress || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 border rounded-md disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
