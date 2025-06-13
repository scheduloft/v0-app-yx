import InvoiceRemindersWidget from "@/components/invoice-reminders-widget"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1>Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>Weather Widget</div>
          <InvoiceRemindersWidget />
          <div>Other Widget 1</div>
          <div>Other Widget 2</div>
        </div>
      </div>
    </main>
  )
}
