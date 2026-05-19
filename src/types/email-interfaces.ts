export type EmailAttachment = {
  name: string;
  type: string;
  size: number;
  file: File;
};

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  id?: string;
}

export interface EmailAnalytics {
  sent: number;
  failed: number;
  lastSentAt?: string;
  lastFailedAt?: string;
}
