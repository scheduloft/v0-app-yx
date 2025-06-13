import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  User,
  Route,
  Scissors,
  Package,
  Receipt,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { PageContainer } from "@/components/page-container"

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="bg-primary text-primary-foreground p-4 -mx-4 mb-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="#" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Business Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Separator />
            <Link href="#" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Billing & Subscription</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Services & Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/settings/services" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Scissors className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Service Types</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Separator />
            <Link href="/settings/packages" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Service Packages</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Invoicing & Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/settings/invoice-reminders" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Invoice Reminders</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Separator />
            <Link href="#" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Route Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/route/settings" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Route className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Route Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p>Auto-optimize daily routes</p>
                <p className="text-sm text-muted-foreground">Automatically optimize routes each morning</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p>Real-time traffic updates</p>
                <p className="text-sm text-muted-foreground">Adjust routes based on traffic conditions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p>Include return to office</p>
                <p className="text-sm text-muted-foreground">Always include return trip in route calculations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p>Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive emails about your account</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p>SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive text messages about appointments</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>App Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span>Dark Mode</span>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span>Automatic Weather Alerts</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="#" className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Help Center</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Separator />
            <Link href="#" className="flex items-center justify-between py-2">
              <span>Contact Support</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </PageContainer>
  )
}
