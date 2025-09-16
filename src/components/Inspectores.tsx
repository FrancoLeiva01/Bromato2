"use client"

import type React from "react"
import { useState } from "react"
import { UserCheck, Eye } from "lucide-react"

interface Inspector {
  id: number
  nombre: string
  apellido: string
  email: string
  activo: boolean
  funcion: string
  identificador: string
}

const Inspectores: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sample data
  const inspectores: Inspector[] = [
    {
      id: 1,
      nombre: "Inspector 1",
      apellido: "Apellido 1",
      email: "inspector1@catamarca.gov.ar",
      activo: true,
      funcion: "Sur",
      identificador: "37750108",
    },
    {
      id: 2,
      nombre: "Inspector 2",
      apellido: "Apellido 2",
      email: "inspector2@catamarca.gov.ar",
      activo: false,
      funcion: "Oeste",
      identificador: "46833456",
    },
    {
      id: 3,
      nombre: "Inspector 3",
      apellido: "Apellido 3",
      email: "inspector3@catamarca.gov.ar",
      activo: false,
      funcion: "Sur",
      identificador: "17738965",
    },
    {
      id: 4,
      nombre: "Inspector 4",
      apellido: "Apellido 4",
      email: "inspector4@catamarca.gov.ar",
      activo: false,
      funcion: "Norte",
      identificador: "83031522",
    },
    {
      id: 5,
      nombre: "Inspector 5",
      apellido: "Apellido 5",
      email: "inspector5@catamarca.gov.ar",
      activo: false,
      funcion: "Oeste",
      identificador: "90732665",
    },
    {
      id: 6,
      nombre: "Inspector 6",
      apellido: "Apellido 6",
      email: "inspector6@catamarca.gov.ar",
      activo: true,
      funcion: "Norte",
      identificador: "53817754",
    },
    {
      id: 7,
      nombre: "Inspector 7",
      apellido: "Apellido 7",
      email: "inspector7@catamarca.gov.ar",
      activo: false,
      funcion: "Oeste",
      identificador: "66667428",
    },
    {
      id: 8,
      nombre: "Inspector 8",
      apellido: "Apellido 8",
      email: "inspector8@catamarca.gov.ar",
      activo: true,
      funcion: "Oeste",
      identificador: "61076714",
    },
    {
      id: 9,
      nombre: "Inspector 9",
      apellido: "Apellido 9",
      email: "inspector9@catamarca.gov.ar",
      activo: false,
      funcion: "Norte",
      identificador: "39065578",
    },
    {
      id: 10,
      nombre: "Inspector 10",
      apellido: "Apellido 10",
      email: "inspector10@catamarca.gov.ar",
      activo: true,
      funcion: "Centro",
      identificador: "79865787",
    },
    ...Array.from({ length: 24 }, (_, i) => ({
      id: i + 11,
      nombre: `Inspector ${i + 11}`,
      apellido: `Apellido ${i + 11}`,
      email: `inspector${i + 11}@catamarca.gov.ar`,
      activo: Math.random() > 0.5,
      funcion: ["Sur", "Norte", "Este", "Oeste", "Centro"][Math.floor(Math.random() * 5)],
      identificador: `${Math.floor(Math.random() * 90000000) + 10000000}`,
    })),
  ]

  const totalPages = Math.ceil(inspectores.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentInspectores = inspectores.slice(startIndex, startIndex + itemsPerPage)

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Inspectores</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identificador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentInspectores.map((inspector) => (
                <tr key={inspector.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inspector.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.apellido}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{inspector.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        inspector.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {inspector.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.funcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.identificador}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
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

export default Inspectores
