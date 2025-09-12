"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface User {
  id: string
  username: string
  email: string
  role: string
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("userData")

      if (authStatus === "true" && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData: User) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")
    setIsAuthenticated(false)
    setUser(null)
    navigate("/login")
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }
}
