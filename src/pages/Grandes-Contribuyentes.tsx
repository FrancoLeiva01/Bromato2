"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Store,
  Plus,
  Eye,
  X,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";

interface GranContribuyente {
  id: number;
  nombreRazonSocial: string;
  nombreFantasia: string;
  barrio: string;
  calle: string;
  zona: string;
  activo: boolean;
}

const GrandesContribuyentes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Filtros");
  const [barrioFilter, setBarrioFilter] = useState("");
  const [zonaFilter, setZonaFilter] = useState("");
  const [activoFilter, setActivoFilter] = useState("");
  const [selectedContribuyente, setSelectedContribuyente] =
    useState<GranContribuyente | null>(null);

  const itemsPerPage = 10;

  // Simulación de datos
  const grandesContribuyentes: GranContribuyente[] = useMemo(
    () =>
      Array.from({ length: 67 }, (_, i) => ({
        id: i + 1,
        nombreRazonSocial: `Comercio S.R.L. ${i + 1}`,
        nombreFantasia: `Fantasía ${i + 1}`,
        barrio: ["Centro", "Norte", "Sur", "Este", "Oeste"][
          Math.floor(Math.random() * 5)
        ],
        calle: `Calle ${Math.floor(Math.random() * 100) + 1}`,
        zona: ["Zona A", "Zona B", "Zona C"][Math.floor(Math.random() * 3)],
        activo: Math.random() > 0.3,
      })),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtro general
  const filteredGrandesContribuyentes = grandesContribuyentes.filter((g) => {
    switch (filterType) {
      case "Nombre de Fantasia":
        return g.nombreFantasia.toLowerCase().includes(searchTerm.toLowerCase());
      case "Nombre/Razon Social comercio":
        return g.nombreRazonSocial
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      case "Calle":
        return g.calle.toLowerCase().includes(searchTerm.toLowerCase());
      case "Barrio":
        return !barrioFilter || g.barrio === barrioFilter;
      case "Zona":
        return !zonaFilter || g.zona === zonaFilter;
      case "Activo":
        return !activoFilter || g.activo.toString() === activoFilter;
      case "Todos":
      case "Filtros":
      default:
        return true;
    }
  });

  // Paginación
  const totalPages = Math.ceil(filteredGrandesContribuyentes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComercios = filteredGrandesContribuyentes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSearchTerm("");
    setBarrioFilter("");
    setZonaFilter("");
    setActivoFilter("");
    setCurrentPage(1);
  };

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Grandes Contribuyentes..."
      minHeight="400px"
    >
      {/* --- Título --- */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 rounded-lg">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="bg-pink-500/10 p-3 rounded-xl border border-orange-500/30">
                <Store className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Grandes Contribuyentes
              </h1>
            </div>
          </div>
        </div>

        {/* --- Filtros + botón nuevo --- */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <select
                value={filterType}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
              >
                <option value="Filtros">Filtros</option>
                <option value="Todos">Todos</option>
                <option value="Nombre de Fantasia">Nombre de Fantasía</option>
                <option value="Nombre/Razon Social comercio">
                  Nombre/Razón Social comercio
                </option>
                <option value="Calle">Calle</option>
                <option value="Barrio">Barrio</option>
                <option value="Zona">Zona</option>
                <option value="Activo">Activo</option>
              </select>

              {/* Inputs dinámicos */}
              {(filterType === "Nombre de Fantasia" ||
                filterType === "Nombre/Razon Social comercio" ||
                filterType === "Calle") && (
                <input
                  type="text"
                  placeholder={`Buscar por ${filterType.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-slate-700 shadow-lg"
                />
              )}

              {filterType === "Barrio" && (
                <select
                  value={barrioFilter}
                  onChange={(e) => setBarrioFilter(e.target.value)}
                  className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-slate-700 shadow-lg"
                >
                  <option value="">Seleccionar barrio</option>
                  {["Centro", "Norte", "Sur", "Este", "Oeste"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              )}

              {filterType === "Zona" && (
                <select
                  value={zonaFilter}
                  onChange={(e) => setZonaFilter(e.target.value)}
                  className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-slate-700 shadow-lg"
                >
                  <option value="">Seleccionar zona</option>
                  {["Zona A", "Zona B", "Zona C"].map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              )}

              {filterType === "Activo" && (
                <select
                  value={activoFilter}
                  onChange={(e) => setActivoFilter(e.target.value)}
                  className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-slate-700 shadow-lg"
                >
                  <option value="">Seleccionar estado</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              )}
            </div>

            <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold">
              <Plus className="w-5 h-5" />
              <span>Nuevo Gran Contribuyente</span>
            </button>
          </div>

          {/* --- Tabla --- */}
          <div className="mt-6 bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b-2 border-orange-600">
                  <tr>
                    {[
                      "ID",
                      "Nombre/Razón Social",
                      "Nombre de Fantasía",
                      "Barrio",
                      "Calle",
                      "Zona",
                      "Activo",
                      "Acciones",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left font-bold text-white uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-700/50">
                  {currentComercios.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`${
                        i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                      } hover:bg-slate-700/50 transition-all duration-200`}
                    >
                      <td className="px-6 py-4 font-semibold text-white">
                        {c.id}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{c.nombreRazonSocial}</td>
                      <td className="px-6 py-4 text-slate-300">{c.nombreFantasia}</td>
                      <td className="px-6 py-4 text-slate-300">{c.barrio}</td>
                      <td className="px-6 py-4 text-slate-300">{c.calle}</td>
                      <td className="px-6 py-4 text-slate-300">{c.zona}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            c.activo
                              ? "bg-green-200 text-green-500"
                              : "bg-red-200 text-red-500"
                          }`}
                        >
                          {c.activo ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => setSelectedContribuyente(c)}
                          title="Ver detalles"
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2.5 rounded-xl transition-all border border-transparent hover:border-cyan-500/30"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          title="Editar"
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-2.5 rounded-xl transition-all border border-transparent hover:border-amber-500/30"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          title="Eliminar"
                          className="text-red-500 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Paginación --- */}
            <div className="bg-slate-800/80 px-6 py-5 flex items-center justify-center space-x-4 border-t border-slate-700/50">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1 || totalPages === 0}
                className={`p-3 rounded-xl transition-all ${
                  currentPage === 1 || totalPages === 0
                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                    : "bg-slate-700 text-white hover:bg-slate-600 hover:scale-105"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="bg-slate-700/50 px-6 py-3 rounded-xl border border-slate-600/50">
                <span className="text-sm font-semibold text-slate-200">
                  Página{" "}
                  <span className="text-white">{totalPages === 0 ? 0 : currentPage}</span>{" "}
                  de <span className="text-white">{totalPages}</span>
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-3 rounded-xl transition-all ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:scale-105"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Detalles --- */}
      {selectedContribuyente && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 w-[700px] shadow-2xl relative border border-slate-600/50">
            <button
              onClick={() => setSelectedContribuyente(null)}
              className="absolute top-4 right-4 text-white hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold text-center mb-6 text-pink-500">
              Gran Contribuyente N° {selectedContribuyente.id}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Razón Social", selectedContribuyente.nombreRazonSocial],
                ["Nombre de Fantasía", selectedContribuyente.nombreFantasia],
                ["Barrio", selectedContribuyente.barrio],
                ["Calle", selectedContribuyente.calle],
                ["Zona", selectedContribuyente.zona],
                ["Activo", selectedContribuyente.activo ? "Sí" : "No"],
                ["Habilitación Bromatológica", "-"],
                ["Habilitación Comercial", "-"],
                ["CUIT", "00-00000000-0"],
                ["Es móvil", selectedContribuyente.activo ? "Sí" : "No"],
                ["Expediente N°", "S/N"],
                ["N° de Suministro", "S/N"],
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-700/40 p-3 rounded-xl">
                  <p className="text-slate-300">
                    {label}: <b className="text-white">{value}</b>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </LoaderContent>
  );
};

export default GrandesContribuyentes;
