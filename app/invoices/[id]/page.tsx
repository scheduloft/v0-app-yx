"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer, Download, Send, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function InvoiceDetailPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState(`Invoice ${id} from LawnPro`)
  const [emailMessage, setEmailMessage] = useState("Please find attached your invoice. Thank you for your business.")

  // Mock invoice data - in a real app, you would fetch this from your API
  const invoice = {
    id: id,
    number: id,
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      address: "123 Oak Street, Anytown, ST 12345",
      phone: "(555) 123-4567",
    },
    date: "June 10, 2025",
    dueDate: "June 24, 2025",
    status: "Unpaid",
    items: [
      {
        id: 1,
        description: "Lawn Mowing",
        quantity: 1,
        rate: 65,
        amount: 65,
      },
      {
        id: 2,
        description: "Edging",
        quantity: 1,
        rate: 25,
        amount: 25,
      },
    ],
    notes: "Thank you for your business!",
    subtotal: 90,
    tax: 0,
    total: 90,
  }

  const handleSendInvoice = () => {
    // Here you would send the invoice via email
    console.log("Sending invoice to:", emailTo)
    console.log("Subject:", emailSubject)
    console.log("Message:", emailMessage)

    // Close the dialog and show success message
    setShowSendDialog(false)
    alert("Invoice sent successfully!")
  }

  const handleMarkAsPaid = () => {
    // Here you would update the invoice status in your database
    console.log("Marking invoice as paid:", id)
    alert("Invoice marked as paid!")
    // In a real app, you would refresh the data or update the UI
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Invoice {invoice.number}</h1>
        </div>
        <Badge
          variant={invoice.status === "Paid" ? "success" : invoice.status === "Overdue" ? "destructive" : "outline"}
        >
          {invoice.status}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl">LawnPro</h2>
                <p className="text-sm text-muted-foreground">Your Lawn Care Professional</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">Invoice #{invoice.number}</h3>
                <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
                <p className="text-sm text-muted-foreground">Due: {invoice.dueDate}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Bill To:</h3>
                <p className="font-medium">{invoice.customer.name}</p>
                <p className="text-sm">{invoice.customer.address}</p>
                <p className="text-sm">{invoice.customer.email}</p>
                <p className="text-sm">{invoice.customer.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Payment Details:</h3>
                <p className="text-sm">Payment Method: Credit Card or Check</p>
                <p className="text-sm">Make checks payable to: LawnPro Services</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-muted rounded-t-md p-2 grid grid-cols-12 font-medium text-sm">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>

              {invoice.items.map((item) => (
                <div key={item.id} className="border-b p-2 grid grid-cols-12 text-sm">
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">${item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right">${item.amount.toFixed(2)}</div>
                </div>
              ))}

              <div className="mt-4 flex flex-col items-end space-y-1">
                <div className="flex justify-between w-1/3 text-sm">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-1/3 text-sm">
                  <span>Tax:</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-1/3 font-bold">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 p-3 bg-muted/50 rounded-md text-sm">
                <h3 className="font-semibold">Notes:</h3>
                <p>{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1">
                <Send className="h-4 w-4 mr-1" />
                Send Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Send To</Label>
                  <Input
                    id="email"
                    placeholder="Email address"
                    value={emailTo || invoice.customer.email}
                    onChange={(e) => setEmailTo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSendInvoice}>Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </Button>

          <Button variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>

          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>

          {invoice.status !== "Paid" && (
            <Button variant="secondary" className="flex-1" onClick={handleMarkAsPaid}>
              <Check className="h-4 w-4 mr-1" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
