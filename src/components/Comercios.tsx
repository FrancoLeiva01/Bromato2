"use client"

import type React from "react"
import { useState } from "react"
import { Store, Plus, Eye } from "lucide-react"

interface Comercio {
  id: number
  nombreRazonSocial: string
  nombreFantasia: string
  barrio: string
  calle: string
  zona: string
  activo: boolean
}

const Comercios: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const comercios: Comercio[] = Array.from({ length: 67 }, (_, i) => ({
    id: i + 1,
    nombreRazonSocial: `Comercio S.R.L. ${i + 1}`,
    nombreFantasia: `Fantasía ${i + 1}`,
    barrio: ["Centro", "Norte", "Sur", "Este", "Oeste"][Math.floor(Math.random() * 5)],
    calle: `Calle ${Math.floor(Math.random() * 100) + 1}`,
    zona: ["Zona A", "Zona B", "Zona C"][Math.floor(Math.random() * 3)],
    activo: Math.random() > 0.3,
  }))

  const totalPages = Math.ceil(comercios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentComercios = comercios.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className=" bg-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Store className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-white">Comercios</h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Comercio</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre o razón social
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de Fantasía
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barrio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentComercios.map((comercio) => (
                <tr key={comercio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comercio.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comercio.nombreRazonSocial}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comercio.nombreFantasia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comercio.barrio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comercio.calle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comercio.zona}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        comercio.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comercio.activo ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comercios
