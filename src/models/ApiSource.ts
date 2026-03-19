import mongoose, { Schema, Document } from "mongoose";
import { ApiStatus } from "@/types";

export interface IApiSource extends Document {
  name: string;
  slug: string;
  baseUrl: string;
  status: ApiStatus;
  avgResponseMs: number;
  lastCheckedAt?: Date;
  dailyCallCount: number;
  dailyLimit: number;
  errorCount: number;
  lastErrorMessage?: string;
}

const ApiSourceSchema = new Schema<IApiSource>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    baseUrl: { type: String, required: true },
    status: { type: String, enum: ["healthy", "degraded", "down"], default: "healthy" },
    avgResponseMs: { type: Number, default: 0 },
    lastCheckedAt: { type: Date },
    dailyCallCount: { type: Number, default: 0 },
    dailyLimit: { type: Number, required: true },
    errorCount: { type: Number, default: 0 },
    lastErrorMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ApiSource || mongoose.model<IApiSource>("ApiSource", ApiSourceSchema);
