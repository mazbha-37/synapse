"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, LayoutDashboard, Trash2, Edit, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { IDashboard } from "@/types";

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState<IDashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newDashboardDescription, setNewDashboardDescription] = useState("");

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await fetch("/api/dashboards");
      if (response.ok) {
        const data = await response.json();
        setDashboards(data);
      }
    } catch {
      toast.error("Failed to fetch dashboards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDashboard = async () => {
    try {
      const response = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDashboardName,
          description: newDashboardDescription,
        }),
      });

      if (response.ok) {
        toast.success("Dashboard created successfully");
        setIsCreateDialogOpen(false);
        setNewDashboardName("");
        setNewDashboardDescription("");
        fetchDashboards();
      } else {
        throw new Error("Failed to create dashboard");
      }
    } catch {
      toast.error("Failed to create dashboard");
    }
  };

  const handleDeleteDashboard = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Dashboard deleted");
        fetchDashboards();
      } else {
        throw new Error("Failed to delete dashboard");
      }
    } catch {
      toast.error("Failed to delete dashboard");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        toast.success("Default dashboard updated");
        fetchDashboards();
      } else {
        throw new Error("Failed to update dashboard");
      }
    } catch {
      toast.error("Failed to update dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Dashboards</h1>
            <p className="text-muted-foreground">Manage your dashboards</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Dashboards</h1>
          <p className="text-muted-foreground">Manage your dashboards</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Dashboard
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((dashboard) => (
          <Card key={dashboard._id.toString()} className="group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard?id=${dashboard._id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {dashboard.name}
                      {dashboard.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Created {formatDate(dashboard.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/dashboard?id=${dashboard._id}`} className="flex items-center w-full">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Open
                      </Link>
                    </DropdownMenuItem>
                    {!dashboard.isDefault && (
                      <DropdownMenuItem
                        onClick={() => handleSetDefault(dashboard._id.toString())}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteDashboard(dashboard._id.toString())}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dashboard.description || "No description"}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        <Card
          className="border-dashed cursor-pointer hover:border-primary transition-colors"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Create New Dashboard</p>
            <p className="text-sm text-muted-foreground">
              Add a new dashboard to organize your widgets
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Create a new dashboard to organize your widgets
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My New Dashboard"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your dashboard"
                value={newDashboardDescription}
                onChange={(e) => setNewDashboardDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateDashboard}
              disabled={!newDashboardName.trim()}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
