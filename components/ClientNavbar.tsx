'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAuthToken, getUserName, getUserRole } from '@/utils/cookies'

export default function ClientNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      setIsLoggedIn(true)
      setUserName(getUserName() || "User")
      setUserRole(getUserRole() || "")
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-100 flex justify-center p-4 md:p-6 pointer-events-none">
      <nav
        className={`
          w-full max-w-6xl pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          rounded-[22px] border relative group/nav
          ${isMobileMenuOpen
            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl'
            : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-white/30 dark:border-slate-800/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:bg-white/70 dark:hover:bg-slate-900/80 hover:border-white/50 dark:hover:border-slate-800/80'}
        `}
      >
        {/* Top subtle highlight line */}
        <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/80 to-transparent"></div>

        <div className="px-5 md:px-8 h-14 md:h-17 flex justify-between items-center relative z-10">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group/logo">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-900 rounded-xl transition-all duration-500 group-hover/logo:rotate-10 group-hover/logo:bg-indigo-600 group-hover/logo:shadow-[0_0_20px_rgba(79,70,229,0.4)]"></div>
              <span className="relative z-10 text-white font-black text-lg">H</span>
            </div>
            <div className="hidden sm:flex flex-col gap-0">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100 leading-tight">hydro-flowsystems<span className="text-indigo-600 dark:text-indigo-400">.</span></span>
              <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] -mt-0.5">Pintar AI</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {['About', 'Services', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="px-4 py-2 text-[13px] font-bold text-slate-500 hover:text-indigo-600 rounded-full transition-all duration-300 relative group/item"
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute inset-0 bg-slate-900/5 rounded-full scale-50 opacity-0 group-hover/item:scale-100 group-hover/item:opacity-100 transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Side - Premium CTAs */}
          <div className="flex items-center gap-3 md:gap-5">
            {isLoggedIn ? (
              <Link
                href={userRole === "MANAGER" ? "/manager/dashboard" : userRole === "KASIR" ? "/kasir/dashboard" : "/user/dashboard"}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-[13px] font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-[13px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[13px] font-bold shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] hover:shadow-indigo-500/40 hover:bg-indigo-600 dark:hover:bg-slate-200 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-100/50 outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 rotate-45 translate-y-1' : 'w-5'}`}></div>
              <div className={`h-0.5 bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'w-5 -rotate-45 -translate-y-1' : 'w-3 self-end mr-2.5'}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Overlay Menu */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMobileMenuOpen ? 'max-h-100 border-t border-slate-100 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}
        `}>
          <div className="p-6 space-y-1">
            {['About', 'Services', 'Contact'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="flex items-center p-3 text-base font-bold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">
                {item}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-50">
              <Link href="/login" className="block w-full py-4 text-center font-bold text-slate-900 rounded-xl hover:bg-slate-50 transition">Masuk ke Akun</Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
