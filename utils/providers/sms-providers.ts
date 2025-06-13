import type { SMSProvider, SMSMessage, SMSSendResult } from "@/utils/notification-types"

/**
 * Twilio SMS Provider
 * Documentation: https://www.twilio.com/docs/sms/api
 */
export class TwilioProvider implements SMSProvider {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid
    this.authToken = authToken
    this.fromNumber = fromNumber
  }

  async sendSMS(message: SMSMessage): Promise<SMSSendResult> {
    try {
      // In a real implementation, this would use the Twilio API
      const formData = new URLSearchParams()
      formData.append("To", message.to)
      formData.append("From", this.fromNumber)
      formData.append("Body", message.content)

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Twilio API error: ${errorData.message || response.statusText}`)
      }

      const responseData = await response.json()

      return {
        success: true,
        providerId: "twilio",
        messageId: responseData.sid || `twilio_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Twilio send error:", error)
      return {
        success: false,
        providerId: "twilio",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }
    }
  }
}

/**
 * Vonage (formerly Nexmo) SMS Provider
 * Documentation: https://developer.vonage.com/messaging/sms/overview
 */
export class VonageProvider implements SMSProvider {
  private apiKey: string
  private apiSecret: string
  private fromName: string

  constructor(apiKey: string, apiSecret: string, fromName: string) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
    this.fromName = fromName
  }

  async sendSMS(message: SMSMessage): Promise<SMSSendResult> {
    try {
      // In a real implementation, this would use the Vonage API
      const response = await fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_secret: this.apiSecret,
          from: this.fromName,
          to: message.to.replace(/[^0-9]/g, ""), // Remove non-numeric characters
          text: message.content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Vonage API error: ${errorData.message || response.statusText}`)
      }

      const responseData = await response.json()

      // Check if any messages failed
      if (responseData.messages && responseData.messages[0].status !== "0") {
        throw new Error(`Vonage send error: ${responseData.messages[0]["error-text"]}`)
      }

      return {
        success: true,
        providerId: "vonage",
        messageId: responseData.messages?.[0]?.["message-id"] || `vonage_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Vonage send error:", error)
      return {
        success: false,
        providerId: "vonage",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }
    }
  }
}

/**
 * MessageBird SMS Provider
 * Documentation: https://developers.messagebird.com/api/sms-messaging/
 */
export class MessageBirdProvider implements SMSProvider {
  private apiKey: string
  private originator: string

  constructor(apiKey: string, originator: string) {
    this.apiKey = apiKey
    this.originator = originator
  }

  async sendSMS(message: SMSMessage): Promise<SMSSendResult> {
    try {
      // In a real implementation, this would use the MessageBird API
      const response = await fetch("https://rest.messagebird.com/messages", {
        method: "POST",
        headers: {
          Authorization: `AccessKey ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originator: this.originator,
          recipients: [message.to.replace(/[^0-9]/g, "")], // Remove non-numeric characters
          body: message.content,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`MessageBird API error: ${errorData.errors?.[0]?.description || response.statusText}`)
      }

      const responseData = await response.json()

      return {
        success: true,
        providerId: "messagebird",
        messageId: responseData.id || `messagebird_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("MessageBird send error:", error)
      return {
        success: false,
        providerId: "messagebird",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }
    }
  }
}
