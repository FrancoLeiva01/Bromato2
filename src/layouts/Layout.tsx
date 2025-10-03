"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import TutorialModal from "../components/TutorialModal"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const openTutorial = () => {
    setIsTutorialOpen(true)
  }

  const closeTutorial = () => {
    setIsTutorialOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-500 flex flex-col overflow-x-hidden">
      <Navbar onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onTutorialClick={openTutorial} />

      <div className="flex flex-1 min-w-0">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 lg:ml-0 p-6 transition-all duration-300 flex flex-col overflow-y-auto min-w-0">
          <div className="flex-1">{children}</div>
        </main>
      </div>

      <Footer />

      <TutorialModal isVisible={isTutorialOpen} onClose={closeTutorial} />
    </div>
  )
}

export default Layout
