'use client'

import { useState, useEffect } from 'react'
import { getAuthToken, getUserName } from '@/utils/cookies'

export default function ClientHeroAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("Budi Santoso")

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      setIsLoggedIn(true)
      setUserName(getUserName() || "User")
    }
  }, [])

  return (
    <span className="text-sm font-bold text-slate-800">
      Halo, {isLoggedIn ? userName : "Budi Santoso"} 👋
    </span>
  )
}
