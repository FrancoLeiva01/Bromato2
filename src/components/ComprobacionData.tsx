"use client"

import type React from "react"
import { X, ClipboardCheck } from "lucide-react"

interface Acta {
  id: number
  numero: string
  propietarios: string
  nJuzgado: string
  creado: string
  nombreFantasia: string
  razonSocial: string
  fecha_acta_comprobacion?: string
  hora_acta_comprobacion?: string
  detalle_procedimiento?: string
  procedimientos?: string
  domicilio_inspeccionado?: string
  inspectores?: string
}


interface ComprobacionDataProps {
  isOpen: boolean
  onClose: () => void
  acta: Acta | null
}

const ComprobacionData: React.FC<ComprobacionDataProps> = ({ isOpen, onClose, acta }) => {
  if (!isOpen || !acta) return null

 return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-700/60 max-w-4xl w-full p-8 relative overflow-y-auto max-h-[90vh] transition-all duration-300">

      {/* Botón cerrar (ajustado) */}
           <button
             onClick={onClose}
             className="absolute -top-1 -right-1 text-white hover:text-red-500 p-4 mb-3"
             title="Cerrar"
           >
             <X className="w-5 h-5" />
           </button>

      <div className="space-y-6">
        {/* Encabezado */}
        <div className="bg-slate-700 rounded-lg p-5 flex flex-col items-center justify-center shadow-inner border border-slate-600/50 mb-4">
          <div className="flex items-center justify-center mb-2">
            <ClipboardCheck className="w-8 h-8 text-green-500 mr-2" />
            <h2 className="text-3xl font-bold text-white">Acta de Comprobación</h2>
          </div>
          <h3 className="text-xl font-bold text-orange-400">{acta.numero}</h3>
        </div>

        {/* Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600 shadow-sm">
            <h3 className="text-sm font-medium text-white mb-1">Nombre de Fantasía</h3>
            <p className="text-lg font-bold text-green-400">{acta.nombreFantasia}</p>
          </div>
          <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600 shadow-sm">
            <h3 className="text-sm font-medium text-white mb-1">Razón Social</h3>
            <p className="text-lg font-bold text-blue-400">{acta.razonSocial}</p>
          </div>
        </div>

        {/* Propietarios */}
        <div className="text-center bg-slate-700/40 rounded-lg p-4 border border-slate-600">
          <h3 className="text-sm font-medium text-white mb-1">Propietarios</h3>
          <p className="text-gray-200">{acta.propietarios}</p>
        </div>

        {/* Datos judiciales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="text-sm font-medium text-white mb-1">N° Juzgado</h3>
            <p className="text-gray-200">{acta.nJuzgado}</p>
          </div>
          <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="text-sm font-medium text-white mb-1">Fecha de Creación</h3>
            <p className="text-gray-200">{acta.creado}</p>
          </div>
          <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <h3 className="text-sm font-medium text-white mb-1">Hora</h3>
            <p className="text-gray-200">{acta.hora_acta_comprobacion || "N/A"}</p>
          </div>
        </div>

        {/* Domicilio */}
        {acta.domicilio_inspeccionado && (
          <div className="text-center bg-slate-700/40 rounded-lg p-4 border border-slate-600">
            <h3 className="text-sm font-medium text-white mb-1 uppercase">
              Domicilio Inspeccionado
            </h3>
            <p className="text-gray-200">{acta.domicilio_inspeccionado}</p>
          </div>
        )}

        {/* Procedimientos */}
        {acta.procedimientos && (
          <div className="text-center bg-slate-700/40 rounded-lg p-4 border border-slate-600">
            <h3 className="text-sm font-medium text-white mb-1">Procedimiento</h3>
            <p className="text-orange-400 font-semibold">{acta.procedimientos}</p>
          </div>
        )}

        {/* Detalle del procedimiento */}
        {acta.detalle_procedimiento && (
          <div className="text-center bg-slate-700/40 rounded-lg p-4 border border-slate-600">
            <h3 className="text-sm font-medium text-white mb-1">
              Detalle del Procedimiento
            </h3>
            <p className="text-gray-200">{acta.detalle_procedimiento}</p>
          </div>
        )}

        {/* Inspectores */}
        {acta.inspectores && (
          <div className="border-t border-slate-600 pt-5">
            <h3 className="text-lg font-bold text-white mb-3 text-center">
              Inspectores
            </h3>
            <p className="text-gray-200 text-center">{acta.inspectores}</p>
          </div>
        )}
      </div>
    </div>
  </div>
)
}
export default ComprobacionData
