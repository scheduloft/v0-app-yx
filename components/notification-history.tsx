"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, MessageSquare, Eye } from "lucide-react"
import { markNotificationAsRead } from "@/utils/notification-service"
import NotificationDetail from "@/components/notification-detail"
import DeliveryStatus from "@/components/delivery-status"

interface NotificationHistoryProps {
  notifications: any[]
  customerId?: string
  showCustomerInfo?: boolean
  showFilters?: boolean
}

export default function NotificationHistory({
  notifications,
  customerId,
  showCustomerInfo = false,
  showFilters = false,
}: NotificationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null)

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Filter by customer ID if provided
      if (customerId && notification.customerId !== customerId) {
        return false
      }

      // Filter by search term
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        notification.customerName?.toLowerCase().includes(searchLower) ||
        notification.subject?.toLowerCase().includes(searchLower) ||
        notification.body.toLowerCase().includes(searchLower)

      // Filter by type
      const matchesType = typeFilter === "all" || notification.type === typeFilter

      // Filter by status
      const matchesStatus = statusFilter === "all" || notification.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [notifications, customerId, searchTerm, typeFilter, statusFilter])

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification)
    if (!notification.readTimestamp) {
      markNotificationAsRead(notification.id)
    }
  }

  // Close notification detail
  const handleCloseDetail = () => {
    setSelectedNotification(null)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div>
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center">
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No notifications have been sent yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.readTimestamp ? "border-l-4 border-l-primary" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {notification.type === "email" ? (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    )}
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
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(notification.timestamp)}</div>
                </div>

                {showCustomerInfo && <div className="mt-2 text-sm font-medium">{notification.customerName}</div>}

                <div className="mt-2">
                  {notification.subject && <div className="font-medium">{notification.subject}</div>}
                  <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.body}</div>
                </div>

                <div className="flex justify-end mt-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedNotification && <NotificationDetail notification={selectedNotification} onClose={handleCloseDetail} />}
    </div>
  )
}
