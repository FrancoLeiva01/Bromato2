"use client";

import type React from "react";
import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  X,
  FileText,
} from "lucide-react";
import InspeccionesData from "../components/InspeccionesData";

const ActasInspeccion: React.FC = () => {
  const [selectedActa, setSelectedActa] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("Todos");
  const [filterTurno, setFilterTurno] = useState("Todos");
  const itemsPerPage = 10;

  const actas = [
    {
      id: 1,
      numero: "AI-2024-001",
      denuncia: "-",
      fecha: "2024-01-15",
      turno: "Tarde",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
      razonSocial: "Supermercado Catamarca SA",
      fantasia: "SuperCata",
    },
    ...Array.from({ length: 52 }, (_, i) => ({
      id: i + 2,
      numero: `AI-2024-${String(i + 2).padStart(3, "0")}`,
      denuncia: "-",
      fecha: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
      turno: ["Tarde", "Mañana", "Finde", "Noche"][i % 4],
      cargado: ["Completada", "En proceso", "Pendiente"][i % 3],
      numeroNotificacion: ["Aprobada", "Observaciones", "Rechazada"][i % 3],
      razonSocial: ["Mercado San Juan", "Kiosco 24hs", "Farmacia Central"][
        i % 3
      ],
      fantasia: ["Mercadito SJ", "K24", "FarmaC"][i % 3],
    })),
  ];

  const filteredActas = actas.filter((acta) => {
    const term = searchTerm.toLowerCase();
    if (filterTurno !== "Todos" && acta.turno !== filterTurno) return false;
    if (!term.trim()) return true;
    switch (filterField) {
      case "Todos":
        return (
          acta.numero.toLowerCase().includes(term) ||
          acta.turno.toLowerCase().includes(term) ||
          acta.numeroNotificacion.toLowerCase().includes(term) ||
          acta.cargado.toLowerCase().includes(term) ||
          acta.razonSocial.toLowerCase().includes(term) ||
          acta.fantasia.toLowerCase().includes(term)
        );
      case "Numero":
        return acta.numero.toLowerCase().includes(term);
      case "Notificacion":
        return acta.numeroNotificacion.toLowerCase().includes(term);
      case "RazonSocial":
        return acta.razonSocial.toLowerCase().includes(term);
      case "Fantasia":
        return acta.fantasia.toLowerCase().includes(term);
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

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-lg shadow-gray-600 ">
      {/* 🔹 Título centrado con ícono */}
      <div className="mb-6">
        <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center shadow-inner">
          <Search className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-white text-center">
            Actas de Inspección
          </h1>
        </div>
      </div>

      {/* 🔹 Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0 justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Numero">N° de Acta</option>
            <option value="Notificacion">Notificación</option>
            <option value="RazonSocial">Razón Social Comercio</option>
            <option value="Fantasia">Nombre de Fantasía</option>
          </select>

          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          />

          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            value={filterTurno}
            onChange={(e) => {
              setFilterTurno(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="Todos">Todos los turnos</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
            <option value="Finde">Finde</option>
          </select>
        </div>
        {/* 🔹 Botón para crear Acta de Inspección */}
        <button
          onClick={handleOpenForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Acta de Inspeccion</span>
        </button>
      </div>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Número de Acta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Denuncia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Turno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Razón Social
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fantasia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cargado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Notificación
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
                  {acta.denuncia}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acta.fecha}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acta.turno}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acta.razonSocial}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {acta.fantasia}
                </td>
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      acta.numeroNotificacion === "Aprobada"
                        ? "bg-green-100 text-green-800"
                        : acta.numeroNotificacion === "Observaciones"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {acta.numeroNotificacion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedActa(acta)}
                    className="text-gray-700 hover:text-orange-600"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedActa && (
        <InspeccionesData
          actaData={selectedActa}
          onClose={() => setSelectedActa(null)}
        />
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Nueva Acta de Inspección</h2>
              </div>
              <button
                onClick={handleCloseForm}
                className="text-white hover:text-red-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                {/* Sección 1: DATOS DE LA PERSONA HUMANA O JURÍDICA A INSPECCIONAR */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                    1. Datos de la Persona Humana o Jurídica a Inspeccionar
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre o razón social"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="CUIT/CUIL"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />

                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">
                        Habilitación Municipal:
                      </span>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="habilitacion"
                          value="si"
                          className="accent-blue-600"
                        />
                        <span className="text-sm">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="habilitacion"
                          value="no"
                          className="accent-blue-600"
                        />
                        <span className="text-sm">No</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="habilitacion"
                          value="tramite"
                          className="accent-blue-600"
                        />
                        <span className="text-sm">En trámite</span>
                      </label>
                    </div>

                    <input
                      type="date"
                      placeholder="Fecha constancia"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Domicilio declarado"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Actividad habilitada"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />

                    <label className="flex items-start space-x-2">
                      <input type="checkbox" className="mt-1 accent-blue-600" />
                      <span className="text-xs text-gray-600">
                        No se permite la realización de la inspección. En virtud
                        de ello se procede a fijar el acta notificada en la
                        puerta del inmueble, según lo establecido por el
                        artículo 210° C.P.A.M. y se remite a J.F.M. en los
                        términos del artículo 210° C.M.I.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Sección 2: DATOS PERSONALES DE LA PERSONA HUMANA QUE NOS RECIBE LA INSPECCIÓN */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                    2. Datos Personales de la Persona Humana que nos Recibe la
                    Inspección
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre y apellido"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="D.N.I."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Cargo/función"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Sección 3: INSPECCIÓN */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                    3. Inspección
                  </h3>

                  {/* a. Coincide el domicilio */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        a. ¿Coincide el domicilio declarado con el domicilio
                        efectivo e inspeccionado?
                      </span>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="domicilio"
                          value="si"
                          className="accent-blue-600"
                        />
                        <span className="text-sm">Sí</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="domicilio"
                          value="no"
                          className="accent-blue-600"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="En caso negativo, domicilio efectivo e inspeccionado"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {/* b. Actividad efectivamente desarrollada */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      b. Actividad efectivamente desarrollada:
                    </label>
                    <textarea
                      placeholder="Describa la actividad..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                    />
                  </div>

                  {/* c. Condiciones de higiene en general */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        c. Condiciones de higiene en general
                      </h4>
                      <div className="space-y-2">
                        {[
                          { id: "higiene-1", label: "Orden y limpieza" },
                          { id: "higiene-2", label: "Baños" },
                          {
                            id: "higiene-3",
                            label: "Cantidad de baños completos y retrete",
                          },
                          { id: "higiene-4", label: "Cantidad de baños" },
                          {
                            id: "higiene-5",
                            label: "Cantidad de baños completos",
                          },
                          {
                            id: "higiene-6",
                            label: "Cantidad de baños con retrete",
                          },
                        ].map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              className="accent-blue-600"
                            />
                            <span className="text-sm">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Complemento de elementos de seguridad
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            id: "seguridad-1",
                            label:
                              "¿Posee botiquín de primeros auxilios con los elementos mínimos?",
                          },
                          { id: "seguridad-2", label: "Matafuego (varias)" },
                          {
                            id: "seguridad-3",
                            label: "¿Están en vigencia los matafuegos?",
                          },
                          { id: "seguridad-4", label: "Tipos de matafuegos" },
                          {
                            id: "seguridad-5",
                            label: "¿Los matafuegos tienen señalización?",
                          },
                          {
                            id: "seguridad-6",
                            label:
                              "¿Posee salida de emergencia bien señalizada?",
                          },
                        ].map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              className="accent-blue-600"
                            />
                            <span className="text-sm">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* d. Condiciones de agua */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      d. Condiciones de agua
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">Estado:</span>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="agua-estado"
                            value="potable"
                            className="accent-blue-600"
                          />
                          <span className="text-sm">Potable</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="agua-estado"
                            value="no-potable"
                            className="accent-blue-600"
                          />
                          <span className="text-sm">No potable</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Lugar de depósito de residuos para desalojo"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <textarea
                        placeholder="Observaciones..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-16 resize-none"
                      />
                    </div>
                  </div>

                  {/* Muebles de materiales, Manejo, Estado */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Muebles de materiales"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Manejo"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Estado"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Sección 4: DEBERES FORMALES */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                    4. Deberes Formales
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Certificación de desinfección (ordenanza N° 2819):
                    </span>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="certificacion"
                        value="si"
                        className="accent-blue-600"
                      />
                      <span className="text-sm">Sí</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="certificacion"
                        value="no"
                        className="accent-blue-600"
                      />
                      <span className="text-sm">No</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="certificacion-exhibe"
                        value="si"
                        className="accent-blue-600"
                      />
                      <span className="text-sm">
                        En caso afirmativo, exhibe: Sí
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="certificacion-exhibe"
                        value="no"
                        className="accent-blue-600"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                {/* Sección 5: OBSERVACIONES Y DESCRIPCIÓN GENERAL */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                    5. Observaciones y Descripción General
                  </h3>
                  <textarea
                    placeholder="Escriba sus observaciones generales aquí..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-32 resize-none"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar Acta de Inspección
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Paginación */}
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
    </div>
  );
};

export default ActasInspeccion;
