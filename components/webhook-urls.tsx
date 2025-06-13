"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface WebhookURLsProps {
  baseUrl: string
}

export default function WebhookURLs({ baseUrl }: WebhookURLsProps) {
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  const webhooks = [
    {
      provider: "SendGrid",
      path: "/api/webhooks/notifications",
      header: "x-notification-provider: sendgrid",
      docs: "https://docs.sendgrid.com/for-developers/tracking-events/event",
    },
    {
      provider: "Twilio",
      path: "/api/webhooks/notifications",
      header: "x-notification-provider: twilio",
      docs: "https://www.twilio.com/docs/sms/tutorials/how-to-confirm-delivery",
    },
    {
      provider: "Mailgun",
      path: "/api/webhooks/notifications",
      header: "x-notification-provider: mailgun",
      docs: "https://documentation.mailgun.com/en/latest/user_manual.html#webhooks",
    },
    {
      provider: "Vonage",
      path: "/api/webhooks/notifications",
      header: "x-notification-provider: vonage",
      docs: "https://developer.vonage.com/messaging/sms/guides/delivery-receipts",
    },
  ]

  const copyToClipboard = (text: string, provider: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied({ ...copied, [provider]: true })
        toast({
          title: "Copied to clipboard",
          description: "The webhook URL has been copied to your clipboard.",
        })
        setTimeout(() => {
          setCopied({ ...copied, [provider]: false })
        }, 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Failed to copy",
          description: "There was an error copying to clipboard.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook URLs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Configure these webhook URLs in your notification service providers to receive delivery status updates.
        </p>

        {webhooks.map((webhook) => {
          const fullUrl = `${baseUrl}${webhook.path}`

          return (
            <div key={webhook.provider} className="space-y-2">
              <Label>{webhook.provider} Webhook</Label>
              <div className="flex items-center gap-2">
                <Input value={fullUrl} readOnly />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(fullUrl, webhook.provider)}>
                  {copied[webhook.provider] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Required header: <code className="bg-muted px-1 py-0.5 rounded">{webhook.header}</code>
              </p>
              <p className="text-xs text-muted-foreground">
                <a
                  href={webhook.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View documentation
                </a>
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
