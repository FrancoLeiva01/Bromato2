"use client";

import type React from "react";
import { useState } from "react";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  X,
} from "lucide-react";
import ComprobacionData from "@/components/ComprobacionData";

const ActasComprobacion: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("Todos");
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActa, setSelectedActa] = useState<(typeof actas)[0] | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const itemsPerPage = 10;

  const actas = [
    {
      id: 1,
      numero: "AC-2024-001",
      propietarios: "Juan Pérez, María García",
      nJuzgado: "JUZ-001",
      creado: "2024-01-18",
      nombreFantasia: "Supermercado La Plaza",
      razonSocial: "Comercial La Plaza S.A.",
    },
    ...Array.from({ length: 270 }, (_, i) => ({
      id: i + 2,
      numero: `AC-2024-${String(i + 2).padStart(3, "0")}`,
      propietarios: [
        "Ana López, Pedro Rodríguez",
        "Carlos Martínez",
        "Elena González, Miguel Torres",
        "Fernando Díaz",
        "Isabel Ruiz, Jorge Morales",
      ][i % 5],
      nJuzgado: `JUZ-${String((i % 10) + 1).padStart(3, "0")}`,
      creado: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
      nombreFantasia: [
        "Supermercado Central",
        "Kiosko Las Flores",
        "Farmacia San Martín",
        "Panadería El Trigal",
        "Verdulería Don Pepe",
      ][i % 5],
      razonSocial: [
        "Comercial Central S.A.",
        "Distribuidora Las Flores",
        "Farmacéutica SM SRL",
        "Panificados El Trigal",
        "Hortalizas Pepe SRL",
      ][i % 5],
    })),
  ];

  const filteredActas = actas.filter((acta) => {
    if (!filterValue) return true;
    const value = filterValue.toLowerCase();
    switch (filterType) {
      case "Todos":
        return (
          acta.numero.toLowerCase().includes(value) ||
          acta.propietarios.toLowerCase().includes(value) ||
          acta.nombreFantasia.toLowerCase().includes(value) ||
          acta.razonSocial.toLowerCase().includes(value)
        );
      case "Numero":
        return acta.numero.toLowerCase().includes(value);
      case "Propietario":
        return acta.propietarios.toLowerCase().includes(value);
      case "Fantasia":
        return acta.nombreFantasia.toLowerCase().includes(value);
      case "Razon":
        return acta.razonSocial.toLowerCase().includes(value);
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredActas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActas = filteredActas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleViewDetails = (acta: (typeof actas)[0]) => {
    setSelectedActa(acta);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-lg shadow-gray-600 ">
      {/* Título centrado */}
      <div className="mb-6">
        <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center shadow-inner">
          <ClipboardCheck className="w-8 h-8 text-green-500 mr-2" />
          <h1 className="text-3xl font-bold text-white text-center">
            Actas de Comprobación
          </h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0 justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          >
            <option value="Todos">Todos</option>
            <option value="Numero">N° de Acta de Comprobación</option>
            <option value="Propietario">Propietario</option>
            <option value="Fantasia">Nombre de Fantasía Comercio</option>
            <option value="Razon">Razón Social Comercio</option>
          </select>

          <input
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => {
              setCurrentPage(1);
              setFilterValue(e.target.value);
            }}
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          />
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Acta de Comprobacion</span>
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Propietarios
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                N° Juzgado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Creado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentActas.map((acta) => (
              <tr key={acta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {acta.numero}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {acta.propietarios}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acta.nJuzgado}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acta.creado}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(acta)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {currentActas.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 italic"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacion */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center space-x-2">
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
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-400"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <ComprobacionData
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        acta={selectedActa}
      />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-2xl font-bold">Nueva Acta de Comprobación</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white hover:text-red-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Logo Section */}
              <div className="flex justify-center mb-4">
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-xl">
                    Catamarca
                  </div>
                  <div className="text-blue-600 font-bold text-xl">Capital</div>
                </div>
              </div>

              {/* Acta de Inspeccion y Fecha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acta de Inspección
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de acta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Acta
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Nombre/Razón Social y CUIT/CUIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre/Razón Social
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre o razón social"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CUIT/CUIL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="XX-XXXXXXXX-X"
                  />
                </div>
              </div>

              {/* Permito Inspección */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="permitoInspeccion"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="permitoInspeccion"
                  className="text-sm font-medium text-gray-700"
                >
                  Permito Inspección
                </label>
              </div>

              {/* Nombre y Apellido de persona que recibe la inspección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre y Apellido de persona que recibe la inspección
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre completo"
                />
              </div>

              {/* DNI y Cargo/Función */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    D.N.I.
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de DNI"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo/Función
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cargo o función"
                  />
                </div>
              </div>

              {/* Coincide domicilio */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="coincideDomicilio"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="coincideDomicilio"
                  className="text-sm font-medium text-gray-700"
                >
                  Coincide el domicilio declarado con el inspeccionado
                </label>
              </div>

              {/* Domicilio Inspeccionado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domicilio Inspeccionado
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dirección completa"
                />
              </div>

              {/* Inspectores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector 1
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del inspector"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legajo 1
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de legajo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector 2
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del inspector"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legajo/DNI 2
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número de legajo o DNI"
                  />
                </div>
              </div>

              {/* PDF de Acta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF de Acta
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="pdfUpload"
                  />
                  <label
                    htmlFor="pdfUpload"
                    className="cursor-pointer text-gray-600 hover:text-blue-600"
                  >
                    <div className="text-4xl mb-2">📄</div>
                    <div className="text-sm">Haz clic para subir un PDF</div>
                  </label>
                </div>
              </div>

              {/* Google Maps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="URL de Google Maps o coordenadas"
                />
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Escriba sus observaciones aquí..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para guardar el acta
                    setIsFormOpen(false);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Acta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActasComprobacion;
