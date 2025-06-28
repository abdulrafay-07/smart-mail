interface Mail {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  date: string;
  snippet: string;
  text: string;
  html?: string;
  attachments?: string[];
  threadId: string;
  messageId: string;
  labels?: string[];
  category: string;
}

export type Mails = Mail[];