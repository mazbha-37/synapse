import mongoose, { Schema, Document } from "mongoose";
import { WidgetType } from "@/types";

export interface IWidget extends Document {
  dashboardId: mongoose.Types.ObjectId;
  type: WidgetType;
  config: Record<string, unknown>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  lastFetchedAt?: Date;
  cachedData?: string;
  createdAt: Date;
}

const WidgetSchema = new Schema<IWidget>(
  {
    dashboardId: { type: Schema.Types.ObjectId, ref: "Dashboard", required: true, index: true },
    type: {
      type: String,
      enum: ["weather", "news", "crypto", "github", "nasa", "air-quality", "forex", "stocks", "earthquake", "quote", "holidays"],
      required: true,
    },
    config: { type: Schema.Types.Mixed, default: {} },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      w: { type: Number, default: 4 },
      h: { type: Number, default: 3 },
    },
    lastFetchedAt: { type: Date },
    cachedData: { type: String },
  },
  { timestamps: true }
);

// Clear cached model so schema changes take effect on hot-reload
if (mongoose.models.Widget) {
  delete (mongoose.models as Record<string, unknown>).Widget;
}
export default mongoose.model<IWidget>("Widget", WidgetSchema);
