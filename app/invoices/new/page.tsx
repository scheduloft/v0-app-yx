"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function NewInvoicePage() {
  const router = useRouter()
  const [items, setItems] = useState([{ id: 1, description: "Lawn Mowing", quantity: 1, rate: 65, amount: 65 }])
  const [customer, setCustomer] = useState("")
  const [notes, setNotes] = useState("")

  // Mock customer data
  const customers = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Sarah Johnson" },
    { id: 3, name: "Michael Brown" },
    { id: 4, name: "Emily Davis" },
    { id: 5, name: "David Wilson" },
  ]

  // Mock service data
  const services = [
    { id: 1, name: "Lawn Mowing", rate: 65 },
    { id: 2, name: "Edging", rate: 25 },
    { id: 3, name: "Hedge Trimming", rate: 45 },
    { id: 4, name: "Fertilization", rate: 55 },
    { id: 5, name: "Full Service", rate: 150 },
  ]

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // If description changed, update rate based on selected service
          if (field === "description") {
            const service = services.find((s) => s.name === value)
            if (service) {
              updatedItem.rate = service.rate
              updatedItem.amount = service.rate * updatedItem.quantity
            }
          }

          // If quantity or rate changed, update amount
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.rate * updatedItem.quantity
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const handleSaveInvoice = () => {
    // Here you would save the invoice to your database
    console.log("Saving invoice:", { customer, items, notes })
    router.push("/invoices")
  }

  const handleSendInvoice = () => {
    // Here you would save and send the invoice
    console.log("Sending invoice:", { customer, items, notes })
    router.push("/invoices")
  }

  return (
    <main className="flex flex-col pb-16">
      <div className="bg-primary text-primary-foreground p-4 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2 text-primary-foreground" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">New Invoice</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select onValueChange={setCustomer}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.name}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input id="invoice-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>

            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Services</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Select
                      value={item.description}
                      onValueChange={(value) => updateItem(item.id, "description", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value))}
                      className="text-right"
                      startContent="$"
                    />
                  </div>
                  <div className="col-span-2 text-right font-medium">${item.amount.toFixed(2)}</div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>

              <Separator className="my-4" />

              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or payment instructions..."
              className="mt-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleSaveInvoice}>
            <Save className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
          <Button className="flex-1" onClick={handleSendInvoice}>
            <Send className="h-4 w-4 mr-1" />
            Save & Send
          </Button>
        </div>
      </div>
    </main>
  )
}
