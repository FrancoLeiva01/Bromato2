"use client"

import type React from "react"
import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"

const ActasInspeccion: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const actas = [
    {
      id: 1,
      numero: "AI-2024-001",
      denuncia: "-",
      fecha: "2024-01-15",
      turno: "Juan Pérez",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
    },
    {
      id: 2,
      numero: "AI-2024-002",
      denuncia: "-",
      fecha: "2024-01-16",
      turno: "María González",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
    },
    {
      id: 3,
      numero: "AI-2024-003",
      denuncia: "-",
      fecha: "2024-01-17",
      turno: "Carlos Rodríguez",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
    },
    ...Array.from({ length: 270 }, (_, i) => ({
      id: i + 4,
      numero: `AI-2024-${String(i + 4).padStart(3, "0")}`,
      denuncia: i % 5 === 0 ? "D-2024-001" : "-",
      fecha: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
      turno: ["Juan Pérez", "María González", "Carlos Rodríguez", "Ana López"][i % 4],
      cargado: ["Completada", "En proceso", "Pendiente"][i % 3],
      numeroNotificacion: ["Aprobada", "Observaciones", "Rechazada"][i % 3],
    })),
  ]

  const totalPages = Math.ceil(actas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActas = actas.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className=" bg-slate-700 p-6 rounded-lg ">
   <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
         <div className="flex items-center space-x-3">
          <Search className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-white">Actas de Inspeccion</h1>
        </div>
          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          >
            <option value="Filtros">Filtros</option>
            <option value="Todos">N° de Acta</option>
            <option value="Nombre">Turno</option>
            <option value="Riesgo">Nombre de Fantasia Comercio</option>
            <option value="Riesgo">Razon Social Comercio</option>
          </select>
          <button
            className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"

          >
            Buscar
          </button>
        </div>
      </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Acta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Denuncia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Acta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° de Notificacion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentActas.map((acta) => (
                <tr key={acta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acta.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acta.denuncia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acta.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acta.turno}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        acta.cargado === "Completada"
                          ? "bg-green-100 text-green-800"
                          : acta.cargado === "En proceso"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {acta.cargado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        acta.numeroNotificacion === "Aprobada"
                          ? "bg-green-100 text-green-800"
                          : acta.numeroNotificacion === "Observaciones"
                            ? "bg-orange-100 text-orange-800"
                            : acta.numeroNotificacion === "Rechazada"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {acta.numeroNotificacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      onClick={() => console.log(`Ver detalles del acta ${acta.numero}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-white hover:bg-gray-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-4 py-2 text-sm font-medium text-white">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-400"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

  )
}

export default ActasInspeccion
