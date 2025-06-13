import type {
  NotificationTemplate,
  NotificationPreference,
  EmailMessage,
  SMSMessage,
  EmailProvider,
  SMSProvider,
  EmailProviderConfig,
  SMSProviderConfig,
  DeliveryStatus,
  DeliveryTracking,
  ExtendedNotificationHistory,
} from "@/utils/notification-types"
import { createEmailProvider, createSMSProvider } from "@/utils/notification-provider-factory"

// Types for notifications
export type {
  NotificationTemplate,
  NotificationPreference,
  EmailMessage,
  SMSMessage,
  EmailProvider,
  SMSProvider,
  EmailProviderConfig,
  SMSProviderConfig,
  DeliveryStatus,
  DeliveryTracking,
  ExtendedNotificationHistory,
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
    id: "template-weather-reschedule-email",
    name: "Weather Reschedule (Email)",
    type: "email",
    subject: "Weather Alert: Your lawn care appointment needs rescheduling",
    body: `Dear {{customerName}},

We hope this email finds you well. Due to the forecast of {{weatherCondition}} on {{appointmentDate}}, we need to reschedule your {{serviceType}} appointment.

Your current appointment:
Date: {{appointmentDate}}
Time: {{appointmentTime}}
Service: {{serviceType}}

We suggest rescheduling to one of the following times:
{{rescheduleOptions}}

Please reply to this email or call us at (555) 123-4567 to confirm your preferred new appointment time.

We apologize for any inconvenience and appreciate your understanding.

Best regards,
The LawnPro Team`,
    variables: [
      "customerName",
      "weatherCondition",
      "appointmentDate",
      "appointmentTime",
      "serviceType",
      "rescheduleOptions",
    ],
  },
  {
    id: "template-weather-reschedule-sms",
    name: "Weather Reschedule (SMS)",
    type: "sms",
    body: `LawnPro Alert: Due to {{weatherCondition}} forecast, your {{serviceType}} appointment on {{appointmentDate}} at {{appointmentTime}} needs rescheduling. Please call (555) 123-4567 or reply to this message to reschedule.`,
    variables: ["weatherCondition", "serviceType", "appointmentDate", "appointmentTime"],
  },
  {
    id: "template-weather-reschedule-confirmed-email",
    name: "Reschedule Confirmation (Email)",
    type: "email",
    subject: "Confirmation: Your lawn care appointment has been rescheduled",
    body: `Dear {{customerName}},

This email confirms that your {{serviceType}} appointment has been rescheduled:

Previous appointment:
Date: {{oldAppointmentDate}}
Time: {{oldAppointmentTime}}

New appointment:
Date: {{newAppointmentDate}}
Time: {{newAppointmentTime}}

If you need to make any changes, please contact us at (555) 123-4567.

Thank you for your understanding.

Best regards,
The LawnPro Team`,
    variables: [
      "customerName",
      "serviceType",
      "oldAppointmentDate",
      "oldAppointmentTime",
      "newAppointmentDate",
      "newAppointmentTime",
    ],
  },
  {
    id: "template-weather-reschedule-confirmed-sms",
    name: "Reschedule Confirmation (SMS)",
    type: "sms",
    body: `LawnPro: Your {{serviceType}} appointment has been rescheduled from {{oldAppointmentDate}} at {{oldAppointmentTime}} to {{newAppointmentDate}} at {{newAppointmentTime}}. Questions? Call (555) 123-4567.`,
    variables: ["serviceType", "oldAppointmentDate", "oldAppointmentTime", "newAppointmentDate", "newAppointmentTime"],
  },
  {
    id: "template-appointment-reminder-email",
    name: "Appointment Reminder (Email)",
    type: "email",
    subject: "Reminder: Your lawn care appointment tomorrow",
    body: `Dear {{customerName}},

This is a friendly reminder that we'll be visiting tomorrow for your scheduled lawn care service:

Date: {{appointmentDate}}
Time: {{appointmentTime}}
Service: {{serviceType}}

Weather forecast: {{weatherForecast}}

If you need to make any changes, please contact us as soon as possible at (555) 123-4567.

Thank you for choosing LawnPro!

Best regards,
The LawnPro Team`,
    variables: ["customerName", "appointmentDate", "appointmentTime", "serviceType", "weatherForecast"],
  },
  {
    id: "template-appointment-reminder-sms",
    name: "Appointment Reminder (SMS)",
    type: "sms",
    body: `LawnPro Reminder: Your {{serviceType}} appointment is tomorrow, {{appointmentDate}} at {{appointmentTime}}. Weather: {{weatherForecast}}. Questions? Call (555) 123-4567.`,
    variables: ["serviceType", "appointmentDate", "appointmentTime", "weatherForecast"],
  },
  {
    id: "template-invoice-reminder-7-days-email",
    name: "Invoice Reminder - 7 Days Before Due (Email)",
    type: "email",
    subject: "Reminder: Invoice #{{invoiceNumber}} due in 7 days",
    body: `Dear {{customerName}},

This is a friendly reminder that your invoice is due in 7 days.

Invoice Details:
Invoice Number: #{{invoiceNumber}}
Amount Due: ${{ amountDue }}
Due Date: {{dueDate}}
Service: {{serviceDescription}}

You can pay your invoice online at: {{paymentLink}}

If you have any questions, please don't hesitate to contact us at (555) 123-4567.

Thank you for your business!

Best regards,
The LawnPro Team`,
    variables: ["customerName", "invoiceNumber", "amountDue", "dueDate", "serviceDescription", "paymentLink"],
  },
  {
    id: "template-invoice-reminder-7-days-sms",
    name: "Invoice Reminder - 7 Days Before Due (SMS)",
    type: "sms",
    body: `LawnPro: Invoice #{{invoiceNumber}} for ${{ amountDue }} is due {{dueDate}}. Pay online: {{paymentLink}} Questions? Call (555) 123-4567.`,
    variables: ["invoiceNumber", "amountDue", "dueDate", "paymentLink"],
  },
  {
    id: "template-invoice-reminder-due-today-email",
    name: "Invoice Due Today (Email)",
    type: "email",
    subject: "Invoice #{{invoiceNumber}} is due today",
    body: `Dear {{customerName}},

Your invoice is due today. Please submit payment at your earliest convenience.

Invoice Details:
Invoice Number: #{{invoiceNumber}}
Amount Due: ${{ amountDue }}
Due Date: {{dueDate}}
Service: {{serviceDescription}}

You can pay your invoice online at: {{paymentLink}}

If you have already submitted payment, please disregard this notice.

Thank you for your prompt attention to this matter.

Best regards,
The LawnPro Team`,
    variables: ["customerName", "invoiceNumber", "amountDue", "dueDate", "serviceDescription", "paymentLink"],
  },
  {
    id: "template-invoice-reminder-due-today-sms",
    name: "Invoice Due Today (SMS)",
    type: "sms",
    body: `LawnPro: Invoice #{{invoiceNumber}} for ${{ amountDue }} is due today. Pay now: {{paymentLink}} Questions? Call (555) 123-4567.`,
    variables: ["invoiceNumber", "amountDue", "dueDate", "paymentLink"],
  },
  {
    id: "template-invoice-overdue-3-days-email",
    name: "Invoice Overdue - 3 Days (Email)",
    type: "email",
    subject: "OVERDUE: Invoice #{{invoiceNumber}} - Payment Required",
    body: `Dear {{customerName}},

Your invoice is now 3 days overdue. Please submit payment immediately to avoid any service interruptions.

Invoice Details:
Invoice Number: #{{invoiceNumber}}
Amount Due: ${{ amountDue }}
Original Due Date: {{dueDate}}
Days Overdue: 3
Service: {{serviceDescription}}

You can pay your invoice online at: {{paymentLink}}

If you are experiencing financial difficulties, please contact us at (555) 123-4567 to discuss payment arrangements.

We appreciate your immediate attention to this matter.

Best regards,
The LawnPro Team`,
    variables: ["customerName", "invoiceNumber", "amountDue", "dueDate", "serviceDescription", "paymentLink"],
  },
  {
    id: "template-invoice-overdue-3-days-sms",
    name: "Invoice Overdue - 3 Days (SMS)",
    type: "sms",
    body: `LawnPro OVERDUE: Invoice #{{invoiceNumber}} for ${{ amountDue }} is 3 days past due. Pay now: {{paymentLink}} Call (555) 123-4567.`,
    variables: ["invoiceNumber", "amountDue", "dueDate", "paymentLink"],
  },
  {
    id: "template-invoice-overdue-7-days-email",
    name: "Invoice Overdue - 7 Days (Email)",
    type: "email",
    subject: "URGENT: Invoice #{{invoiceNumber}} - 7 Days Overdue",
    body: `Dear {{customerName}},

Your invoice is now 7 days overdue. This is an urgent notice requiring immediate payment.

Invoice Details:
Invoice Number: #{{invoiceNumber}}
Amount Due: ${{ amountDue }}
Original Due Date: {{dueDate}}
Days Overdue: 7
Service: {{serviceDescription}}
Late Fee: ${{ lateFee }}
Total Amount Due: ${{ totalAmountDue }}

You can pay your invoice online at: {{paymentLink}}

Please note that continued non-payment may result in:
- Additional late fees
- Suspension of services
- Collection activities

Please contact us immediately at (555) 123-4567 to resolve this matter.

Best regards,
The LawnPro Team`,
    variables: [
      "customerName",
      "invoiceNumber",
      "amountDue",
      "dueDate",
      "serviceDescription",
      "lateFee",
      "totalAmountDue",
      "paymentLink",
    ],
  },
  {
    id: "template-invoice-overdue-7-days-sms",
    name: "Invoice Overdue - 7 Days (SMS)",
    type: "sms",
    body: `LawnPro URGENT: Invoice #{{invoiceNumber}} is 7 days overdue. Total due: ${{ totalAmountDue }} (includes late fee). Pay: {{paymentLink}} Call NOW: (555) 123-4567.`,
    variables: ["invoiceNumber", "totalAmountDue", "paymentLink"],
  },
]

// Mock notification preferences for customers
const mockNotificationPreferences: Record<string, NotificationPreference> = {
  "1": {
    customerId: "1",
    email: true,
    sms: true,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
  "2": {
    customerId: "2",
    email: true,
    sms: false,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: true,
  },
  "3": {
    customerId: "3",
    email: true,
    sms: true,
    weatherAlerts: false,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
  "4": {
    customerId: "4",
    email: true,
    sms: true,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
  "5": {
    customerId: "5",
    email: true,
    sms: false,
    weatherAlerts: true,
    appointmentReminders: true,
    rescheduleNotifications: true,
    marketingMessages: false,
  },
}

// Mock notification history
let mockNotificationHistory: NotificationHistory[] = [
  {
    id: "notif-001",
    customerId: "1",
    customerName: "John Smith",
    type: "email",
    templateId: "template-appointment-reminder-email",
    subject: "Reminder: Your lawn care appointment tomorrow",
    body: "Dear John Smith, This is a friendly reminder that we'll be visiting tomorrow...",
    status: "delivered",
    timestamp: "2025-06-12T09:30:00",
    readTimestamp: "2025-06-12T10:15:00",
  },
  {
    id: "notif-002",
    customerId: "1",
    customerName: "John Smith",
    type: "sms",
    templateId: "template-appointment-reminder-sms",
    body: "LawnPro Reminder: Your Lawn Mowing appointment is tomorrow...",
    status: "delivered",
    timestamp: "2025-06-12T09:31:00",
  },
  {
    id: "notif-003",
    customerId: "2",
    customerName: "Sarah Johnson",
    type: "email",
    templateId: "template-weather-reschedule-email",
    subject: "Weather Alert: Your lawn care appointment needs rescheduling",
    body: "Dear Sarah Johnson, We hope this email finds you well. Due to the forecast of heavy rain...",
    status: "sent",
    timestamp: "2025-06-12T14:22:00",
  },
  {
    id: "notif-004",
    customerId: "3",
    customerName: "Michael Brown",
    type: "email",
    templateId: "template-appointment-reminder-email",
    subject: "Reminder: Your lawn care appointment tomorrow",
    body: "Dear Michael Brown, This is a friendly reminder that we'll be visiting tomorrow...",
    status: "sent",
    timestamp: "2025-06-12T09:35:00",
  },
  {
    id: "notif-005",
    customerId: "4",
    customerName: "Emily Davis",
    type: "sms",
    templateId: "template-appointment-reminder-sms",
    body: "LawnPro Reminder: Your Lawn Mowing appointment is tomorrow...",
    status: "failed",
    timestamp: "2025-06-12T09:40:00",
  },
]

// Mock provider configurations
let emailProviderConfigs: EmailProviderConfig[] = [
  {
    type: "sendgrid",
    apiKey: "SG.MOCK_API_KEY",
    fromEmail: "notifications@lawnpro.com",
    fromName: "LawnPro",
    isDefault: true,
    enabled: true,
  },
  {
    type: "mailgun",
    apiKey: "MOCK_MAILGUN_API_KEY",
    domain: "mail.lawnpro.com",
    fromEmail: "no-reply@mail.lawnpro.com",
    fromName: "LawnPro Notifications",
    isDefault: false,
    enabled: false,
  },
  {
    type: "smtp",
    host: "smtp.lawnpro.com",
    port: 587,
    secure: false,
    username: "smtp_user",
    password: "smtp_password",
    fromEmail: "system@lawnpro.com",
    fromName: "LawnPro System",
    isDefault: false,
    enabled: false,
  },
]

let smsProviderConfigs: SMSProviderConfig[] = [
  {
    type: "twilio",
    accountSid: "MOCK_ACCOUNT_SID",
    authToken: "MOCK_AUTH_TOKEN",
    fromNumber: "+15551234567",
    isDefault: true,
    enabled: true,
  },
  {
    type: "vonage",
    apiKey: "MOCK_VONAGE_API_KEY",
    apiSecret: "MOCK_VONAGE_API_SECRET",
    fromName: "LawnPro",
    isDefault: false,
    enabled: false,
  },
  {
    type: "messagebird",
    apiKey: "MOCK_MESSAGEBIRD_API_KEY",
    fromName: "LawnPro",
    isDefault: false,
    enabled: false,
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

// Get notification templates by type
export function getNotificationTemplatesByType(type: "email" | "sms"): NotificationTemplate[] {
  return notificationTemplates.filter((template) => template.type === type)
}

// Get customer notification preferences
export function getCustomerNotificationPreferences(customerId: string): NotificationPreference {
  return (
    mockNotificationPreferences[customerId] || {
      customerId,
      email: true,
      sms: false,
      weatherAlerts: true,
      appointmentReminders: true,
      rescheduleNotifications: true,
      marketingMessages: false,
    }
  )
}

// Update customer notification preferences
export function updateCustomerNotificationPreferences(
  customerId: string,
  preferences: Partial<NotificationPreference>,
): NotificationPreference {
  const currentPreferences = getCustomerNotificationPreferences(customerId)
  const updatedPreferences = { ...currentPreferences, ...preferences }
  mockNotificationPreferences[customerId] = updatedPreferences
  return updatedPreferences
}

// Get notification history for a customer
export function getCustomerNotificationHistory(customerId: string): NotificationHistory[] {
  return mockNotificationHistory.filter((notification) => notification.customerId === customerId)
}

// Get all notification history
export function getAllNotificationHistory(): NotificationHistory[] {
  return mockNotificationHistory
}

// Get email provider configurations
export function getEmailProviderConfigs(): EmailProviderConfig[] {
  return emailProviderConfigs
}

// Get SMS provider configurations
export function getSMSProviderConfigs(): SMSProviderConfig[] {
  return smsProviderConfigs
}

// Update email provider configuration
export function updateEmailProviderConfig(config: EmailProviderConfig): EmailProviderConfig {
  const index = emailProviderConfigs.findIndex((c) => c.type === config.type)

  if (index >= 0) {
    emailProviderConfigs[index] = config

    // If this is now the default, make sure others are not default
    if (config.isDefault) {
      emailProviderConfigs = emailProviderConfigs.map((c) => (c.type !== config.type ? { ...c, isDefault: false } : c))
    }

    return config
  }

  // Add new config
  emailProviderConfigs.push(config)
  return config
}

// Update SMS provider configuration
export function updateSMSProviderConfig(config: SMSProviderConfig): SMSProviderConfig {
  const index = smsProviderConfigs.findIndex((c) => c.type === config.type)

  if (index >= 0) {
    smsProviderConfigs[index] = config

    // If this is now the default, make sure others are not default
    if (config.isDefault) {
      smsProviderConfigs = smsProviderConfigs.map((c) => (c.type !== config.type ? { ...c, isDefault: false } : c))
    }

    return config
  }

  // Add new config
  smsProviderConfigs.push(config)
  return config
}

// Get default email provider
export function getDefaultEmailProvider(): EmailProvider | null {
  const defaultConfig = emailProviderConfigs.find((c) => c.isDefault && c.enabled)
  if (!defaultConfig) {
    return null
  }

  return createEmailProvider(defaultConfig)
}

// Get default SMS provider
export function getDefaultSMSProvider(): SMSProvider | null {
  const defaultConfig = smsProviderConfigs.find((c) => c.isDefault && c.enabled)
  if (!defaultConfig) {
    return null
  }

  return createSMSProvider(defaultConfig)
}

// Send notification (using real providers)
export async function sendNotification(
  customerId: string,
  customerName: string,
  templateId: string,
  variables: Record<string, string>,
): Promise<NotificationHistory> {
  // Get customer notification preferences
  const preferences = getCustomerNotificationPreferences(customerId)

  // Get template
  const template = getNotificationTemplateById(templateId)
  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }

  // Check if customer has opted in for this type of notification
  if (template.type === "email" && !preferences.email) {
    throw new Error(`Customer ${customerId} has opted out of email notifications`)
  }
  if (template.type === "sms" && !preferences.sms) {
    throw new Error(`Customer ${customerId} has opted out of SMS notifications`)
  }

  // Replace variables in template
  let body = template.body
  let subject = template.subject
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    body = body.replace(new RegExp(placeholder, "g"), value)
    if (subject) {
      subject = subject.replace(new RegExp(placeholder, "g"), value)
    }
  }

  // Create notification history entry
  const notification: NotificationHistory = {
    id: `notif-${Date.now().toString().slice(-6)}`,
    customerId,
    customerName,
    type: template.type,
    templateId,
    subject,
    body,
    status: "pending",
    timestamp: new Date().toISOString(),
  }

  try {
    // Send notification using the appropriate provider
    if (template.type === "email") {
      const emailProvider = getDefaultEmailProvider()
      if (!emailProvider) {
        throw new Error("No email provider configured")
      }

      // Mock customer email address (in a real app, this would come from the customer record)
      const customerEmail = `${customerId}@example.com`

      // Send email
      const result = await emailProvider.sendEmail({
        to: customerEmail,
        toName: customerName,
        subject: subject || "Notification from LawnPro",
        textContent: body,
        htmlContent: body.replace(/\n/g, "<br>"), // Simple HTML conversion
      })

      // Update notification status based on result
      notification.status = result.success ? "sent" : "failed"
    } else if (template.type === "sms") {
      const smsProvider = getDefaultSMSProvider()
      if (!smsProvider) {
        throw new Error("No SMS provider configured")
      }

      // Mock customer phone number (in a real app, this would come from the customer record)
      const customerPhone = `+1555${customerId}12345`

      // Send SMS
      const result = await smsProvider.sendSMS({
        to: customerPhone,
        content: body,
      })

      // Update notification status based on result
      notification.status = result.success ? "sent" : "failed"
    }
  } catch (error) {
    console.error("Failed to send notification:", error)
    notification.status = "failed"
  }

  // Add to history
  mockNotificationHistory = [notification, ...mockNotificationHistory]

  return notification
}

// Mark notification as delivered
export function markNotificationAsDelivered(notificationId: string): void {
  mockNotificationHistory = mockNotificationHistory.map((notification) => {
    if (notification.id === notificationId) {
      return { ...notification, status: "delivered" }
    }
    return notification
  })
}

// Mark notification as read
export function markNotificationAsRead(notificationId: string): void {
  mockNotificationHistory = mockNotificationHistory.map((notification) => {
    if (notification.id === notificationId) {
      return { ...notification, readTimestamp: new Date().toISOString() }
    }
    return notification
  })
}

// Send weather reschedule notification
export async function sendWeatherRescheduleNotification(
  customerId: string,
  customerName: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceType: string,
  weatherCondition: string,
  rescheduleOptions: string,
): Promise<NotificationHistory[]> {
  const preferences = getCustomerNotificationPreferences(customerId)
  const results: NotificationHistory[] = []

  // Check if customer has opted in for weather alerts and reschedule notifications
  if (!preferences.weatherAlerts || !preferences.rescheduleNotifications) {
    return results
  }

  const variables = {
    customerName,
    appointmentDate,
    appointmentTime,
    serviceType,
    weatherCondition,
    rescheduleOptions,
  }

  // Send email if customer has opted in
  if (preferences.email) {
    try {
      const emailResult = await sendNotification(
        customerId,
        customerName,
        "template-weather-reschedule-email",
        variables,
      )
      results.push(emailResult)
    } catch (error) {
      console.error("Failed to send email notification:", error)
    }
  }

  // Send SMS if customer has opted in
  if (preferences.sms) {
    try {
      const smsResult = await sendNotification(customerId, customerName, "template-weather-reschedule-sms", variables)
      results.push(smsResult)
    } catch (error) {
      console.error("Failed to send SMS notification:", error)
    }
  }

  return results
}

// Send reschedule confirmation notification
export async function sendRescheduleConfirmationNotification(
  customerId: string,
  customerName: string,
  serviceType: string,
  oldAppointmentDate: string,
  oldAppointmentTime: string,
  newAppointmentDate: string,
  newAppointmentTime: string,
): Promise<NotificationHistory[]> {
  const preferences = getCustomerNotificationPreferences(customerId)
  const results: NotificationHistory[] = []

  // Check if customer has opted in for reschedule notifications
  if (!preferences.rescheduleNotifications) {
    return results
  }

  const variables = {
    customerName,
    serviceType,
    oldAppointmentDate,
    oldAppointmentTime,
    newAppointmentDate,
    newAppointmentTime,
  }

  // Send email if customer has opted in
  if (preferences.email) {
    try {
      const emailResult = await sendNotification(
        customerId,
        customerName,
        "template-weather-reschedule-confirmed-email",
        variables,
      )
      results.push(emailResult)
    } catch (error) {
      console.error("Failed to send email notification:", error)
    }
  }

  // Send SMS if customer has opted in
  if (preferences.sms) {
    try {
      const smsResult = await sendNotification(
        customerId,
        customerName,
        "template-weather-reschedule-confirmed-sms",
        variables,
      )
      results.push(smsResult)
    } catch (error) {
      console.error("Failed to send SMS notification:", error)
    }
  }

  return results
}

// Format date for notifications
export function formatDateForNotification(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// Test email provider connection
export async function testEmailProvider(config: EmailProviderConfig): Promise<{ success: boolean; message: string }> {
  try {
    const provider = createEmailProvider(config)
    if (!provider) {
      return { success: false, message: "Failed to create email provider" }
    }

    const result = await provider.sendEmail({
      to: "test@example.com",
      toName: "Test User",
      subject: "Test Email from LawnPro",
      textContent: "This is a test email to verify your email provider configuration.",
    })

    if (result.success) {
      return { success: true, message: "Test email sent successfully" }
    } else {
      return { success: false, message: `Failed to send test email: ${result.error}` }
    }
  } catch (error) {
    return {
      success: false,
      message: `Error testing email provider: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Test SMS provider connection
export async function testSMSProvider(config: SMSProviderConfig): Promise<{ success: boolean; message: string }> {
  try {
    const provider = createSMSProvider(config)
    if (!provider) {
      return { success: false, message: "Failed to create SMS provider" }
    }

    const result = await provider.sendSMS({
      to: "+15551234567", // Test phone number
      content: "This is a test message from LawnPro to verify your SMS provider configuration.",
    })

    if (result.success) {
      return { success: true, message: "Test SMS sent successfully" }
    } else {
      return { success: false, message: `Failed to send test SMS: ${result.error}` }
    }
  } catch (error) {
    return {
      success: false,
      message: `Error testing SMS provider: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
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
  lateFees: {
    enabled: boolean
    amount: number
    type: "fixed" | "percentage"
    gracePeriodDays: number
  }
  escalation: {
    enabled: boolean
    finalNoticeDay: number
    suspendServicesDay: number
  }
  customerExceptions: string[] // Customer IDs who are exempt from reminders
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
  lateFees: {
    enabled: true,
    amount: 25,
    type: "fixed",
    gracePeriodDays: 3,
  },
  escalation: {
    enabled: true,
    finalNoticeDay: 14,
    suspendServicesDay: 30,
  },
  customerExceptions: [],
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

// Send invoice reminder notification
export async function sendInvoiceReminderNotification(
  customerId: string,
  customerName: string,
  invoiceNumber: string,
  amountDue: number,
  dueDate: string,
  serviceDescription: string,
  daysUntilDue: number,
  lateFee?: number,
): Promise<NotificationHistory[]> {
  const preferences = getCustomerNotificationPreferences(customerId)
  const results: NotificationHistory[] = []

  // Determine which template to use based on days until due
  let emailTemplateId: string
  let smsTemplateId: string

  if (daysUntilDue > 0) {
    // Before due date
    if (daysUntilDue >= 7) {
      emailTemplateId = "template-invoice-reminder-7-days-email"
      smsTemplateId = "template-invoice-reminder-7-days-sms"
    } else {
      emailTemplateId = "template-invoice-reminder-7-days-email" // Use same template for now
      smsTemplateId = "template-invoice-reminder-7-days-sms"
    }
  } else if (daysUntilDue === 0) {
    // Due today
    emailTemplateId = "template-invoice-reminder-due-today-email"
    smsTemplateId = "template-invoice-reminder-due-today-sms"
  } else {
    // Overdue
    const daysOverdue = Math.abs(daysUntilDue)
    if (daysOverdue <= 3) {
      emailTemplateId = "template-invoice-overdue-3-days-email"
      smsTemplateId = "template-invoice-overdue-3-days-sms"
    } else {
      emailTemplateId = "template-invoice-overdue-7-days-email"
      smsTemplateId = "template-invoice-overdue-7-days-sms"
    }
  }

  const variables = {
    customerName,
    invoiceNumber,
    amountDue: amountDue.toFixed(2),
    dueDate: formatDateForNotification(dueDate),
    serviceDescription,
    paymentLink: `https://lawnpro.com/pay/${invoiceNumber}`,
    lateFee: lateFee ? lateFee.toFixed(2) : "0.00",
    totalAmountDue: (amountDue + (lateFee || 0)).toFixed(2),
  }

  // Send email if customer has opted in
  if (preferences.email) {
    try {
      const emailResult = await sendNotification(customerId, customerName, emailTemplateId, variables)
      results.push(emailResult)
    } catch (error) {
      console.error("Failed to send invoice reminder email:", error)
    }
  }

  // Send SMS if customer has opted in
  if (preferences.sms) {
    try {
      const smsResult = await sendNotification(customerId, customerName, smsTemplateId, variables)
      results.push(smsResult)
    } catch (error) {
      console.error("Failed to send invoice reminder SMS:", error)
    }
  }

  return results
}

// Check if invoice reminder should be sent
export function shouldSendInvoiceReminder(invoiceId: string, dueDate: string, customerId: string): boolean {
  const settings = getInvoiceReminderSettings()

  if (!settings.enabled) return false
  if (settings.customerExceptions.includes(customerId)) return false

  const today = new Date()
  const due = new Date(dueDate)
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Check if we should send reminder before due date
  if (daysUntilDue > 0 && settings.reminderSchedule.beforeDue.enabled) {
    return settings.reminderSchedule.beforeDue.days.includes(daysUntilDue)
  }

  // Check if we should send reminder on due date
  if (daysUntilDue === 0 && settings.reminderSchedule.onDueDate.enabled) {
    return true
  }

  // Check if we should send reminder after due date
  if (daysUntilDue < 0 && settings.reminderSchedule.afterDue.enabled) {
    const daysOverdue = Math.abs(daysUntilDue)
    return settings.reminderSchedule.afterDue.days.includes(daysOverdue)
  }

  return false
}
