"use client"

import type React from "react"
import { X, Calendar, Bell, FileText, Search, Users, CheckCircle } from "lucide-react"

interface TutorialCardsProps {
  isVisible: boolean
  onClose: () => void
}

const TutorialCards: React.FC<TutorialCardsProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null

  const tutorialSteps = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      title: "Calendario de Notificaciones",
      description:
        "Visualiza todas las notificaciones programadas por fecha. Los eventos aparecen en verde y puedes navegar entre meses.",
      tips: ["Haz click en 'Hoy' para ir al día actual", "Usa las flechas para cambiar de mes"],
    },
    {
      icon: <Bell className="w-8 h-8 text-red-500" />,
      title: "Notificaciones",
      description: "Recibe alertas importantes sobre inspecciones, vencimientos y actualizaciones del sistema.",
      tips: ["El número rojo indica notificaciones pendientes", "Haz click en la campana para ver detalles"],
    },
    {
      icon: <FileText className="w-8 h-8 text-green-500" />,
      title: "Pre-Cargados",
      description: "Accede a formularios y documentos pre-cargados para agilizar tu trabajo diario.",
      tips: ["Encuentra plantillas comunes aquí", "Guarda tiempo usando formularios predefinidos"],
    },
    {
      icon: <Search className="w-8 h-8 text-purple-500" />,
      title: "Documentos",
      description: "Busca y gestiona todos los documentos del sistema de bromatología municipal.",
      tips: ["Usa filtros para encontrar documentos específicos", "Organiza por fecha o tipo de documento"],
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Gestión de Comercios",
      description: "Administra la información de comercios, rubros y establecimientos bajo supervisión.",
      tips: ["Mantén actualizada la información de contacto", "Revisa regularmente el estado de habilitaciones"],
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-teal-500" />,
      title: "Consejos Generales",
      description: "Mantén el sistema actualizado y revisa regularmente las notificaciones pendientes.",
      tips: ["Cierra sesión al terminar tu trabajo", "Reporta cualquier problema técnico"],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tutorial Guía Rápida</h2>
            <p className="text-gray-600 mt-1">Aprende a usar el sistema de bromatología municipal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorialSteps.map((step, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">{step.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-800">Consejos útiles:</h4>
                  <ul className="space-y-1">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">¿Necesitas más ayuda?</h4>
                <p className="text-sm text-blue-700">
                  Contacta al administrador del sistema o consulta la documentación completa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialCards
