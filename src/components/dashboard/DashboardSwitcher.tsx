"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IDashboard } from "@/types";
import { ChevronDown, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface DashboardSwitcherProps {
  dashboards: IDashboard[];
  currentDashboard: IDashboard | null;
  onDashboardChange: (dashboard: IDashboard) => void;
}

export function DashboardSwitcher({
  dashboards,
  currentDashboard,
  onDashboardChange,
}: DashboardSwitcherProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newDashboardDescription, setNewDashboardDescription] = useState("");

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

      if (!response.ok) throw new Error("Failed to create dashboard");

      const newDashboard = await response.json();
      onDashboardChange(newDashboard);
      setIsCreateDialogOpen(false);
      setNewDashboardName("");
      setNewDashboardDescription("");
      toast.success("Dashboard created successfully");
    } catch {
      toast.error("Failed to create dashboard");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between w-[160px] sm:w-[200px] border rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors">
          <span className="truncate">{currentDashboard?.name || "Select Dashboard"}</span>
          <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>My Dashboards</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dashboards.map((dashboard) => (
            <DropdownMenuItem
              key={dashboard._id.toString()}
              onClick={() => onDashboardChange(dashboard)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{dashboard.name}</span>
              {currentDashboard?._id.toString() === dashboard._id.toString() && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </>
  );
}
