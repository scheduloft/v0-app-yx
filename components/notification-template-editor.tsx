"use client"

import { useState, useEffect } from "react"
import { Mail, MessageSquare, Save, X, Info, Plus, Edit, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { NotificationTemplate } from "@/utils/notification-service"

interface NotificationTemplateEditorProps {
  template?: NotificationTemplate
  templates?: NotificationTemplate[]
  onSave?: (updatedTemplate: NotificationTemplate) => void
  onCancel?: () => void
}

export default function NotificationTemplateEditor({
  template,
  templates = [],
  onSave,
  onCancel,
}: NotificationTemplateEditorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(template || null)
  const [editedTemplate, setEditedTemplate] = useState<NotificationTemplate | null>(template || null)
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Initialize with templates prop if provided
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0])
      setEditedTemplate(templates[0])
    }
  }, [templates, selectedTemplate])

  // Initialize preview variables when template changes
  useEffect(() => {
    if (!editedTemplate) return

    const initialVariables: Record<string, string> = {}
    editedTemplate.variables.forEach((variable) => {
      // Set some example values for preview
      switch (variable) {
        case "customerName":
          initialVariables[variable] = "John Smith"
          break
        case "appointmentDate":
          initialVariables[variable] = "Monday, June 16, 2025"
          break
        case "appointmentTime":
          initialVariables[variable] = "10:00 AM"
          break
        case "serviceType":
          initialVariables[variable] = "Lawn Mowing"
          break
        case "weatherCondition":
          initialVariables[variable] = "heavy rain"
          break
        case "weatherForecast":
          initialVariables[variable] = "Partly cloudy, 75°F"
          break
        case "rescheduleOptions":
          initialVariables[variable] =
            "- Wednesday, June 18, 2025 at 10:00 AM\n- Thursday, June 19, 2025 at 2:00 PM\n- Friday, June 20, 2025 at 9:00 AM"
          break
        case "oldAppointmentDate":
          initialVariables[variable] = "Monday, June 16, 2025"
          break
        case "oldAppointmentTime":
          initialVariables[variable] = "10:00 AM"
          break
        case "newAppointmentDate":
          initialVariables[variable] = "Wednesday, June 18, 2025"
          break
        case "newAppointmentTime":
          initialVariables[variable] = "10:00 AM"
          break
        default:
          initialVariables[variable] = `[${variable}]`
      }
    })
    setPreviewVariables(initialVariables)
  }, [editedTemplate])

  const handleSave = () => {
    if (onSave && editedTemplate) {
      onSave(editedTemplate)
      setIsDialogOpen(false)
    }
  }

  const handleSelectTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template)
    setEditedTemplate(template)
    setActiveTab("edit")
  }

  const renderPreview = () => {
    if (!editedTemplate) return null

    let previewContent = editedTemplate.body
    for (const [key, value] of Object.entries(previewVariables)) {
      const placeholder = `{{${key}}}`
      previewContent = previewContent.replace(new RegExp(placeholder, "g"), value)
    }

    let previewSubject = ""
    if (editedTemplate.type === "email" && editedTemplate.subject) {
      previewSubject = editedTemplate.subject
      for (const [key, value] of Object.entries(previewVariables)) {
        const placeholder = `{{${key}}}`
        previewSubject = previewSubject.replace(new RegExp(placeholder, "g"), value)
      }
    }

    return (
      <div>
        {editedTemplate.type === "email" ? (
          <div className="border rounded-md p-4 bg-white">
            <div className="border-b pb-2 mb-3">
              <div className="font-medium">From: LawnPro &lt;notifications@lawnpro.com&gt;</div>
              <div className="font-medium">To: John Smith &lt;john.smith@example.com&gt;</div>
              <div className="font-medium">Subject: {previewSubject}</div>
            </div>
            <div className="whitespace-pre-line">{previewContent}</div>
          </div>
        ) : (
          <div className="border rounded-md p-4 bg-gray-100 max-w-xs mx-auto">
            <div className="bg-green-100 rounded-lg p-3 text-sm">
              <div className="font-medium mb-1">LawnPro</div>
              <div>{previewContent}</div>
              <div className="text-xs text-right text-gray-500 mt-1">Just now</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // If we're showing a list of templates
  if (templates.length > 0 && !template) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notification Templates</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>

        <div className="grid gap-4">
          {templates.map((t) => (
            <Card key={t.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {t.type === "email" ? (
                      <Mail className="h-5 w-5 mr-2 text-blue-500" />
                    ) : (
                      <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                    )}
                    <CardTitle>{t.name}</CardTitle>
                  </div>
                  <Badge variant={t.type === "email" ? "default" : "secondary"}>{t.type}</Badge>
                </div>
                {t.type === "email" && t.subject && (
                  <CardDescription className="mt-1">Subject: {t.subject}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.body}</p>
                <div className="flex gap-2 mt-4">
                  <Dialog open={isDialogOpen && selectedTemplate?.id === t.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleSelectTemplate(t)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                        <DialogDescription>Make changes to the notification template.</DialogDescription>
                      </DialogHeader>
                      {editedTemplate && (
                        <div className="mt-4">
                          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                              <TabsTrigger value="edit">Edit Template</TabsTrigger>
                              <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>

                            <TabsContent value="edit" className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Template Name</Label>
                                <Input
                                  id="name"
                                  value={editedTemplate.name}
                                  onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                                />
                              </div>

                              {editedTemplate.type === "email" && (
                                <div className="space-y-2">
                                  <Label htmlFor="subject">Subject Line</Label>
                                  <Input
                                    id="subject"
                                    value={editedTemplate.subject || ""}
                                    onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
                                  />
                                </div>
                              )}

                              <div className="space-y-2">
                                <Label htmlFor="body">Message Body</Label>
                                <Textarea
                                  id="body"
                                  value={editedTemplate.body}
                                  onChange={(e) => setEditedTemplate({ ...editedTemplate, body: e.target.value })}
                                  rows={10}
                                />
                              </div>

                              <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                  <p className="mb-2">Available variables:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {editedTemplate.variables.map((variable) => (
                                      <Badge key={variable} variant="outline" className="cursor-pointer">
                                        {`{{${variable}}}`}
                                      </Badge>
                                    ))}
                                  </div>
                                </AlertDescription>
                              </Alert>
                            </TabsContent>

                            <TabsContent value="preview" className="space-y-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  {editedTemplate.variables.map((variable) => (
                                    <div key={variable} className="space-y-1">
                                      <Label htmlFor={`var-${variable}`} className="text-xs">
                                        {variable}
                                      </Label>
                                      <Input
                                        id={`var-${variable}`}
                                        value={previewVariables[variable] || ""}
                                        onChange={(e) =>
                                          setPreviewVariables({
                                            ...previewVariables,
                                            [variable]: e.target.value,
                                          })
                                        }
                                        size="sm"
                                        className="h-8 text-sm"
                                      />
                                    </div>
                                  ))}
                                </div>

                                <div className="border-t pt-4">
                                  <h3 className="font-medium mb-2">Preview:</h3>
                                  {renderPreview()}
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button onClick={handleSave}>
                              <Save className="h-4 w-4 mr-1" />
                              Save Template
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // If we're editing a single template
  if (editedTemplate) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              {editedTemplate.type === "email" ? (
                <Mail className="h-5 w-5 mr-2" />
              ) : (
                <MessageSquare className="h-5 w-5 mr-2" />
              )}
              {editedTemplate.name}
            </CardTitle>
            <Badge variant="outline">{editedTemplate.type === "email" ? "Email" : "SMS"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="edit">Edit Template</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={editedTemplate.name}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                />
              </div>

              {editedTemplate.type === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={editedTemplate.subject || ""}
                    onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="body">Message Body</Label>
                <Textarea
                  id="body"
                  value={editedTemplate.body}
                  onChange={(e) => setEditedTemplate({ ...editedTemplate, body: e.target.value })}
                  rows={10}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <p className="mb-2">Available variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {editedTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="outline" className="cursor-pointer">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {editedTemplate.variables.map((variable) => (
                    <div key={variable} className="space-y-1">
                      <Label htmlFor={`var-${variable}`} className="text-xs">
                        {variable}
                      </Label>
                      <Input
                        id={`var-${variable}`}
                        value={previewVariables[variable] || ""}
                        onChange={(e) => setPreviewVariables({ ...previewVariables, [variable]: e.target.value })}
                        size="sm"
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Preview:</h3>
                  {renderPreview()}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fallback if no template is provided
  return <div>No template selected</div>
}
