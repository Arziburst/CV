import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CV Builder',
  description: 'Create and export your CV',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
