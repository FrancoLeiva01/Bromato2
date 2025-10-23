"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  X,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";
import ComprobacionData from "@/components/ComprobacionData";
import { LoaderContent } from "@/components/LoaderComponent";
import axios from "axios";
import { apiClient } from "@/services/authService";

// En types

interface Acta {
  id: number;
  numero: string;
  propietarios: string;
  nJuzgado: string;
  creado: string;
  nombreFantasia: string;
  razonSocial: string;
  acta_comprobacion_nro?: string;
  fecha_acta_comprobacion?: string;
  hora_acta_comprobacion?: string;
  detalle_procedimiento?: string;
  procedimientos?: string;
  domicilio_inspeccionado?: string;
  inspectores_id?: number[];
  observaciones?: string;
  pdf_url?: string;
}

interface Inspector {
  id: number;
  nombres: string;
  identificador: string;
}

// Hook y Repository (?

const ActasComprobacion: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // LOADER
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("Todos");
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActa, setSelectedActa] = useState<Acta | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actaToEdit, setActaToEdit] = useState<Acta | null>(null);
  const itemsPerPage = 10;

  const [actas, setActas] = useState<Acta[]>([]);
  const [totalActas, setTotalActas] = useState(0);
  const [allInspectors, setAllInspectors] = useState<Inspector[]>([]);

  const API_URL = "http://localhost:4000/api/v1"; // despues es apiClient y normalizacion

  const PROCEDIMIENTOS = [
    "CLAUSURA PREVENTIVA",
    "DECOMISO",
    "SECUESTRO",
    "INSPECCION",
    "OTROS",
  ];

  const [formData, setFormData] = useState({
    acta_comprobacion_nro: "",
    fecha_acta_comprobacion: "",
    hora_acta_comprobacion: "",
    detalle_procedimiento: "",
    procedimientos: "",
    domicilio_inspeccionado: "",
    inspectores_id: [] as number[],
    observaciones: "",
  });

  const [editFormData, setEditFormData] = useState({
    acta_comprobacion_nro: "",
    fecha_acta_comprobacion: "",
    hora_acta_comprobacion: "",
    detalle_procedimiento: "",
    procedimientos: "",
    domicilio_inspeccionado: "",
    observaciones: "",
  });

  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);

  const normalizeActaFromBackend = (raw: any): Acta => {
    return {
      id: raw.id,
      numero: raw.acta_comprobacion_nro ?? raw.numero ?? "",
      propietarios: raw.propietarios ?? "N/A",
      nJuzgado: raw.nro_juzgado ?? raw.nJuzgado ?? "N/A",
      creado: raw.fecha_acta_comprobacion ?? raw.creado ?? "",
      nombreFantasia: raw.nombreFantasia ?? "N/A",
      razonSocial: raw.razonSocial ?? "N/A",
      acta_comprobacion_nro: raw.acta_comprobacion_nro ?? "",
      fecha_acta_comprobacion: raw.fecha_acta_comprobacion ?? "",
      hora_acta_comprobacion: raw.hora_acta_comprobacion ?? "",
      detalle_procedimiento: raw.detalle_procedimiento ?? "",
      procedimientos: raw.procedimientos ?? "",
      domicilio_inspeccionado: raw.domicilio_inspeccionado ?? "",
      inspectores_id: raw.inspectores_id ?? [],
      observaciones: raw.observaciones ?? "",
      pdf_url: raw.pdf_url ?? "",
    };
  };

  // GET INSPECTORES

  const getAllInspectors = async () => {
    try {
      const { data } = await apiClient.get(`inspector/all-inspector`);
      setAllInspectors(data);
    } catch (error) {
      console.error("Error al obtener inspectores:", error);
    }
  };

  useEffect(() => {
    getAllInspectors();
  }, []);

  // LOADER

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // ------------------------------------------

  // GET ACTAS

  const getActas = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_URL}/acta-comprobacion?page=${currentPage}`
      );
      console.log("[v0] Respuesta del backend:", res.data);

      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.actas ?? res.data;

      const total = res.data.total ?? payload.length;
      setTotalActas(total);

      const normalized = payload.map(normalizeActaFromBackend);
      setActas(normalized);
    } catch (error) {
      console.error("Error al obtener actas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActas();
  }, [currentPage]);

  // CREATE

  const createActa = async (newActa: any) => {
    try {
      const res = await axios.post(`${API_URL}/acta-comprobacion`, newActa);
      const createdRaw = res.data?.data ?? res.data;
      const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;

      const normalized = normalizeActaFromBackend(created);
      setActas((prev) => [...prev, normalized]);

      await getActas();
      alert("✅ Acta de Comprobación creada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al crear acta:", error);
      alert(
        `Error al crear acta: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // UPDATE

  const updateActa = async (id: number, updatedData: Partial<Acta>) => {
    try {
      const payload = {
        acta_comprobacion_nro: updatedData.acta_comprobacion_nro,
        fecha_acta_comprobacion: updatedData.fecha_acta_comprobacion,
        hora_acta_comprobacion: updatedData.hora_acta_comprobacion,
        detalle_procedimiento: updatedData.detalle_procedimiento,
        procedimientos: updatedData.procedimientos,
        domicilio_inspeccionado: updatedData.domicilio_inspeccionado,
        observaciones: updatedData.observaciones,
      };

      console.log("Actualizando acta ID:", id, "con payload:", payload);
      const res = await axios.patch(
        `${API_URL}/acta-comprobacion/${id}`,
        payload
      );
      console.log("✅ Acta actualizada:", res.data);

      await getActas();
      alert("✅ Acta actualizada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar acta:", error);
      alert(
        `Error al actualizar acta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // DELETE

  const deleteActa = async (id: number) => {
    if (!confirm("¿Está seguro de que desea eliminar esta acta?")) {
      return;
    }

    try {
      console.log("Eliminando acta:", id);
      await axios.delete(`${API_URL}/acta-comprobacion/${id}`);
      console.log("✅ Acta eliminada");

      await getActas();
      alert("✅ Acta eliminada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al eliminar acta:", error);
      alert(
        `Error al eliminar acta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // FILTER

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

  const handleViewDetails = (acta: Acta) => {
    setSelectedActa(acta);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPdfFile(null);
    setFormData({
      acta_comprobacion_nro: "",
      fecha_acta_comprobacion: "",
      hora_acta_comprobacion: "",
      detalle_procedimiento: "",
      procedimientos: "",
      domicilio_inspeccionado: "",
      inspectores_id: [],
      observaciones: "",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append(
      "acta_comprobacion_nro",
      formData.acta_comprobacion_nro
    );
    formDataToSend.append(
      "fecha_acta_comprobacion",
      formData.fecha_acta_comprobacion
    );
    formDataToSend.append(
      "hora_acta_comprobacion",
      formData.hora_acta_comprobacion
    );
    formDataToSend.append(
      "detalle_procedimiento",
      formData.detalle_procedimiento
    );
    formDataToSend.append("procedimientos", formData.procedimientos);
    formDataToSend.append(
      "domicilio_inspeccionado",
      formData.domicilio_inspeccionado
    );
    formDataToSend.append("observaciones", formData.observaciones);
    formDataToSend.append(
      "inspectores_id",
      JSON.stringify(formData.inspectores_id)
    );

    if (selectedPdfFile) {
      formDataToSend.append("pdf", selectedPdfFile);
    }

    console.log("Enviando payload con PDF");

    try {
      const res = await axios.post(
        `${API_URL}/acta-comprobacion`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const createdRaw = res.data?.data ?? res.data;
      const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;

      const normalized = normalizeActaFromBackend(created);
      setActas((prev) => [...prev, normalized]);

      await getActas();
      alert("✅ Acta de Comprobación creada exitosamente");
      handleCloseForm();
    } catch (error: any) {
      console.error("❌ Error al crear acta:", error);
      alert(
        `Error al crear acta: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actaToEdit) {
      await updateActa(actaToEdit.id, editFormData);
      setIsEditModalOpen(false);
      setActaToEdit(null);
    }
  };

  const handleInspectorToggle = (inspectorId: number) => {
    setFormData((prev) => ({
      ...prev,
      inspectores_id: prev.inspectores_id.includes(inspectorId)
        ? prev.inspectores_id.filter((id) => id !== inspectorId)
        : [...prev.inspectores_id, inspectorId],
    }));
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedPdfFile(file);
    } else {
      alert("Por favor seleccione un archivo PDF válido");
    }
  };

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Actas..."
      minHeight="400px"
    >
      {/* TITULO */}

      <div className="bg-slate-700 p-6 rounded-lg shadow-lg shadow-gray-600">
        <div className="mb-6">
          <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center shadow-inner">
            <ClipboardCheck className="w-8 h-8 text-green-500 mr-2" />
            <h1 className="text-3xl font-bold text-white text-center">
              Actas de Comprobación
            </h1>
          </div>
        </div>

        {/* TABLA */}

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

          {/* CREAR ACTA DE COMPROBACION */}

          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Acta de Comprobacion</span>
          </button>
        </div>

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
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentActas.length > 0 ? (
                currentActas.map((acta) => (
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
                      <div className="flex space-x-2">
                        
                        {/* VER DETALLES DEL ACTA */}

                        <button
                          onClick={() => handleViewDetails(acta)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg"
                          title="Ver detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* EDITAR EL ACTA */}

                        <button
                          onClick={() => {
                            setActaToEdit(acta);
                            setEditFormData({
                              acta_comprobacion_nro:
                                acta.acta_comprobacion_nro || acta.numero,
                              fecha_acta_comprobacion:
                                acta.fecha_acta_comprobacion || acta.creado,
                              hora_acta_comprobacion:
                                acta.hora_acta_comprobacion || "",
                              detalle_procedimiento:
                                acta.detalle_procedimiento || "",
                              procedimientos: acta.procedimientos || "",
                              domicilio_inspeccionado:
                                acta.domicilio_inspeccionado || "",
                              observaciones: acta.observaciones || "",
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Editar acta"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* ELIMINAR ACTA */}

                        <button
                          onClick={() => deleteActa(acta.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Eliminar acta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
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

        {/* PAGINACION */}

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

        {/* FORMULARIO DE CREACION DE ACTA */}

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-slate-700 text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl font-bold">
                    Nueva Acta de Comprobación
                  </h2>
                </div>
                <button
                  onClick={handleCloseForm}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* CAMPO 1. DATOS DEL ACTA */}

              <div className="overflow-y-auto flex-1 p-6 bg-slate-500">
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      1. Datos del Acta
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          N° Acta de Comprobación
                        </label>
                        <input
                          type="text"
                          value={formData.acta_comprobacion_nro}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              acta_comprobacion_nro: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Número de acta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha Acta
                        </label>
                        <input
                          type="date"
                          value={formData.fecha_acta_comprobacion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fecha_acta_comprobacion: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hora
                        </label>
                        <input
                          type="time"
                          value={formData.hora_acta_comprobacion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hora_acta_comprobacion: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CAMPO 2. PROCEDIMENTO */}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      2. Procedimiento
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Procedimiento
                        </label>
                        <select
                          value={formData.procedimientos}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              procedimientos: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">Seleccione un procedimiento</option>
                          {PROCEDIMIENTOS.map((proc) => (
                            <option key={proc} value={proc}>
                              {proc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Detalle del Procedimiento
                        </label>
                        <textarea
                          maxLength={700}
                          rows={4}
                          value={formData.detalle_procedimiento}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              detalle_procedimiento: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                          placeholder="Describa el procedimiento..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* CAMPO 3. ACA VA MAPA MAPIN MAPITA */}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      3. Domicilio Inspeccionado
                    </h3>
                    <input
                      type="text"
                      value={formData.domicilio_inspeccionado}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          domicilio_inspeccionado: e.target.value,
                        })
                      }
                      required
                      placeholder="Dirección del domicilio inspeccionado"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  {/* CAMPO 4. INSPECTORES (YA CARGADOS) */}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      4. Inspectores
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allInspectors.length > 0 ? (
                        allInspectors.map((inspector) => (
                          <label
                            key={inspector.id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.inspectores_id.includes(
                                inspector.id
                              )}
                              onChange={() =>
                                handleInspectorToggle(inspector.id)
                              }
                              className="accent-green-600 w-4 h-4"
                            />
                            <span className="text-sm text-gray-700">
                              {inspector.nombres} - Legajo:{" "}
                              {inspector.identificador}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic col-span-2">
                          No hay inspectores disponibles
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CAMPO 5. DOCUMENTACION (PDF) */}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      5. Documentación
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PDF del Acta
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfFileChange}
                          className="hidden"
                          id="pdfUpload"
                        />
                        <label
                          htmlFor="pdfUpload"
                          className="cursor-pointer text-gray-500 hover:text-green-600"
                        >
                          {selectedPdfFile ? (
                            <div>
                              <Upload className="w-8 h-8 mx-auto mb-2 text-green-600" />
                              <div className="text-sm font-medium text-green-600">
                                {selectedPdfFile.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {(selectedPdfFile.size / 1024 / 1024).toFixed(
                                  2
                                )}{" "}
                                MB
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-4xl mb-2">📄</div>
                              <div className="text-sm">
                                Haz click para subir un PDF
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Tamaño máximo: 10MB
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* CAMPO 6. OBSERVACIONES */}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      6. Observaciones
                    </h3>
                    <textarea
                      maxLength={700}
                      rows={6}
                      value={formData.observaciones}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          observaciones: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                      placeholder="Escriba sus observaciones aquí..."
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {formData.observaciones.length}/700 caracteres
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors ml-5"
                    >
                      Guardar Acta de Comprobación
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MISMO FORMULARIO PERO PARA EDITAR */}

        {isEditModalOpen && actaToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-slate-700 text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ClipboardCheck className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl font-bold">Editar Acta</h2>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setActaToEdit(null);
                  }}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 bg-slate-500">
                <form className="space-y-6" onSubmit={handleEditFormSubmit}>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      Datos del Acta
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          N° Acta
                        </label>
                        <input
                          type="text"
                          value={editFormData.acta_comprobacion_nro}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              acta_comprobacion_nro: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha
                        </label>
                        <input
                          type="date"
                          value={editFormData.fecha_acta_comprobacion}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              fecha_acta_comprobacion: e.target.value,
                            })
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hora
                        </label>
                        <input
                          type="time"
                          value={editFormData.hora_acta_comprobacion}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              hora_acta_comprobacion: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      Procedimiento
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          value={editFormData.procedimientos}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              procedimientos: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">Seleccione</option>
                          {PROCEDIMIENTOS.map((proc) => (
                            <option key={proc} value={proc}>
                              {proc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Detalle
                        </label>
                        <textarea
                          maxLength={700}
                          rows={4}
                          value={editFormData.detalle_procedimiento}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              detalle_procedimiento: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      Domicilio
                    </h3>
                    <input
                      type="text"
                      value={editFormData.domicilio_inspeccionado}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          domicilio_inspeccionado: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                      Observaciones
                    </h3>
                    <textarea
                      maxLength={700}
                      rows={6}
                      value={editFormData.observaciones}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          observaciones: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                      placeholder="Escriba sus observaciones aquí..."
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {editFormData.observaciones.length}/700 caracteres
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setActaToEdit(null);
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Actualizar Acta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoaderContent>
  );
};

export default ActasComprobacion;
