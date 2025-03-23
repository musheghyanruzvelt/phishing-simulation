import { PhishingAttemptStatus } from "@phishing-simulation/types";
import * as mongoose from "mongoose";

export const PhishingAttemptSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    emailContent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PhishingAttemptStatus),
      default: PhishingAttemptStatus.PENDING,
    },
    trackingToken: {
      type: String,
      required: false,
      unique: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_: any, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

PhishingAttemptSchema.index({ trackingToken: 1 }, { unique: true });
