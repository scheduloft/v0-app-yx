"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, UserPlus, Calendar, FileText, CloudRain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingActionButtons() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleOpen = () => setIsOpen(!isOpen)

  const actions = [
    {
      icon: UserPlus,
      label: "New Customer",
      href: "/customers/new",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Calendar,
      label: "New Appointment",
      href: "/schedule/new",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: FileText,
      label: "New Invoice",
      href: "/invoices/new",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: CloudRain,
      label: "Weather Issue",
      href: "/reschedule",
      color: "bg-amber-500 hover:bg-amber-600",
    },
  ]

  return (
    <div className="fixed right-4 bottom-20 z-40 max-w-7xl mx-auto w-full pointer-events-none">
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="absolute right-4 bottom-0 pointer-events-auto">
          <AnimatePresence>
            {isOpen && (
              <div className="flex flex-col-reverse gap-2 mb-2">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      size="sm"
                      className={cn("flex items-center gap-2 rounded-full shadow-lg text-white", action.color)}
                      onClick={() => {
                        router.push(action.href)
                        setIsOpen(false)
                      }}
                    >
                      <action.icon className="h-4 w-4" />
                      <span>{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          <Button
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all",
              isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90",
            )}
            onClick={toggleOpen}
          >
            <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </motion.div>
          </Button>
        </div>
      </div>
    </div>
  )
}
