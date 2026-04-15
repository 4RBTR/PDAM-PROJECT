"use client"

import { AuthProvider } from '@/context/AuthContext'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
