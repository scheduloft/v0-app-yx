// Types for notifications
export interface NotificationTemplate {
  id: string
  name: string
  type: "email" | "sms"
  subject?: string
  body: string
  variables: string[]
}

export interface NotificationPreference {
  customerId: string
  email: boolean
  sms: boolean
  weatherAlerts: boolean
  appointmentReminders: boolean
  rescheduleNotifications: boolean
  marketingMessages: boolean
}

export interface NotificationHistory {
  id: string
  customerId: string
  customerName: string
  type: "email" | "sms"
  templateId: string
  subject?: string
  body: string
  status: "sent" | "failed" | "pending" | "delivered"
  timestamp: string
  readTimestamp?: string
}

// Mock notification templates
const notificationTemplates: NotificationTemplate[] = [
  {
    id: "template-invoice-reminder-email",
    name: "Invoice Reminder (Email)",
    type: "email",
    subject: "Invoice Reminder: Payment Due",
    body: "Dear {{customerName}}, your invoice #{{invoiceNumber}} for ${{amount}} is due on {{dueDate}}.",
    variables: ["customerName", "invoiceNumber", "amount", "dueDate"],
  },
  {
    id: "template-appointment-reminder-email",
    name: "Appointment Reminder (Email)",
    type: "email",
    subject: "Appointment Reminder",
    body: "Dear {{customerName}}, this is a reminder that we have scheduled lawn care service at your property on {{appointmentDate}} at {{appointmentTime}}.",
    variables: ["customerName", "appointmentDate", "appointmentTime", "serviceType"],
  },
  {
    id: "template-appointment-reminder-sms",
    name: "Appointment Reminder (SMS)",
    type: "sms",
    body: "Hi {{customerName}}, reminder: {{serviceType}} scheduled for {{appointmentDate}} at {{appointmentTime}}.",
    variables: ["customerName", "appointmentDate", "appointmentTime", "serviceType"],
  },
  {
    id: "template-weather-alert-email",
    name: "Weather Alert (Email)",
    type: "email",
    subject: "Weather Alert - Service Rescheduling",
    body: "Dear {{customerName}}, due to forecasted {{weatherCondition}}, we may need to reschedule your service on {{appointmentDate}}. We'll contact you with more information.",
    variables: ["customerName", "appointmentDate", "weatherCondition"],
  },
  {
    id: "template-weather-alert-sms",
    name: "Weather Alert (SMS)",
    type: "sms",
    body: "LawnPro Alert: Due to {{weatherCondition}}, your {{serviceType}} on {{appointmentDate}} may need rescheduling. We'll contact you soon.",
    variables: ["customerName", "appointmentDate", "weatherCondition", "serviceType"],
  },
  {
    id: "template-invoice-overdue-email",
    name: "Invoice Overdue (Email)",
    type: "email",
    subject: "Invoice #{{invoiceNumber}} Overdue",
    body: "Dear {{customerName}}, your invoice #{{invoiceNumber}} for ${{amount}} was due on {{dueDate}} and is now overdue. Please make payment at your earliest convenience.",
    variables: ["customerName", "invoiceNumber", "amount", "dueDate"],
  },
]

// Get all notification templates
export function getNotificationTemplates(): NotificationTemplate[] {
  return notificationTemplates
}

// Get notification template by ID
export function getNotificationTemplateById(templateId: string): NotificationTemplate | undefined {
  return notificationTemplates.find((template) => template.id === templateId)
}

// Invoice reminder settings interface
export interface InvoiceReminderSettings {
  enabled: boolean
  reminderSchedule: {
    beforeDue: {
      enabled: boolean
      days: number[]
    }
    onDueDate: {
      enabled: boolean
    }
    afterDue: {
      enabled: boolean
      days: number[]
    }
  }
  templates: {
    beforeDue: string
    onDueDate: string
    afterDue: string
  }
  lateFees: {
    enabled: boolean
    gracePeriod: number
    feeType: "percentage" | "fixed"
    feeAmount: number
    maxFee?: number
    compounding: boolean
  }
  escalation: {
    enabled: boolean
    daysOverdue: number
    escalationType: "email" | "sms" | "call" | "mail"
    templateId: string
  }
}

// Mock invoice reminder settings
let invoiceReminderSettings: InvoiceReminderSettings = {
  enabled: true,
  reminderSchedule: {
    beforeDue: {
      enabled: true,
      days: [7, 3, 1],
    },
    onDueDate: {
      enabled: true,
    },
    afterDue: {
      enabled: true,
      days: [3, 7, 14],
    },
  },
  templates: {
    beforeDue: "template-invoice-reminder-email",
    onDueDate: "template-invoice-reminder-email",
    afterDue: "template-invoice-overdue-email",
  },
  lateFees: {
    enabled: true,
    gracePeriod: 5,
    feeType: "percentage",
    feeAmount: 5,
    maxFee: 50,
    compounding: false,
  },
  escalation: {
    enabled: true,
    daysOverdue: 30,
    escalationType: "mail",
    templateId: "template-invoice-overdue-email",
  },
}

// Get invoice reminder settings
export function getInvoiceReminderSettings(): InvoiceReminderSettings {
  return invoiceReminderSettings
}

// Update invoice reminder settings
export function updateInvoiceReminderSettings(settings: Partial<InvoiceReminderSettings>): InvoiceReminderSettings {
  invoiceReminderSettings = { ...invoiceReminderSettings, ...settings }
  return invoiceReminderSettings
}

// Mock notification history data
const notificationHistory: NotificationHistory[] = [
  {
    id: "notif-1",
    customerId: "cust-1",
    customerName: "John Smith",
    type: "email",
    templateId: "template-invoice-reminder-email",
    subject: "Invoice Reminder: Payment Due",
    body: "Dear John Smith, your invoice #INV-001 for $120.00 is due on 06/15/2025.",
    status: "delivered",
    timestamp: "2025-06-10T10:30:00Z",
  },
  {
    id: "notif-2",
    customerId: "cust-2",
    customerName: "Sarah Johnson",
    type: "sms",
    templateId: "template-appointment-reminder-sms",
    body: "Hi Sarah, reminder: lawn service scheduled for tomorrow at 2pm.",
    status: "sent",
    timestamp: "2025-06-11T09:15:00Z",
  },
  {
    id: "notif-3",
    customerId: "cust-3",
    customerName: "Michael Brown",
    type: "email",
    templateId: "template-weather-alert-email",
    subject: "Weather Alert - Service Rescheduling",
    body: "Dear Michael Brown, due to forecasted heavy rain, we may need to reschedule your service on 06/15/2025. We'll contact you with more information.",
    status: "sent",
    timestamp: "2025-06-12T14:45:00Z",
  },
  {
    id: "notif-4",
    customerId: "cust-4",
    customerName: "Emily Davis",
    type: "email",
    templateId: "template-invoice-overdue-email",
    subject: "Invoice #INV-002 Overdue",
    body: "Dear Emily Davis, your invoice #INV-002 for $85.00 was due on 06/01/2025 and is now overdue. Please make payment at your earliest convenience.",
    status: "delivered",
    timestamp: "2025-06-05T11:20:00Z",
    readTimestamp: "2025-06-05T14:35:00Z",
  },
  {
    id: "notif-5",
    customerId: "cust-5",
    customerName: "David Wilson",
    type: "sms",
    templateId: "template-weather-alert-sms",
    body: "LawnPro Alert: Due to high winds, your lawn mowing on 06/13/2025 may need rescheduling. We'll contact you soon.",
    status: "failed",
    timestamp: "2025-06-12T16:10:00Z",
  },
  {
    id: "notif-6",
    customerId: "cust-1",
    customerName: "John Smith",
    type: "email",
    templateId: "template-appointment-reminder-email",
    subject: "Appointment Reminder",
    body: "Dear John Smith, this is a reminder that we have scheduled lawn care service at your property on 06/14/2025 at 9:00 AM.",
    status: "pending",
    timestamp: "2025-06-13T08:00:00Z",
  },
]

// Mock customer notification preferences
const customerNotificationPreferences: NotificationPreference[] = [
  {
    customerId: "1",
    email: true,
    sms: true,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
  {
    customerId: "2",
    email: true,
    sms: true,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: true,
  },
  {
    customerId: "3",
    email: true,
    sms: false,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
  {
    customerId: "4",
    email: true,
    sms: true,
    weatherAlerts: false,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
  {
    customerId: "5",
    email: false,
    sms: true,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
]

// Get all notification history
export function getAllNotificationHistory(): NotificationHistory[] {
  return notificationHistory
}

// Get notification history for a specific customer
export function getCustomerNotificationHistory(customerId: string): NotificationHistory[] {
  return notificationHistory.filter((notification) => notification.customerId === customerId)
}

// Get notification preferences for a specific customer
export function getCustomerNotificationPreferences(customerId: string): NotificationPreference | undefined {
  return customerNotificationPreferences.find((prefs) => prefs.customerId === customerId)
}

// Update notification preferences for a specific customer
export function updateCustomerNotificationPreferences(
  customerId: string,
  preferences: Partial<NotificationPreference>,
): NotificationPreference | undefined {
  const index = customerNotificationPreferences.findIndex((prefs) => prefs.customerId === customerId)
  if (index !== -1) {
    customerNotificationPreferences[index] = { ...customerNotificationPreferences[index], ...preferences }
    return customerNotificationPreferences[index]
  }
  return undefined
}

// Mark notification as read
export function markNotificationAsRead(notificationId: string): void {
  const notification = notificationHistory.find((n) => n.id === notificationId)
  if (notification && !notification.readTimestamp) {
    notification.readTimestamp = new Date().toISOString()
  }
}
