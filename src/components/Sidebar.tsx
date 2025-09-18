"use client"

import type React from "react"
import { useState } from "react"
import logoMunicipalidad from "../assets/logo-municipalidad.png"
import {
  ChevronDown,
  ChevronRight,
  FileCheck,
  ClipboardCheck,
  Home,
  ClipboardList,
  Tag,
  Store,
  UserCheck,
  FolderOpen 
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const Sidebar: React.FC = () => {
  const [isDocumentosOpen, setIsDocumentosOpen] = useState(false)
  const [isPrecargadosOpen, setIsPrecargadosOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: "Inicio", path: "/home" },
    {
      icon: ClipboardList ,
      label: "Pre-Cargados",
      path: "/precargados",
      hasDropdown: true,
      subItems: [
        { icon: Tag, label: "Rubros", path: "/rubros" },
        { icon: Store, label: "Comercios", path: "/comercios" },
        { icon: UserCheck, label: "Inspectores", path: "/inspectores" },
      ],
    },
    {
      icon: FolderOpen ,
      label: "Documentos",
      path: "/documentos",
      hasDropdown: true,
      subItems: [
        { icon: FileCheck, label: "Actas de inspección", path: "/actas-inspeccion" },
        { icon: ClipboardCheck, label: "Actas de comprobación", path: "/actas-comprobacion" },
      ],
    },
  ]

  const handleDocumentosClick = () => {
    setIsDocumentosOpen(!isDocumentosOpen)
  }

  const handlePrecargadosClick = () => {
    setIsPrecargadosOpen(!isPrecargadosOpen)
  }

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <img
            src={logoMunicipalidad}
            alt="logoMunicipalidad"
            className="max-h-20 ml-3"
          />
          <div>
            <h2 className="font-bold text-lg">Catamarca</h2>
            <p className="text-sm text-slate-300">Capital</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            if (item.hasDropdown) {
              const isOpen = item.label === "Documentos" ? isDocumentosOpen : isPrecargadosOpen
              const handleClick = item.label === "Documentos" ? handleDocumentosClick : handlePrecargadosClick

              return (
                <div key={index}>
                  <button
                    onClick={handleClick}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive || item.subItems?.some((sub) => location.pathname === sub.path)
                        ? "bg-yellow-500 text-white"
                        : "text-white hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  {isOpen && item.subItems && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem, subIndex) => {
                        const SubIcon = subItem.icon
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                              isSubActive
                                ? "bg-green-400 text-white"
                                : "text-white hover:bg-slate-700 hover:text-white"
                            }`}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-yellow-500 text-white" : "text-white hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
