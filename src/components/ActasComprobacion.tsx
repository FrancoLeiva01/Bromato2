"use client"

import type React from "react"
import { useState } from "react"
import { ClipboardCheck, Search, Plus, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react"

const ActasComprobacion: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const actas = [
    {
      id: 1,
      numero: "AC-2024-001",
      propietarios: "Juan Pérez, María García",
      nJuzgado: "JUZ-001",
      creado: "2024-01-18",
    },
    {
      id: 2,
      numero: "AC-2024-002",
      propietarios: "Roberto Silva",
      nJuzgado: "JUZ-002",
      creado: "2024-01-19",
    },
    {
      id: 3,
      numero: "AC-2024-003",
      propietarios: "Laura Martínez, Carlos López",
      nJuzgado: "JUZ-003",
      creado: "2024-01-20",
    },
    ...Array.from({ length: 270 }, (_, i) => ({
      id: i + 4,
      numero: `AC-2024-${String(i + 4).padStart(3, "0")}`,
      propietarios: [
        "Ana López, Pedro Rodríguez",
        "Carlos Martínez",
        "Elena González, Miguel Torres",
        "Fernando Díaz",
        "Isabel Ruiz, Jorge Morales",
      ][i % 5],
      nJuzgado: `JUZ-${String((i % 10) + 1).padStart(3, "0")}`,
      creado: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
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

  const handleViewDetails = (actaId: number) => {
    console.log(`Ver detalles del acta ${actaId}`)
    // Aquí puedes agregar la lógica para mostrar detalles
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 mb-6 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-3">
          <ClipboardCheck className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Actas de Comprobación</h1>
            <p className="text-gray-600">Seguimiento de cumplimiento de observaciones</p>
          </div>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nueva Comprobación</span>
        </button>
      </div>

      <div className="bg-slate-600 rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                <input
                  type="text"
                  placeholder="Buscar comprobaciones..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-500 text-white">
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Juzgado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acta.propietarios}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acta.nJuzgado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acta.creado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewDetails(acta.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
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
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  ? "bg-gray-100 text-white cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-400"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActasComprobacion
