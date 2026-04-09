"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "@/lib/axios"
import { getAuthToken, getUserId, removeAuthToken } from "@/utils/cookies"
import { useRouter } from "next/navigation"

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    profile_picture: string | null;
    phone?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchUser = useCallback(async () => {
        const token = getAuthToken()
        const userId = getUserId()

        if (!token || !userId) {
            setUser(null)
            setLoading(false)
            return
        }

        try {
            const response = await api.get(`/user/${userId}`)
            if (response.data.status) {
                setUser(response.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error)
            // Optional: Handle token expiration/invalid
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const refreshUser = async () => {
        await fetchUser()
    }

    const logout = () => {
        removeAuthToken()
        setUser(null)
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
