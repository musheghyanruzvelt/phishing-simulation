export interface PhishingAttempt {
  id?: string;
  recipientEmail: string;
  emailContent: string;
  status: 'PENDING' | 'SENT' | 'CLICKED' | 'FAILED';
  trackingToken: string;
  sentAt?: Date;
  clickedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
