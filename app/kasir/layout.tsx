"use client"

import { AuthProvider } from '@/context/AuthContext'

export default function KasirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
