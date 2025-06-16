"use client"

import { useState } from "react"
import { CreditCard, Download, Check, Star, Users, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/page-container"
import Link from "next/link"

const subscriptionPlans = [
  {
    name: "Solo",
    price: 0,
    period: "Free",
    description: "Perfect for individual lawn care professionals",
    features: [
      "Up to 10 customers",
      "25 invoices per month",
      "Basic route optimization",
      "Weather integration",
      "Email notifications",
      "Mobile app access",
      "Basic support",
    ],
    limitations: ["No SMS notifications", "No advanced analytics", "No API access"],
  },
  {
    name: "Growth",
    price: 39,
    period: "month",
    description: "Ideal for growing lawn care businesses",
    features: [
      "Up to 100 customers",
      "500 invoices per month",
      "Advanced route optimization",
      "Weather integration & alerts",
      "Email & SMS notifications",
      "Invoice reminders",
      "Customer management",
      "Basic analytics",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: 79,
    period: "month",
    description: "Complete solution for established businesses",
    features: [
      "Unlimited customers",
      "Unlimited invoices",
      "AI-powered route optimization",
      "Advanced weather integration",
      "All notification types",
      "Advanced invoice features",
      "Team management",
      "Advanced analytics & reporting",
      "API access",
      "White-label options",
      "Dedicated support",
    ],
  },
]

const billingHistory = [
  {
    id: "inv_001",
    date: "2025-05-14",
    amount: 39.0,
    status: "paid",
    plan: "Growth",
  },
  {
    id: "inv_002",
    date: "2025-04-14",
    amount: 39.0,
    status: "paid",
    plan: "Growth",
  },
  {
    id: "inv_003",
    date: "2025-03-14",
    amount: 39.0,
    status: "paid",
    plan: "Growth",
  },
]

export default function BillingPage() {
  const [currentPlan] = useState("Growth")
  const [isAnnual, setIsAnnual] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <PageContainer>
      <div className="bg-primary text-primary-foreground p-4 -mx-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="mr-2 text-primary-foreground hover:bg-primary-foreground/20">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Billing & Subscription</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Subscription
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{currentPlan} Plan</h3>
                <p className="text-muted-foreground">$39.00 per month</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next billing date</p>
                <p className="font-medium">July 14, 2025</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
              <Button variant="outline" size="sm">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Subscription Plans</h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${!isAnnual ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
              <Button variant="outline" size="sm" onClick={() => setIsAnnual(!isAnnual)} className="h-6 w-12 p-0">
                <div
                  className={`h-4 w-4 rounded-full bg-primary transition-transform ${isAnnual ? "translate-x-4" : "translate-x-0"}`}
                />
              </Button>
              <span className={`text-sm ${isAnnual ? "font-medium" : "text-muted-foreground"}`}>Annual</span>
              {isAnnual && (
                <Badge variant="secondary" className="text-xs">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {plan.price === 0 ? "Free" : `$${isAnnual ? Math.round(plan.price * 0.8) : plan.price}`}
                      </div>
                      {plan.price > 0 && (
                        <div className="text-sm text-muted-foreground">per {isAnnual ? "month" : plan.period}</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <div key={index} className="flex items-center opacity-60">
                        <div className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm line-through">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    variant={currentPlan === plan.name ? "outline" : "default"}
                    disabled={currentPlan === plan.name}
                  >
                    {currentPlan === plan.name ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/27</p>
                </div>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
              <Button variant="outline" size="sm">
                Update Billing Address
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billingHistory.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{invoice.plan} Plan</p>
                    <p className="text-sm text-muted-foreground">{formatDate(invoice.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                      <Badge variant={invoice.status === "paid" ? "secondary" : "destructive"} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">of 100 customers</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-muted-foreground">of 500 invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
