import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Footer } from "@/components/ui/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Сподели-моменти",
  description: "Веб апликација за собирање на најубавите моменти од свадбени настани.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mk">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}