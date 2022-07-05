export interface mailConfigurations {
  to: string;
  subject: string;
  text?: string;
  attachments?: any[];
  html?: string;
}
