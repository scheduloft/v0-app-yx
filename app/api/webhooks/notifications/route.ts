import { type NextRequest, NextResponse } from "next/server"
import { DeliveryStatus } from "@/utils/notification-types"

// This would be a real database update in a production app
const updateDeliveryStatus = async (
  provider: string,
  messageId: string,
  status: DeliveryStatus,
  metadata?: Record<string, any>,
) => {
  console.log(`Updating delivery status for ${provider} message ${messageId} to ${status}`, metadata)
  // In a real app, this would update the notification record in the database
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const provider = request.headers.get("x-notification-provider")

    if (!provider) {
      return NextResponse.json({ error: "Missing provider header" }, { status: 400 })
    }

    // Process webhook based on provider
    switch (provider) {
      case "sendgrid":
        // Handle SendGrid event webhook
        // https://docs.sendgrid.com/for-developers/tracking-events/event
        if (Array.isArray(body)) {
          for (const event of body) {
            const messageId = event.sg_message_id
            let status: DeliveryStatus

            switch (event.event) {
              case "delivered":
                status = DeliveryStatus.DELIVERED
                break
              case "open":
                status = DeliveryStatus.OPENED
                break
              case "click":
                status = DeliveryStatus.CLICKED
                break
              case "bounce":
                status = DeliveryStatus.BOUNCED
                break
              case "dropped":
                status = DeliveryStatus.FAILED
                break
              default:
                continue // Skip unknown events
            }

            await updateDeliveryStatus("sendgrid", messageId, status, event)
          }
        }
        break

      case "twilio":
        // Handle Twilio SMS status callback
        // https://www.twilio.com/docs/sms/tutorials/how-to-confirm-delivery
        const messageId = body.MessageSid
        let status: DeliveryStatus

        switch (body.MessageStatus) {
          case "delivered":
            status = DeliveryStatus.DELIVERED
            break
          case "failed":
          case "undelivered":
            status = DeliveryStatus.FAILED
            break
          case "sent":
            status = DeliveryStatus.SENT
            break
          default:
            return NextResponse.json({ error: "Unknown status" }, { status: 400 })
        }

        await updateDeliveryStatus("twilio", messageId, status, body)
        break

      case "mailgun":
        // Handle Mailgun webhook
        // https://documentation.mailgun.com/en/latest/user_manual.html#webhooks
        const mailgunEvent = body["event-data"]
        if (!mailgunEvent) {
          return NextResponse.json({ error: "Invalid Mailgun webhook payload" }, { status: 400 })
        }

        const mailgunMessageId = mailgunEvent.message.headers["message-id"]
        let mailgunStatus: DeliveryStatus

        switch (mailgunEvent.event) {
          case "delivered":
            mailgunStatus = DeliveryStatus.DELIVERED
            break
          case "opened":
            mailgunStatus = DeliveryStatus.OPENED
            break
          case "clicked":
            mailgunStatus = DeliveryStatus.CLICKED
            break
          case "failed":
            mailgunStatus = DeliveryStatus.FAILED
            break
          case "bounced":
            mailgunStatus = DeliveryStatus.BOUNCED
            break
          default:
            return NextResponse.json({ error: "Unknown event" }, { status: 400 })
        }

        await updateDeliveryStatus("mailgun", mailgunMessageId, mailgunStatus, mailgunEvent)
        break

      case "vonage":
        // Handle Vonage (Nexmo) webhook
        // https://developer.vonage.com/messaging/sms/guides/delivery-receipts
        const vonageMessageId = body.messageId
        let vonageStatus: DeliveryStatus

        switch (body.status) {
          case "delivered":
            vonageStatus = DeliveryStatus.DELIVERED
            break
          case "accepted":
          case "buffered":
            vonageStatus = DeliveryStatus.SENT
            break
          case "expired":
          case "failed":
          case "rejected":
            vonageStatus = DeliveryStatus.FAILED
            break
          default:
            return NextResponse.json({ error: "Unknown status" }, { status: 400 })
        }

        await updateDeliveryStatus("vonage", vonageMessageId, vonageStatus, body)
        break

      default:
        return NextResponse.json({ error: "Unknown provider" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
