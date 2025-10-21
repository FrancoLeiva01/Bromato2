"use client";

import type React from "react";
import {
  Bell,
  Eye,
  Edit,
  Trash2,
  FolderClock,
  ClipboardList,
  Plus,
  X,
  TriangleAlert,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderContent } from "@/components/LoaderComponent";
import { apiClient } from "@/services/authService";

// En un types

interface Notification {
  id: number;
  tipo_infraccion: string[];
  nro_notificacion: string;
  detalle_notificacion: string;
  hora_notificacion?: string;
  fecha_notificacion: string;
  plazo_dias: number;
  fecha_vencimiento?: string;
  nombre_inspector: string;
  identificador_inspector: string;
  nombre_contribuyente: string;
  apellido_contribuyente: string;
  dni_contribuyente: string;
  direccion_notificacion: string;
}

interface Inspector {
  id: number;
  nombres: string;
  apellidos: string;
  identificador: string;
}

enum TIPO_INFRACCION {
  MATA_FUEGO = "MATA FUEGO",
  OEP_ARIDOS = "OEP ÁRIDOS MATERIALES DE CONSTRUCCIÓN",
  VEHICULOS_ABANDONO = "VEHÍCULOS EN ESTADO DE ABANDONO",
  CHATARRA = "CHATARRA",
  CHASIS = "CHATARRA, CHASIS, ESQUELETOS VEHÍCULOS, OTROS",
  ESQUELETOS_VEHICULOS = "ESQUELETOS VEHÍCULOS",
  OTROS = "OTROS",
  LAVADO_VEREDA = "LAVADO DE VEREDA",
  PERDIDA_AGUA = "PÉRDIDA DE AGUA/LÍQUIDOS CLOACALES",
  REPARACION_VEREDA = "REPARACION DE VEREDA",
  HABILITACION_COMERCIAL = "HABILITACIÓN COMERCIAL DEFINITIVA",
}

//-------------------------------------------------------------------

// Hook?

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allInspector, setAllInspector] = useState<Inspector[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationToEdit, setNotificationToEdit] =
    useState<Notification | null>(null);

  // Loader

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Llamados como estos en el hook y repository (?

  // GET NOTIS

  const getNotifications = async () => {
    try {
      setIsLoading(true);
      const url = `${API_URL}/notificacion?page=${currentPage}&size=${itemsPerPage}`;

      const res = await axios.get(url);

      console.log("📥 Respuesta COMPLETA del backend:", res.data);

      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.notifications ?? res.data;

      console.log("📦 Payload extraído:", payload);

      const total = res.data.total ?? payload.length;
      setTotalNotifications(total);

      const normalized = payload.map(normalizeNotificationFromBackend);
      console.log("✨ Datos normalizados:", normalized); // AGREGAR ESTO
      setNotifications(normalized);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [currentPage, itemsPerPage]);

  const [formData, setFormData] = useState({
    nro_notificacion: "",
    tipo_infraccion: [] as string[],
    detalle_notificacion: "",
    fecha_notificacion: "",
    hora_notificacion: "",
    plazo_dias: 3,
    inspector_id: [] as number[],
    nombre_contribuyente: "",
    apellido_contribuyente: "",
    dni_contribuyente: "",
    direccion_contribuyente: "",
  });

  const [editFormData, setEditFormData] = useState({
    nro_notificacion: "",
    tipo_infraccion: [] as string[],
    detalle_notificacion: "",
    fecha_notificacion: "",
    hora_notificacion: "",
    plazo_dias: 3,
  });

  const API_URL = "http://localhost:4000/api/v1"; // despues usar apiClient + normalizacion

  // GET INSPECTORES ---------------------------------------------------------

  const getAllInspectorForSelect = async () => {
    const { data } = await apiClient.get(`inspector/all-inspector`);
    setAllInspector(data);
  };

  useEffect(() => {
    getAllInspectorForSelect();
  }, []);

  // -------------------------------------------------------------------------

  // En el repository

  const normalizeNotificationFromBackend = (raw: any): Notification => {
    console.log("📥 Datos crudos del backend:", raw); // Agregar esto
    return {
      id: raw.id,
      tipo_infraccion: Array.isArray(raw.tipo_infraccion)
        ? raw.tipo_infraccion
        : [raw.tipo_infraccion ?? ""],
      nro_notificacion: raw.nro_notificacion ?? "",
      detalle_notificacion: raw.detalle_notificacion ?? "",
      hora_notificacion: raw.hora_notificacion ?? "",
      fecha_notificacion: raw.fecha_notificacion ?? "",
      plazo_dias: raw.plazo_dias ?? 0,
      fecha_vencimiento: raw.fecha_vencimiento ?? "",
      nombre_inspector: raw.nombre_inspector ?? raw.inspector?.nombres ?? "",
      identificador_inspector:
        raw.identificador_inspector ?? raw.inspector?.identificador ?? "",
      nombre_contribuyente:
        raw.nombre_contribuyente ?? raw.contribuyente?.nombre ?? "",
      apellido_contribuyente:
        raw.apellido_contribuyente ?? raw.contribuyente?.apellido ?? "",
      dni_contribuyente: raw.dni_contribuyente ?? raw.contribuyente?.dni ?? "",
      direccion_notificacion:
        raw.direccion_notificacion ?? raw.contribuyente?.direccion ?? "",
    };
  };

  // CREATE

  const createNotification = async () => {
    try {
      const payload = {
        notificacion: {
          nro_notificacion: formData.nro_notificacion,
          fecha_notificacion: formData.fecha_notificacion,
          hora_notificacion: formData.hora_notificacion,
          detalle_notificacion: formData.detalle_notificacion,
          plazo_dias: formData.plazo_dias,
          inspector_id: formData.inspector_id,
          tipo_infraccion: formData.tipo_infraccion,
        },
        contribuyente: {
          nombre: formData.nombre_contribuyente,
          apellido: formData.apellido_contribuyente,
          direccion: formData.direccion_contribuyente,
          dni: formData.dni_contribuyente,
        },
      };

      console.log("📤 Payload enviado:", payload);

      const res = await axios.post(`${API_URL}/notificacion`, payload);

      console.log("✅ Respuesta del backend:", res.data);

      await getNotifications();
      alert("✅ Notificación creada exitosamente");
      handleCloseForm();
    } catch (error: any) {
      console.error(
        "Error al crear notificación:",
        error.response?.data?.message || error.message
      );
      alert(
        `Error al crear notificación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // UPDATE

  const updateNotification = async (
    id: number,
    updatedData: Partial<typeof editFormData>
  ) => {
    try {
      const payload = {
        nro_notificacion: updatedData.nro_notificacion,
        tipo_infraccion: updatedData.tipo_infraccion,
        detalle_notificacion: updatedData.detalle_notificacion,
        fecha_notificacion: updatedData.fecha_notificacion,
        hora_notificacion: updatedData.hora_notificacion,
        plazo_dias: updatedData.plazo_dias,
      };

      const res = await axios.patch(`${API_URL}/notificacion/${id}`, payload);

      // GET

      await getNotifications();
      alert("✅ Notificación actualizada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar notificación:", error);
      alert(
        `Error al actualizar notificación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // DELETE

  const deleteNotification = async (id: number) => {
    if (!confirm("¿Está seguro de que desea desactivar este inspector?")) {
      return;
    }

    try {
      console.log("🗑️ Desactivando notificacion:", id);
      await axios.get(`${API_URL}/notifications/delete${id}`, {
        data: { activo: "false" },
      });
      console.log("✅ notificacion desactivado");

      await getNotifications();

      alert("✅ notificacion desactivado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al desactivar notificacion:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      alert(
        `Error al desactivar notificacion: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // funciones de la tabla (? en componentes onda NotificationsTable

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        if (!filterType || !searchTerm) return true;

        switch (filterType) {
          case "Fecha":
            return (
              notification.fecha_notificacion.includes(searchTerm) ||
              (notification.fecha_vencimiento &&
                notification.fecha_vencimiento.includes(searchTerm))
            );
          case "Numero de Notificacion":
            return notification.nro_notificacion
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "Tipo":
            return notification.tipo_infraccion.some((tipo) =>
              tipo.toLowerCase().includes(searchTerm.toLowerCase())
            );
          default:
            return true;
        }
      })
    : [];

  const totalPages = Math.max(1, Math.ceil(totalNotifications / itemsPerPage));
  const currentNotifications = filteredNotifications;

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterType("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleNuevaNotificacion = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      nro_notificacion: "",
      tipo_infraccion: [],
      detalle_notificacion: "",
      fecha_notificacion: "",
      hora_notificacion: "",
      plazo_dias: 3,
      inspector_id: [],
      nombre_contribuyente: "",
      apellido_contribuyente: "",
      dni_contribuyente: "",
      direccion_contribuyente: "",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.inspector_id.length === 0) {
      alert("Debe seleccionar al menos un inspector");
      return;
    }
    if (formData.tipo_infraccion.length === 0) {
      alert("Debe seleccionar al menos un tipo de infracción");
      return;
    }

    await createNotification();
  };

  const handleEditClick = (notification: Notification) => {
    setNotificationToEdit(notification);
    setEditFormData({
      nro_notificacion: notification.nro_notificacion,
      tipo_infraccion: notification.tipo_infraccion,
      detalle_notificacion: notification.detalle_notificacion,
      fecha_notificacion: notification.fecha_notificacion,
      hora_notificacion: notification.hora_notificacion ?? "",
      plazo_dias: notification.plazo_dias,
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationToEdit) {
      await updateNotification(notificationToEdit.id, editFormData);
      setIsEditModalOpen(false);
      setNotificationToEdit(null);
    }
  };

  const handleViewDetails = (notification: Notification) => {
    console.log("👁️ Abriendo modal con:", notification);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const handleInspectorToggle = (inspectorId: number) => {
    setFormData((prev) => ({
      ...prev,
      inspector_id: prev.inspector_id.includes(inspectorId)
        ? prev.inspector_id.filter((id) => id !== inspectorId)
        : [...prev.inspector_id, inspectorId],
    }));
  };

  const handleTipoInfraccionToggle = (tipo: string) => {
    setFormData((prev) => ({
      ...prev,
      tipo_infraccion: prev.tipo_infraccion.includes(tipo)
        ? prev.tipo_infraccion.filter((t) => t !== tipo)
        : [...prev.tipo_infraccion, tipo],
    }));
  };

  const handleEditTipoInfraccionToggle = (tipo: string) => {
    setEditFormData((prev) => ({
      ...prev,
      tipo_infraccion: prev.tipo_infraccion.includes(tipo)
        ? prev.tipo_infraccion.filter((t) => t !== tipo)
        : [...prev.tipo_infraccion, tipo],
    }));
  };

  // ------------------------------------------------------------------------------

  // Ver si divido en card, los checks, modals, tabla, paginacion, etc

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Notificaciones..."
      minHeight="400px"
    >
      {/* Proximas a vencer */}
      <div className="bg-slate-700 max-w-full mx-auto p-6 space-y-6 rounded-lg ">
        <div
          className="bg-gray-200 rounded-lg border border-gray-200 shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600"
          style={{
            borderLeftWidth: 10,
            borderRightWidth: 10,
            borderBottomWidth: 10,
          }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FolderClock className="w-6 h-6 text-blue-700" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Notificaciones Próximas a Vencer
                </h1>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-">
            {currentNotifications.slice(0, 3).length > 0 ? (
              currentNotifications.slice(0, 3).map((notification) => (
                <div
                  key={`preview-${notification.id}`}
                  className=" mb-1 p-6 hover:bg-orange-200 transition-colors border-l-4 border-l-red-600 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <TriangleAlert className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className=" capitalize mt-1 text-sm text-gray-800">
                          {notification.detalle_notificacion}
                        </p>
                        {/* Cuando se vea los tipos de infraccion, poner primero el h3 */}
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.tipo_infraccion.join(", ")}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {notification.fecha_vencimiento}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No hay notificaciones próximas a vencer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lista de notis */}

        <div className="bg-gray-100 rounded-lg border border-gray-200 shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600">
          <div className="bg-gray-200 p-6 rounded-lg">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 pb-5">
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-black">
                    Lista de Notificaciones
                  </h1>
                </div>

                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 mr-1"
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="">Filtros</option>
                  <option value="Fecha">Fecha</option>
                  <option value="Numero de Notificacion">
                    Número de Notificación
                  </option>
                  <option value="Tipo">Tipo de Infracción</option>
                </select>

                {filterType && (
                  <input
                    type="text"
                    placeholder={`Buscar por ${filterType.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                )}

                <button
                  className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
                  onClick={handleSearch}
                >
                  Buscar
                </button>

                {(filterType || searchTerm) && (
                  <button
                    className="flex items-center px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <button
                onClick={handleNuevaNotificacion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Notificación</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo Infracción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Notificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inspector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentNotifications.length > 0 ? (
                    currentNotifications.map((notification) => (
                      <tr
                        key={`table-${notification.id}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.nro_notificacion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.tipo_infraccion.join(", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.fecha_notificacion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.fecha_vencimiento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.nombre_inspector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                              onClick={() => handleViewDetails(notification)}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                              onClick={() => handleEditClick(notification)}
                              title="Editar notificación"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              title="Eliminar notificación"
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
                        colSpan={6}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No se encontraron notificaciones.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginacion */}

            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
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
                  onClick={handleNextPage}
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

        {showForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            style={{ marginTop: 0 }}
          >
            <div className="bg-slate-600 rounded-xl p-6 w-full max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={handleCloseForm}
                className="absolute top-3 right-3 text-white hover:text-red-500 text-xl font-bold"
              >
                <X className="w-6 h-6" />
              </button>
              <br />

              <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-orange-500 mr-2" />
                <h2 className="text-3xl font-bold text-white text-center">
                  Nueva Notificación
                </h2>
              </div>

              <br />
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="font-semibold text-white mt-4 mb-2 block">
                    Selecciona Inspector *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allInspector.length > 0 &&
                      allInspector.map((insp) => (
                        <div key={insp.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inspector_id.includes(insp.id)}
                            onChange={() => handleInspectorToggle(insp.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                          />
                          <label className="ms-2 text-sm font-medium text-white">
                            {insp.nombres} {insp.apellidos}
                          </label>
                        </div>
                      ))}
                  </div>
                  {allInspector.length === 0 && (
                    <p className="text-yellow-300 text-sm mt-2">
                      No hay inspectores disponibles. Por favor, agregue
                      inspectores primero.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="N° Notificación *"
                    value={formData.nro_notificacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nro_notificacion: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mt-4 mb-2">
                    Tipo de Infracción: *
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(TIPO_INFRACCION).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.tipo_infraccion.includes(label)}
                          onChange={() => handleTipoInfraccionToggle(label)}
                          className="accent-blue-600"
                        />
                        <span className="text-white text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <textarea
                  maxLength={600}
                  placeholder="Observaciones... *"
                  value={formData.detalle_notificacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detalle_notificacion: e.target.value,
                    })
                  }
                  required
                  className="border p-2 rounded w-full h-24 resize-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm block mb-1">
                      Fecha Notificación *
                    </label>
                    <input
                      type="date"
                      value={formData.fecha_notificacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_notificacion: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm block mb-1">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={formData.hora_notificacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hora_notificacion: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm block mb-1">
                      Plazo (días) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Plazo en días"
                      value={formData.plazo_dias}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plazo_dias: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-400 pt-4 mt-4">
                  <h3 className="text-white font-semibold mb-3">
                    Datos del Contribuyente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre *"
                      value={formData.nombre_contribuyente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_contribuyente: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="Apellido *"
                      value={formData.apellido_contribuyente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          apellido_contribuyente: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="DNI *"
                      value={formData.dni_contribuyente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dni_contribuyente: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="Dirección *"
                      value={formData.direccion_contribuyente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direccion_contribuyente: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full md:col-span-2"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={handleCloseForm}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-300 transition-colors"
                  >
                    Agregar Notificación +
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Editar notis */}

        {isEditModalOpen && notificationToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-600 rounded-xl p-6 w-full max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setNotificationToEdit(null);
                }}
                className="absolute top-3 right-3 text-white hover:text-red-500 text-xl font-bold"
              >
                <X className="w-6 h-6" />
              </button>
              <br />

              <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-orange-500 mr-2" />
                <h2 className="text-3xl font-bold text-white text-center">
                  Editar Notificación
                </h2>
              </div>

              <br />
              <form className="space-y-4" onSubmit={handleEditFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="N° Notificación"
                    value={editFormData.nro_notificacion}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        nro_notificacion: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white mt-4 mb-2">
                    Tipo de Infracción:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(TIPO_INFRACCION).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editFormData.tipo_infraccion.includes(label)}
                          onChange={() => handleEditTipoInfraccionToggle(label)}
                          className="accent-blue-600"
                        />
                        <span className="text-white text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <textarea
                  maxLength={500}
                  placeholder="Observaciones..."
                  value={editFormData.detalle_notificacion}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      detalle_notificacion: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full h-24 resize-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm block mb-1">
                      Fecha Notificación
                    </label>
                    <input
                      type="date"
                      value={editFormData.fecha_notificacion}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fecha_notificacion: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm block mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={editFormData.hora_notificacion}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          hora_notificacion: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm block mb-1">
                      Plazo (días)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Plazo en días"
                      value={editFormData.plazo_dias}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          plazo_dias: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setNotificationToEdit(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-300 transition-colors"
                  >
                    Actualizar Notificación
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isModalOpen && selectedNotification && (
          <div
            className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-50 p-4 mt-0"
            style={{ marginTop: 0 }}
          >
            <div className="bg-slate-600 rounded-lg shadow-xl max-w-3xl w-full p-8 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="space-y-6">
                <div className="text-center border-b border-gray-400 pb-4">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Notificación
                  </h3>
                  <h2 className="text-2xl font-bold text-gray-200">
                    {selectedNotification.nro_notificacion}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Tipo de Infracción
                    </h3>
                    <p className="text-xl font-bold text-orange-500">
                      {selectedNotification.tipo_infraccion.join(", ")}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Inspector
                    </h3>
                    <p className="text-xl font-bold text-blue-400">
                      {selectedNotification.nombre_inspector}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Observaciones
                  </h3>
                  <p className="text-gray-200">
                    {selectedNotification.detalle_notificacion}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-1">
                      Fecha de Notificación
                    </h3>
                    <p className="text-gray-200">
                      {selectedNotification.fecha_notificacion}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-1">
                      Fecha de Vencimiento
                    </h3>
                    <p className="text-gray-200">
                      {selectedNotification.fecha_vencimiento}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-400 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">
                    Datos del Contribuyente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-white mb-1">
                        Nombre
                      </h4>
                      <p className="text-gray-200">
                        {selectedNotification.nombre_contribuyente}
                      </p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-white mb-1">
                        Apellido
                      </h4>
                      <p className="text-gray-200">
                        {selectedNotification.apellido_contribuyente}
                      </p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-white mb-1">
                        DNI
                      </h4>
                      <p className="text-gray-200">
                        {selectedNotification.dni_contribuyente}
                      </p>
                    </div>
                    <div className="text-center md:col-span-2">
                      <h4 className="text-sm font-medium text-white mb-1">
                        Dirección
                      </h4>
                      <p className="text-gray-200">
                        {selectedNotification.direccion_notificacion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoaderContent>
  );
};

export default Notifications;
