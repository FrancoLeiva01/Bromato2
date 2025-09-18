"use client"

import { HelpCircle, User, Bell } from "lucide-react"

interface HeaderProps {
  onTutorialClick?: () => void
}

export function Header({ onTutorialClick }: HeaderProps) {
  console.log("[v0] Header rendered, onTutorialClick:", typeof onTutorialClick)

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-card-foreground">Administración de Bromatología Municipal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sistema de Gestión - Catamarca Capital</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-gray-100">
            <Bell className="h-4 w-4 mr-2" />
            <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
          </button>

          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-md font-medium"
            onClick={(e) => {
              console.log("[v0] Tutorial button clicked - event:", e)
              console.log("[v0] onTutorialClick function:", onTutorialClick)
              if (onTutorialClick) {
                console.log("[v0] Calling onTutorialClick")
                onTutorialClick()
              } else {
                console.log("[v0] onTutorialClick is undefined!")
              }
            }}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Tutorial guía rápida
          </button>

          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">TEST</span>
          </div>
        </div>
      </div>
    </header>
  )
}
