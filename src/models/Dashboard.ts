import mongoose, { Schema, Document } from "mongoose";

export interface IDashboard extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  layout: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DashboardSchema = new Schema<IDashboard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    layout: { type: String, default: "[]" },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index: fast lookup of all dashboards for a user
DashboardSchema.index({ userId: 1, isDefault: -1 });

export default mongoose.models.Dashboard || mongoose.model<IDashboard>("Dashboard", DashboardSchema);
