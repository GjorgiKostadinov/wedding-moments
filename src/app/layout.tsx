import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Footer } from "@/components/ui/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "СподелиМоменти",
  description: "Секој момент заслужува да биде споделен. Секоја приказна – запаметена.",
  icons: {
    icon: '/SPODELI.png',
    shortcut: '/SPODELI.png',
    apple: '/SPODELI.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mk">
      <head>
        <link rel="icon" type="image/png" href="/SPODELI.png" />
        <link rel="shortcut icon" href="/SPODELI.png" />
        <link rel="apple-touch-icon" href="/SPODELI.png" />
      </head>
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