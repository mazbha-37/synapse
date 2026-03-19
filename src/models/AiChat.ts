import mongoose, { Schema, Document } from "mongoose";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IAiChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: ChatMessage[];
  widgetContext?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AiChatSchema = new Schema<IAiChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    widgetContext: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.AiChat || mongoose.model<IAiChat>("AiChat", AiChatSchema);
