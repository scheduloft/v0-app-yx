// Email types
export interface EmailMessage {
  to: string
  toName: string
  subject: string
  textContent: string
  htmlContent?: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType: string
  }>
}

export interface EmailSendResult {
  success: boolean
  providerId: string
  messageId?: string
  error?: string
  timestamp: string
}

export interface EmailProvider {
  sendEmail(message: EmailMessage): Promise<EmailSendResult>
}

// SMS types
export interface SMSMessage {
  to: string
  content: string
}

export interface SMSSendResult {
  success: boolean
  providerId: string
  messageId?: string
  error?: string
  timestamp: string
}

export interface SMSProvider {
  sendSMS(message: SMSMessage): Promise<SMSSendResult>
}

// Provider configuration types
export interface EmailProviderConfig {
  type: "sendgrid" | "mailgun" | "smtp"
  apiKey?: string
  domain?: string // For Mailgun
  host?: string // For SMTP
  port?: number // For SMTP
  secure?: boolean // For SMTP
  username?: string // For SMTP
  password?: string // For SMTP
  fromEmail: string
  fromName: string
  isDefault: boolean
  enabled: boolean
}

export interface SMSProviderConfig {
  type: "twilio" | "vonage" | "messagebird"
  accountSid?: string // For Twilio
  authToken?: string // For Twilio
  apiKey?: string // For Vonage and MessageBird
  apiSecret?: string // For Vonage
  fromNumber?: string // For Twilio
  fromName?: string // For Vonage and MessageBird
  isDefault: boolean
  enabled: boolean
}

// Notification delivery status
export enum DeliveryStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  FAILED = "failed",
  BOUNCED = "bounced",
  REJECTED = "rejected",
  OPENED = "opened",
  CLICKED = "clicked",
}

// Notification delivery tracking
export interface DeliveryTracking {
  providerId: string
  providerMessageId?: string
  status: DeliveryStatus
  timestamp: string
  statusUpdates: Array<{
    status: DeliveryStatus
    timestamp: string
    metadata?: Record<string, any>
  }>
  error?: string
}

// Extended notification history with delivery tracking
export interface ExtendedNotificationHistory {
  id: string
  customerId: string
  customerName: string
  type: "email" | "sms"
  templateId: string
  subject?: string
  body: string
  delivery: DeliveryTracking
  readTimestamp?: string
}
