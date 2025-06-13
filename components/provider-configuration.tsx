"use client"

import { useState } from "react"
import { Save, TestTube, Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import type { EmailProviderConfig, SMSProviderConfig } from "@/utils/notification-types"
import { testEmailProvider, testSMSProvider } from "@/utils/notification-service"

interface ProviderConfigurationProps {
  emailConfigs: EmailProviderConfig[]
  smsConfigs: SMSProviderConfig[]
  onUpdateEmailConfig: (config: EmailProviderConfig) => void
  onUpdateSMSConfig: (config: SMSProviderConfig) => void
}

export default function ProviderConfiguration({
  emailConfigs,
  smsConfigs,
  onUpdateEmailConfig,
  onUpdateSMSConfig,
}: ProviderConfigurationProps) {
  const [activeTab, setActiveTab] = useState("email")
  const [selectedEmailType, setSelectedEmailType] = useState(emailConfigs[0]?.type || "sendgrid")
  const [selectedSMSType, setSelectedSMSType] = useState(smsConfigs[0]?.type || "twilio")
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showSecrets, setShowSecrets] = useState(false)

  // Get current configurations
  const currentEmailConfig =
    emailConfigs.find((c) => c.type === selectedEmailType) ||
    ({
      type: selectedEmailType,
      fromEmail: "",
      fromName: "",
      isDefault: emailConfigs.length === 0,
      enabled: false,
    } as EmailProviderConfig)

  const currentSMSConfig =
    smsConfigs.find((c) => c.type === selectedSMSType) ||
    ({
      type: selectedSMSType,
      isDefault: smsConfigs.length === 0,
      enabled: false,
    } as SMSProviderConfig)

  // Form state
  const [emailForm, setEmailForm] = useState<EmailProviderConfig>({ ...currentEmailConfig })
  const [smsForm, setSMSForm] = useState<SMSProviderConfig>({ ...currentSMSConfig })

  // Update form when selection changes
  const handleEmailTypeChange = (type: string) => {
    setSelectedEmailType(type as "sendgrid" | "mailgun" | "smtp")
    const config = emailConfigs.find((c) => c.type === type) || {
      type: type as "sendgrid" | "mailgun" | "smtp",
      fromEmail: "",
      fromName: "",
      isDefault: emailConfigs.length === 0,
      enabled: false,
    }
    setEmailForm({ ...config })
    setTestResult(null)
  }

  const handleSMSTypeChange = (type: string) => {
    setSelectedSMSType(type as "twilio" | "vonage" | "messagebird")
    const config = smsConfigs.find((c) => c.type === type) || {
      type: type as "twilio" | "vonage" | "messagebird",
      isDefault: smsConfigs.length === 0,
      enabled: false,
    }
    setSMSForm({ ...config })
    setTestResult(null)
  }

  // Handle form changes
  const handleEmailFormChange = (field: keyof EmailProviderConfig, value: any) => {
    setEmailForm((prev) => ({ ...prev, [field]: value }))
    setTestResult(null)
  }

  const handleSMSFormChange = (field: keyof SMSProviderConfig, value: any) => {
    setSMSForm((prev) => ({ ...prev, [field]: value }))
    setTestResult(null)
  }

  // Test connection
  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      if (activeTab === "email") {
        const result = await testEmailProvider(emailForm)
        setTestResult(result)
      } else {
        const result = await testSMSProvider(smsForm)
        setTestResult(result)
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error during test: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsTesting(false)
    }
  }

  // Save configuration
  const handleSaveConfig = async () => {
    setIsSaving(true)

    try {
      if (activeTab === "email") {
        onUpdateEmailConfig(emailForm)
        toast({
          title: "Email Provider Updated",
          description: "Email provider configuration has been saved successfully.",
        })
      } else {
        onUpdateSMSConfig(smsForm)
        toast({
          title: "SMS Provider Updated",
          description: "SMS provider configuration has been saved successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: `Failed to update provider: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Render email provider form
  const renderEmailProviderForm = () => {
    switch (selectedEmailType) {
      case "sendgrid":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">SendGrid API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showSecrets ? "text" : "password"}
                  value={emailForm.apiKey || ""}
                  onChange={(e) => handleEmailFormChange("apiKey", e.target.value)}
                  placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxx"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">You can get your API key from the SendGrid dashboard.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={emailForm.fromEmail}
                onChange={(e) => handleEmailFormChange("fromEmail", e.target.value)}
                placeholder="notifications@yourdomain.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={emailForm.fromName}
                onChange={(e) => handleEmailFormChange("fromName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
          </div>
        )

      case "mailgun":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Mailgun API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showSecrets ? "text" : "password"}
                  value={emailForm.apiKey || ""}
                  onChange={(e) => handleEmailFormChange("apiKey", e.target.value)}
                  placeholder="key-xxxxxxxxxxxxxxxxxxxxxxx"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Mailgun Domain</Label>
              <Input
                id="domain"
                value={emailForm.domain || ""}
                onChange={(e) => handleEmailFormChange("domain", e.target.value)}
                placeholder="mail.yourdomain.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={emailForm.fromEmail}
                onChange={(e) => handleEmailFormChange("fromEmail", e.target.value)}
                placeholder="notifications@yourdomain.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={emailForm.fromName}
                onChange={(e) => handleEmailFormChange("fromName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
          </div>
        )

      case "smtp":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host">SMTP Host</Label>
              <Input
                id="host"
                value={emailForm.host || ""}
                onChange={(e) => handleEmailFormChange("host", e.target.value)}
                placeholder="smtp.yourdomain.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="port">SMTP Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={emailForm.port || ""}
                  onChange={(e) => handleEmailFormChange("port", Number.parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="secure"
                  checked={emailForm.secure || false}
                  onCheckedChange={(checked) => handleEmailFormChange("secure", checked)}
                />
                <Label htmlFor="secure">Use SSL/TLS</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">SMTP Username</Label>
              <Input
                id="username"
                value={emailForm.username || ""}
                onChange={(e) => handleEmailFormChange("username", e.target.value)}
                placeholder="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">SMTP Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showSecrets ? "text" : "password"}
                  value={emailForm.password || ""}
                  onChange={(e) => handleEmailFormChange("password", e.target.value)}
                  placeholder="password"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={emailForm.fromEmail}
                onChange={(e) => handleEmailFormChange("fromEmail", e.target.value)}
                placeholder="notifications@yourdomain.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={emailForm.fromName}
                onChange={(e) => handleEmailFormChange("fromName", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Render SMS provider form
  const renderSMSProviderForm = () => {
    switch (selectedSMSType) {
      case "twilio":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountSid">Twilio Account SID</Label>
              <Input
                id="accountSid"
                value={smsForm.accountSid || ""}
                onChange={(e) => handleSMSFormChange("accountSid", e.target.value)}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authToken">Twilio Auth Token</Label>
              <div className="relative">
                <Input
                  id="authToken"
                  type={showSecrets ? "text" : "password"}
                  value={smsForm.authToken || ""}
                  onChange={(e) => handleSMSFormChange("authToken", e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromNumber">From Phone Number</Label>
              <Input
                id="fromNumber"
                value={smsForm.fromNumber || ""}
                onChange={(e) => handleSMSFormChange("fromNumber", e.target.value)}
                placeholder="+15551234567"
              />
              <p className="text-xs text-muted-foreground">
                Must be a Twilio phone number in E.164 format (e.g., +15551234567)
              </p>
            </div>
          </div>
        )

      case "vonage":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Vonage API Key</Label>
              <Input
                id="apiKey"
                value={smsForm.apiKey || ""}
                onChange={(e) => handleSMSFormChange("apiKey", e.target.value)}
                placeholder="xxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">Vonage API Secret</Label>
              <div className="relative">
                <Input
                  id="apiSecret"
                  type={showSecrets ? "text" : "password"}
                  value={smsForm.apiSecret || ""}
                  onChange={(e) => handleSMSFormChange("apiSecret", e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxx"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={smsForm.fromName || ""}
                onChange={(e) => handleSMSFormChange("fromName", e.target.value)}
                placeholder="YourCompany"
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground">
                Alphanumeric sender ID, max 11 characters (e.g., YourCompany)
              </p>
            </div>
          </div>
        )

      case "messagebird":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">MessageBird API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showSecrets ? "text" : "password"}
                  value={smsForm.apiKey || ""}
                  onChange={(e) => handleSMSFormChange("apiKey", e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={smsForm.fromName || ""}
                onChange={(e) => handleSMSFormChange("fromName", e.target.value)}
                placeholder="YourCompany"
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground">
                Alphanumeric sender ID, max 11 characters (e.g., YourCompany)
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Provider Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email">Email Providers</TabsTrigger>
            <TabsTrigger value="sms">SMS Providers</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailProvider">Email Provider</Label>
              <Select value={selectedEmailType} onValueChange={handleEmailTypeChange}>
                <SelectTrigger id="emailProvider">
                  <SelectValue placeholder="Select email provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="smtp">SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="emailEnabled"
                checked={emailForm.enabled}
                onCheckedChange={(checked) => handleEmailFormChange("enabled", checked)}
              />
              <Label htmlFor="emailEnabled">Enable this provider</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="emailDefault"
                checked={emailForm.isDefault}
                onCheckedChange={(checked) => handleEmailFormChange("isDefault", checked)}
              />
              <Label htmlFor="emailDefault">Set as default provider</Label>
            </div>

            {renderEmailProviderForm()}
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smsProvider">SMS Provider</Label>
              <Select value={selectedSMSType} onValueChange={handleSMSTypeChange}>
                <SelectTrigger id="smsProvider">
                  <SelectValue placeholder="Select SMS provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="vonage">Vonage (Nexmo)</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="smsEnabled"
                checked={smsForm.enabled}
                onCheckedChange={(checked) => handleSMSFormChange("enabled", checked)}
              />
              <Label htmlFor="smsEnabled">Enable this provider</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="smsDefault"
                checked={smsForm.isDefault}
                onCheckedChange={(checked) => handleSMSFormChange("isDefault", checked)}
              />
              <Label htmlFor="smsDefault">Set as default provider</Label>
            </div>

            {renderSMSProviderForm()}
          </TabsContent>
        </Tabs>

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"} className="mt-4">
            {testResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{testResult.success ? "Test Successful" : "Test Failed"}</AlertTitle>
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting || isSaving}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={handleSaveConfig} disabled={isTesting || isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
