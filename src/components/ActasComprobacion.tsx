"use client"

import type React from "react"
import { useState } from "react"
import { ClipboardCheck, ChevronLeft, ChevronRight, Eye } from "lucide-react"

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
     <div className=" bg-slate-700 p-6 rounded-lg ">
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
         <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex items-center space-x-3">
           <ClipboardCheck className="w-8 h-8 text-green-500" />
           <h1 className="text-2xl font-bold text-white">Actas de Comprobacion</h1>
         </div>
           <select
             className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
           >
             <option value="Filtros">Filtros</option>
             <option value="Todos">N° de Acta de Comprobacion</option>
             <option value="Nombre">Propietario</option>
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
  )
}

export default ActasComprobacion
