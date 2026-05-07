import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'TaskMatrix — Project Management Tool',
  description: 'A Jira/Asana clone for software teams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}