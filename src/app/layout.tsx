import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Zarkham - DeFi Alpha Feed',
  description: 'Track whale wallets and DeFi alpha in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 