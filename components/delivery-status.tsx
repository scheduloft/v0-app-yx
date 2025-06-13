"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeliveryStatus } from "@/utils/notification-types"

interface DeliveryStatusProps {
  status: DeliveryStatus | string
  timestamp?: string
  providerId?: string
  messageId?: string
  statusUpdates?: Array<{
    status: DeliveryStatus | string
    timestamp: string
    metadata?: Record<string, any>
  }>
}

function DeliveryStatusBadge({ status }: { status: DeliveryStatus | string }) {
  const getStatusColor = (status: DeliveryStatus | string) => {
    switch (status) {
      case DeliveryStatus.DELIVERED:
      case "delivered":
      case "sent":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case DeliveryStatus.PENDING:
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case DeliveryStatus.FAILED:
      case DeliveryStatus.BOUNCED:
      case DeliveryStatus.REJECTED:
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case DeliveryStatus.OPENED:
      case DeliveryStatus.CLICKED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <Badge className={`font-normal ${getStatusColor(status)}`} variant="outline">
      {status}
    </Badge>
  )
}

export default function DeliveryStatusComponent({
  status,
  timestamp,
  providerId,
  messageId,
  statusUpdates,
}: DeliveryStatusProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-0">
          <DeliveryStatusBadge status={status} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delivery Status Details</DialogTitle>
          <DialogDescription>Detailed information about the notification delivery status.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Current Status:</div>
            <div>
              <DeliveryStatusBadge status={status} />
            </div>

            {timestamp && (
              <>
                <div className="text-sm font-medium">Timestamp:</div>
                <div className="text-sm">{formatDate(timestamp)}</div>
              </>
            )}

            {providerId && (
              <>
                <div className="text-sm font-medium">Provider:</div>
                <div className="text-sm">{providerId}</div>
              </>
            )}

            {messageId && (
              <>
                <div className="text-sm font-medium">Message ID:</div>
                <div className="text-sm break-all">{messageId}</div>
              </>
            )}
          </div>

          {statusUpdates && statusUpdates.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Status History</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statusUpdates.map((update, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <DeliveryStatusBadge status={update.status} />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(update.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
