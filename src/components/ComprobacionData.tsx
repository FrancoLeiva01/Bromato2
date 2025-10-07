"use client"

import type React from "react"
import { X } from "lucide-react"

interface ActaData {
  id: number
  numero: string
  propietarios: string
  nJuzgado: string
  creado: string
  nombreFantasia: string
  razonSocial: string
}

interface ComprobacionDataProps {
  isOpen: boolean
  onClose: () => void
  acta: ActaData | null
}

const ComprobacionData: React.FC<ComprobacionDataProps> = ({ isOpen, onClose, acta }) => {
  if (!isOpen || !acta) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalles del Acta de Comprobación</h2>
          <button onClick={onClose} className="text-white hover:text-red-300 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Número de Acta</p>
                <p className="text-base text-gray-900">{acta.numero}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Fecha de Creación</p>
                <p className="text-base text-gray-900">{acta.creado}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Propietarios</p>
              <p className="text-base text-gray-900">{acta.propietarios}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">N° de Juzgado</p>
              <p className="text-base text-gray-900">{acta.nJuzgado}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-600">Nombre de Fantasía</p>
              <p className="text-base text-gray-900">{acta.nombreFantasia}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Razón Social</p>
              <p className="text-base text-gray-900">{acta.razonSocial}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComprobacionData
