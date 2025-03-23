import { PhishingAttemptStatus } from "../enums";

export interface PhishingAttempt {
  id?: string;
  recipientEmail: string;
  emailContent: string;
  status: PhishingAttemptStatus;
  trackingToken: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
