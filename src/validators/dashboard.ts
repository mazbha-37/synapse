import { z } from "zod";

export const createDashboardSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  isDefault: z.boolean().optional(),
});

export const updateDashboardSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters").optional(),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  isDefault: z.boolean().optional(),
});

export const updateLayoutSchema = z.object({
  layout: z.string(), // JSON string from react-grid-layout
});

export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;
export type UpdateDashboardInput = z.infer<typeof updateDashboardSchema>;
export type UpdateLayoutInput = z.infer<typeof updateLayoutSchema>;
