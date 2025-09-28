import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InterviewAI - AI-Powered Interview Platform',
  description: 'An intelligent interview platform for conducting and managing interviews with AI assistance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
