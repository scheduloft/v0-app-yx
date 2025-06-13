"use client"

import { useState } from "react"
import { Calendar, DollarSign, User, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatChangeType, getChangeTypeColor, type ServicePlanHistoryEntry } from "@/utils/service-plan-history"

interface ServicePlanHistoryProps {
  history: ServicePlanHistoryEntry[]
  showCustomerName?: boolean
}

export function ServicePlanHistory({ history, showCustomerName = false }: ServicePlanHistoryProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPlanName = (entry: ServicePlanHistoryEntry, type: "previous" | "new") => {
    if (type === "previous") {
      return entry.previousServiceTypeName || entry.previousPackageName || "None"
    } else {
      return entry.newServiceTypeName || entry.newPackageName || "None"
    }
  }

  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : "N/A"
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No service plan history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => {
        const isExpanded = expandedItems.has(entry.id)
        const showPriceChange = entry.previousPrice && entry.newPrice && entry.previousPrice !== entry.newPrice

        return (
          <Card key={entry.id}>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={getChangeTypeColor(entry.changeType)}>
                        {formatChangeType(entry.changeType)}
                      </Badge>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{formatDate(entry.changeDate)}</span>
                        </div>
                        {showCustomerName && <p className="text-sm text-muted-foreground mt-1">{entry.customerName}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {showPriceChange && (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(entry.previousPrice)}
                          </div>
                          <div className="text-sm font-medium">{formatPrice(entry.newPrice)}</div>
                        </div>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => toggleExpanded(entry.id)}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Changed to:</span>{" "}
                      <span className="font-medium">{formatPlanName(entry, "new")}</span>
                    </p>
                    {entry.reason && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Reason:</span> {entry.reason}
                      </p>
                    )}
                  </div>
                </CardContent>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="border-t pt-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Previous Plan</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Service:</span> {formatPlanName(entry, "previous")}
                          </p>
                          {entry.previousPrice && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Price:</span> {formatPrice(entry.previousPrice)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2">New Plan</h4>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Service:</span> {formatPlanName(entry, "new")}
                          </p>
                          {entry.newPrice && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Price:</span> {formatPrice(entry.newPrice)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {showPriceChange && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            Price Change:{" "}
                            <span
                              className={
                                entry.newPrice! > entry.previousPrice!
                                  ? "text-red-600"
                                  : entry.newPrice! < entry.previousPrice!
                                    ? "text-green-600"
                                    : ""
                              }
                            >
                              {entry.newPrice! > entry.previousPrice!
                                ? `+$${(entry.newPrice! - entry.previousPrice!).toFixed(2)}`
                                : entry.newPrice! < entry.previousPrice!
                                  ? `-$${(entry.previousPrice! - entry.newPrice!).toFixed(2)}`
                                  : "No change"}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>Changed by: {entry.changedBy}</span>
                      </div>
                    </div>

                    {entry.notes && (
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium mb-1">Notes</p>
                            <p className="text-sm text-muted-foreground">{entry.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )
      })}
    </div>
  )
}
