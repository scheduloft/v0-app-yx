import type { EmailProvider, SMSProvider, EmailProviderConfig, SMSProviderConfig } from "@/utils/notification-types"
import { SendGridProvider, MailgunProvider, SMTPProvider } from "@/utils/providers/email-providers"
import { TwilioProvider, VonageProvider, MessageBirdProvider } from "@/utils/providers/sms-providers"

// Create email provider based on configuration
export function createEmailProvider(config: EmailProviderConfig): EmailProvider | null {
  if (!config.enabled) {
    return null
  }

  try {
    switch (config.type) {
      case "sendgrid":
        if (!config.apiKey) {
          throw new Error("SendGrid API key is required")
        }
        return new SendGridProvider(config.apiKey, config.fromEmail, config.fromName)

      case "mailgun":
        if (!config.apiKey || !config.domain) {
          throw new Error("Mailgun API key and domain are required")
        }
        return new MailgunProvider(config.apiKey, config.domain, config.fromEmail, config.fromName)

      case "smtp":
        if (!config.host || !config.port || !config.username || !config.password) {
          throw new Error("SMTP host, port, username, and password are required")
        }
        return new SMTPProvider(
          config.host,
          config.port,
          config.secure || false,
          config.username,
          config.password,
          config.fromEmail,
          config.fromName,
        )

      default:
        throw new Error(`Unsupported email provider type: ${config.type}`)
    }
  } catch (error) {
    console.error(`Failed to create email provider (${config.type}):`, error)
    return null
  }
}

// Create SMS provider based on configuration
export function createSMSProvider(config: SMSProviderConfig): SMSProvider | null {
  if (!config.enabled) {
    return null
  }

  try {
    switch (config.type) {
      case "twilio":
        if (!config.accountSid || !config.authToken || !config.fromNumber) {
          throw new Error("Twilio account SID, auth token, and from number are required")
        }
        return new TwilioProvider(config.accountSid, config.authToken, config.fromNumber)

      case "vonage":
        if (!config.apiKey || !config.apiSecret || !config.fromName) {
          throw new Error("Vonage API key, API secret, and from name are required")
        }
        return new VonageProvider(config.apiKey, config.apiSecret, config.fromName)

      case "messagebird":
        if (!config.apiKey || !config.fromName) {
          throw new Error("MessageBird API key and originator are required")
        }
        return new MessageBirdProvider(config.apiKey, config.fromName)

      default:
        throw new Error(`Unsupported SMS provider type: ${config.type}`)
    }
  } catch (error) {
    console.error(`Failed to create SMS provider (${config.type}):`, error)
    return null
  }
}
