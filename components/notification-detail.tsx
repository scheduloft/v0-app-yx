"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, X } from "lucide-react"
import DeliveryStatus from "@/components/delivery-status"

interface NotificationDetailProps {
  notification: any
  onClose: () => void
}

export default function NotificationDetail({ notification, onClose }: NotificationDetailProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {notification.type === "email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            <span>{notification.type === "email" ? "Email" : "SMS"} Notification Details</span>
          </DialogTitle>
          <DialogDescription>
            Sent to {notification.customerName} on {formatDate(notification.timestamp)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="font-normal">
              {notification.type === "email" ? "Email" : "SMS"}
            </Badge>
            <DeliveryStatus
              status={notification.status}
              timestamp={notification.timestamp}
              providerId={notification.providerId}
              messageId={notification.messageId}
              statusUpdates={notification.statusUpdates}
            />
            {notification.readTimestamp && (
              <Badge variant="outline" className="font-normal bg-blue-100 text-blue-800">
                Read at {formatDate(notification.readTimestamp)}
              </Badge>
            )}
          </div>

          {notification.subject && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
              <p className="font-medium">{notification.subject}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Content</h3>
            <div className="mt-1 p-3 border rounded-md bg-muted/50 whitespace-pre-wrap">{notification.body}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Sent At</h3>
              <p>{formatDate(notification.timestamp)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Template</h3>
              <p>{notification.templateId}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
