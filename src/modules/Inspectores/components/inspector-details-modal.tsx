"use client"
import { X } from "lucide-react"
import type { Inspector } from "@/modules/Inspectores/types/inspector.types"

interface InspectorDetailsModalProps {
  inspector: Inspector | null
  isOpen: boolean
  onClose: () => void
}

export const InspectorDetailsModal = ({ inspector, isOpen, onClose }: InspectorDetailsModalProps) => {
  if (!isOpen || !inspector) return null

  return (
    <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-600 rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Contenido del modal */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-2">Inspector</h3>
            <h2 className="text-2xl font-bold text-gray-200">{inspector.nombres}</h2>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-2">Apellido</h3>
            <p className="text-4xl font-bold text-orange-500">{inspector.apellidos}</p>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-2">CUIL</h3>
            <p className="text-gray-200">{inspector.cuil || "N/A"}</p>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-2">Número de Legajo</h3>
            <p className="text-gray-200">{inspector.nro_legajo || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
