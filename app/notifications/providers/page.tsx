"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProviderConfiguration from "@/components/provider-configuration"
import WebhookURLs from "@/components/webhook-urls"
import {
  getEmailProviderConfigs,
  getSMSProviderConfigs,
  updateEmailProviderConfig,
  updateSMSProviderConfig,
} from "@/utils/notification-service"
import type { EmailProviderConfig, SMSProviderConfig } from "@/utils/notification-types"
import Link from "next/link"

export default function NotificationProvidersPage() {
  const [emailConfigs, setEmailConfigs] = useState<EmailProviderConfig[]>([])
  const [smsConfigs, setSMSConfigs] = useState<SMSProviderConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("providers")

  // Base URL for webhooks - in a real app, this would be your production URL
  const baseUrl = "https://your-app-url.com"

  useEffect(() => {
    // Load provider configurations
    const loadConfigurations = () => {
      try {
        const emailProviders = getEmailProviderConfigs()
        const smsProviders = getSMSProviderConfigs()
        setEmailConfigs(emailProviders)
        setSMSConfigs(smsProviders)
      } catch (error) {
        console.error("Failed to load provider configurations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadConfigurations()
  }, [])

  const handleUpdateEmailConfig = (config: EmailProviderConfig) => {
    try {
      const updatedConfig = updateEmailProviderConfig(config)
      setEmailConfigs((prev) => {
        const index = prev.findIndex((c) => c.type === config.type)
        if (index >= 0) {
          const newConfigs = [...prev]
          newConfigs[index] = updatedConfig

          // Update other configs if this one is now default
          if (updatedConfig.isDefault) {
            return newConfigs.map((c) => (c.type !== updatedConfig.type ? { ...c, isDefault: false } : c))
          }

          return newConfigs
        }
        return [...prev, updatedConfig]
      })
    } catch (error) {
      console.error("Failed to update email provider config:", error)
      throw error
    }
  }

  const handleUpdateSMSConfig = (config: SMSProviderConfig) => {
    try {
      const updatedConfig = updateSMSProviderConfig(config)
      setSMSConfigs((prev) => {
        const index = prev.findIndex((c) => c.type === config.type)
        if (index >= 0) {
          const newConfigs = [...prev]
          newConfigs[index] = updatedConfig

          // Update other configs if this one is now default
          if (updatedConfig.isDefault) {
            return newConfigs.map((c) => (c.type !== updatedConfig.type ? { ...c, isDefault: false } : c))
          }

          return newConfigs
        }
        return [...prev, updatedConfig]
      })
    } catch (error) {
      console.error("Failed to update SMS provider config:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading provider configurations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/notifications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Notification Providers</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="providers">Provider Configuration</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <div className="grid gap-6">
            <ProviderConfiguration
              emailConfigs={emailConfigs}
              smsConfigs={smsConfigs}
              onUpdateEmailConfig={handleUpdateEmailConfig}
              onUpdateSMSConfig={handleUpdateSMSConfig}
            />
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="grid gap-6">
            <WebhookURLs baseUrl={baseUrl} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
