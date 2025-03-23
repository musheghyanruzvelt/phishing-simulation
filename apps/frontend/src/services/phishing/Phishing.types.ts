import { PhishingAttempt } from "@phishing-simulation/types";

export interface PhishingEmailRequest {
  recipientEmail: string;
  emailTemplate: string;
  createdBy: string;
}

export interface PhishingSimulationResponse {
  id: string;
  status: string;
  created_at: string;
  message?: string;
}

export interface PhishingAttemptsResponse {
  attempts: PhishingAttempt[];
}
