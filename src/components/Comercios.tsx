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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("Filtros")
  const [barrioFilter, setBarrioFilter] = useState("")
  const [zonaFilter, setZonaFilter] = useState("")
  const [activoFilter, setActivoFilter] = useState("")
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

  const filteredComercios = comercios.filter((comercio) => {
    if (filterType === "Filtros" || filterType === "Todos") {
      return true
    }

    if (filterType === "Nombre de Fantasia") {
      return comercio.nombreFantasia.toLowerCase().includes(searchTerm.toLowerCase())
    }

    if (filterType === "Nombre/Razon Social comercio") {
      return comercio.nombreRazonSocial.toLowerCase().includes(searchTerm.toLowerCase())
    }

    if (filterType === "Calle") {
      return comercio.calle.toLowerCase().includes(searchTerm.toLowerCase())
    }

    if (filterType === "Barrio") {
      return barrioFilter === "" || comercio.barrio === barrioFilter
    }

    if (filterType === "Zona") {
      return zonaFilter === "" || comercio.zona === zonaFilter
    }

    if (filterType === "Activo") {
      return activoFilter === "" || comercio.activo.toString() === activoFilter
    }

    return true
  })

  const totalPages = Math.ceil(filteredComercios.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentComercios = filteredComercios.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleFilterChange = (value: string) => {
    setFilterType(value)
    setSearchTerm("")
    setBarrioFilter("")
    setZonaFilter("")
    setActivoFilter("")
    setCurrentPage(1)
  }

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
   <div className=" bg-slate-700 p-6 rounded-lg ">
   <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
         <div className="flex items-center space-x-3">
          <Store className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-white">Comercios</h1>
        </div>
          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="Filtros">Filtros</option>
            <option value="Todos">Todos</option>
            <option value="Nombre de Fantasia">Nombre de Fantasia</option>
            <option value="Nombre/Razon Social comercio">Nombre/Razon Social comercio</option>
            <option value="Calle">Calle</option>
            <option value="Barrio">Barrio</option>
            <option value="Zona">Zona</option>
            <option value="Activo">Activo</option>
          </select>
          {(filterType === "Nombre de Fantasia" ||
            filterType === "Nombre/Razon Social comercio" ||
            filterType === "Calle") && (
            <input
              type="text"
              placeholder={`Buscar por ${filterType.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            />
          )}
          {filterType === "Barrio" && (
            <select
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
              value={barrioFilter}
              onChange={(e) => setBarrioFilter(e.target.value)}
            >
              <option value="">Seleccionar barrio</option>
              <option value="Centro">Centro</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
              <option value="Este">Este</option>
              <option value="Oeste">Oeste</option>
            </select>
          )}
          {filterType === "Zona" && (
            <select
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
              value={zonaFilter}
              onChange={(e) => setZonaFilter(e.target.value)}
            >
              <option value="">Seleccionar zona</option>
              <option value="Zona A">Zona A</option>
              <option value="Zona B">Zona B</option>
              <option value="Zona C">Zona C</option>
            </select>
          )}
          {filterType === "Activo" && (
            <select
              className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
              value={activoFilter}
              onChange={(e) => setActivoFilter(e.target.value)}
            >
              <option value="">Seleccionar estado</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          )}
          <button
            className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>
        <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-300 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Comercio</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">


        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-400">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  Nombre o razón social
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  Nombre de Fantasía
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Barrio</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Calle</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Zona</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Activo</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-100">
              {currentComercios.length > 0 ? (
                currentComercios.map((comercio, index) => (
                  <tr
                    key={comercio.id}
                    className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-orange-25"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{comercio.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comercio.nombreRazonSocial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comercio.nombreFantasia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comercio.barrio}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comercio.calle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comercio.zona}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border-2 transition-all duration-200 ${
                          comercio.activo
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm"
                            : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300 shadow-sm"
                        }`}
                      >
                        {comercio.activo ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-500 hover:text-blue-500 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Eye className="w-8 h-8 text-gray-300" />
                      <p className="text-lg font-medium">No se encontraron comercios</p>
                      <p className="text-sm">Intenta con otros criterios de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white to-amber-50 px-6 py-4 border-t border-orange-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-700 hover:bg-blue-400 shadow-sm hover:shadow-md border"
                }`}
              >
                Anterior
              </button>
              <div className="px-4 py-2 bg-gray-400">
                <span className="text-sm font-bold text-white">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-700 text-white hover:to-blue-400"
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
