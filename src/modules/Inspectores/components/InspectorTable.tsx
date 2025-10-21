"use client"

import { Eye, Edit, ShieldBan, Plus } from "lucide-react"
import type { Inspector } from "@/modules/Inspectores/types/inspector.types"

interface InspectoresTableProps {
  inspectores: Inspector[]
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  onViewDetails: (inspector: Inspector) => void
  onEdit: (inspector: Inspector) => void
  onDelete: (id: number) => void
  onToggleActivo: (inspector: Inspector) => void
  onNewInspector: () => void
  // Props para filtros
  filterType: string
  setFilterType: (type: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  onSearch: () => void
}

export const InspectorTable = ({
  inspectores,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleActivo,
  onNewInspector,
  filterType,
  setFilterType,
  searchTerm,
  setSearchTerm,
  onSearch,
}: InspectoresTableProps) => {
  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600">

      {/* --------------------------------------- Filtros y botón nuevo inspector ----------------------------------------------*/}

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0 justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value)
              setSearchTerm("")
            }}
          >
            <option value="">Filtros</option>
            <option value="apellido">Apellido</option>
            <option value="identificador">Identificador</option>
          </select>
          {filterType && (
            <input
              type="text"
              placeholder={`Buscar por ${filterType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm"
            />
          )}

          {/* -------------------------------- Botón buscar ---------------------------- */}
          <button
            className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
            onClick={onSearch}
          >
            Buscar
          </button>
        </div>

        {/* Botón nuevo inspector */}
        <button
                onClick={onNewInspector}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Inspector</span>
              </button>
      </div>
      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Función
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
              {inspectores.length > 0 ? (
                inspectores.map((inspector) => (
                  <tr key={inspector.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inspector.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.nombres}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.apellidos}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                          inspector.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                        onClick={() => onToggleActivo(inspector)}
                        title="Click para cambiar estado"
                      >
                        {inspector.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inspector.funcion || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspector.nro_legajo || inspector.cuil || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          onClick={() => onViewDetails(inspector)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          onClick={() => onEdit(inspector)}
                          title="Editar inspector"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors"
                          onClick={() => onDelete(inspector.id)}
                          title="Desactivar inspector"
                        >
                          <ShieldBan className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron inspectores.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevious}
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
              onClick={onNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-400"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


export default InspectorTable;