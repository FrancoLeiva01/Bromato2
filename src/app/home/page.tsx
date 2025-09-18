"use client"

import { useState } from "react"

export default function HomePage() {
  console.log("[v0] HomePage rendering...")

  const [showTutorial, setShowTutorial] = useState(false)

  const handleTutorialToggle = () => {
    console.log("[v0] handleTutorialToggle called, current state:", showTutorial)
    setShowTutorial(!showTutorial)
    console.log("[v0] showTutorial will be:", !showTutorial)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sistema de Bromatología</h1>
        <button onClick={handleTutorialToggle} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Tutorial guía rápida
        </button>
        {showTutorial && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Tutorial activado!</p>
          </div>
        )}
      </div>
    </div>
  )
}
