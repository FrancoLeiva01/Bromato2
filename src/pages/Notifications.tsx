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
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderContent } from "@/components/LoaderComponent";
import { apiClient } from "@/services/authService";

interface Notification {
  id: number;
  tipo_infraccion: string;
  nro_notificacion: string;
  detalle_notificacion: string;
  hora?: string;
  fecha_notificacion: string;
  plazo_notificacion: string;
  nombre_inspector: string;
  identificador_inspector: string;
  // ---------
  nombre_contribuyente: string;
  apellido_contribuyente: string;
  dni_contribuyente: string;
  direccion_notificacion: string;
}

interface Inspector {
  id: number;
  nombres: string;
  identificador: string;
  inspector_id: number[];
}

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allInspecto, setAllInpector] = useState<Inspector[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationToEdit, setNotificationToEdit] =
    useState<Notification | null>(null);

  const [inspectors, setInspectors] = useState<Inspector[]>([]);

  const [formData, setFormData] = useState({
    nombre_inspector: "",
    identificador_inspector: "",
    nro_notificacion: "",
    tipo_infraccion: "",
    detalle_notificacion: "",
    fecha_notificacion: "",
    hora: "",
    plazo_notificacion: "",
    // -----------
    nombre_contribuyente: "",
    apellido_contribuyente: "",
    dni_contribuyente: "",
    direccion_notificacion: "",
    inspector_id: [1],
  });

  const [payload, setPayload] = useState({
  "notificacion": {
    "nro_notificacion": "1234",
    "fecha_notificacion": "2025-10-15",
    "hora_notificacion": "22:00:00",
    "detalle_notificacion": "detalle de prueba",
    "plazo_dias": 3,
    "inspector_id": [1],
    "tipo_infraccion": ["CHATARRA"]
  },
  "contribuyente": {
    "apellido": "Pérez",
    "direccion": "San Martín 123",
    "dni": "12345678"
  }
}
);

  const [editFormData, setEditFormData] = useState({
    nro_notificacion: "",
    tipo_infraccion: "",
    detalle_notificacion: "",
    fecha_notificacion: "",
    plazo_notificacion: "",
  });

  const API_URL = "http://localhost:4000/api/v1";

  const getAllInspectorForSelect = async () => {
    const { data } = await apiClient.get(`inspector/all-inspector`);
    setAllInpector(data);
  };
  useEffect(() => {
    getAllInspectorForSelect();
  }, []);

  const TIPOS_INFRACCION = [
    "CHATARRA",
    "RESIDUOS_SOLIDOS",
    "VEHICULOS_ABANDONADOS",
    "CONSTRUCCION_SIN_PERMISO",
    "RUIDOS_MOLESTOS",
    "OTROS",
  ];

  const normalizeNotificationFromBackend = (raw: any): Notification => {
    return {
      id: raw.id,
      tipo_infraccion: raw.tipo_infraccion ?? "",
      nro_notificacion: raw.nro_notificacion ?? raw.notification_number ?? "",
      detalle_notificacion: raw.detalle_notificacion ?? raw.observaciones ?? "",
      hora: raw.hora ?? "",
      fecha_notificacion: raw.fecha_notificacion ?? raw.notification_date ?? "",
      plazo_notificacion: raw.plazo_notificacion ?? raw.expiration_date ?? "",
      nombre_inspector: raw.nombre_inspector ?? "",
      identificador_inspector: raw.identificador_inspector ?? "",
      //-----
      nombre_contribuyente:
        raw.nombre_contribuyente ??
        raw.contribuyente?.nombre_contribuyente ??
        "",
      apellido_contribuyente:
        raw.apellido_contribuyente ??
        raw.contribuyente?.apellido_contribuyente ??
        "",
      dni_contribuyente:
        raw.dni_contribuyente ?? raw.contribuyente?.dni_contribuyente ?? "",
      direccion_notificacion:
        raw.direccion_notificacion ??
        raw.contribuyente?.direccion_notificacion ??
        "",
    };
  };

  // Loader

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getInspectors = async () => {
    try {
      const res = await axios.get(`${API_URL}/inspector`);
      console.log("[v0] Inspectors response:", res.data);
      const payload = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setInspectors(payload);
    } catch (error) {
      console.error("Error al obtener inspectores:", error);
    }
  };

  // GET

  const getNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_URL}/notification?page=${currentPage}`
      );
      console.log("Respuesta del backend:", res.data);

      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.notifications ?? res.data;

      const total = res.data.total ?? payload.length;
      setTotalNotifications(total);

      const normalized = payload.map(normalizeNotificationFromBackend);
      setNotifications(normalized);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
    getInspectors();
  }, [currentPage]);

  // CREATE

  const createNotification = async (newNotification: any) => {
    try {
      const res = await axios.post(`${API_URL}/notificacion`, newNotification);
      const createdRaw = res.data?.data ?? res.data;
      const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;

      const normalized = normalizeNotificationFromBackend(created);
      setNotifications((prev) => [...prev, normalized]);

      await getNotifications(); // Refresca la tabla
      alert("✅ Notificación creada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al crear notificación:", error);
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
    updatedData: Partial<Notification>
  ) => {
    try {
      const payload = {
        nro_notificacion: updatedData.nro_notificacion,
        tipo_infraccion: updatedData.tipo_infraccion,
        detalle_notificacion: updatedData.detalle_notificacion,
        fecha_notificacion: updatedData.fecha_notificacion,
        plazo_notificacion: updatedData.plazo_notificacion,
      };

      console.log(
        "📤 Actualizando notificación ID:",
        id,
        "con payload:",
        payload
      );
      const res = await axios.patch(`${API_URL}/notification/${id}`, payload);
      console.log("✅ Notificación actualizada:", res.data);

      await getNotifications();
      alert("✅ Notificación actualizada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar notificación:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      alert(
        `Error al actualizar notificación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // DELETE

  const deleteNotification = async (id: number) => {
    if (!confirm("¿Está seguro de que desea eliminar esta notificación?")) {
      return;
    }

    try {
      console.log("🗑️ Eliminando notificación:", id);
      await axios.get(`${API_URL}/notification/delete/${id}`);
      console.log("✅ Notificación eliminada");

      // Traerlas denuevo despues de "borrar"

      await getNotifications();
      alert("✅ Notificación eliminada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al eliminar notificación:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      alert(
        `Error al eliminar notificación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        if (!filterType || !searchTerm) return true;

        switch (filterType) {
          case "Fecha":
            return (
              notification.fecha_notificacion.includes(searchTerm) ||
              notification.plazo_notificacion.includes(searchTerm)
            );
          case "Numero de Notificacion":
            return notification.nro_notificacion
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "Tipo":
            return notification.tipo_infraccion
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          default:
            return true;
        }
      })
    : [];

  const totalPages = Math.max(1, Math.ceil(totalNotifications / itemsPerPage));
  const currentNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      nombre_inspector: "",
      identificador_inspector: "",
      nro_notificacion: "",
      tipo_infraccion: "",
      detalle_notificacion: "",
      fecha_notificacion: "",
      hora: "",
      plazo_notificacion: "",
      nombre_contribuyente: "",
      apellido_contribuyente: "",
      dni_contribuyente: "",
      direccion_notificacion: "",
      inspector_id: [1],
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPayload = {
      notificacion: {
        nro_notificacion: "1234",
        fecha_notificacion: "2025-10-15",
        hora_notificacion: "22:00:00",
        detalle_notificacion: "detalle de prueba",
        plazo_notificacion: "3",
        inspector_id: [1],
        tipo_infraccion: ["CHATARRA"],
      },
      contribuyente: {
        nombre: "Juan Perez",
        domicilio: "San Martín 123",
      },
    };

    console.log("📤 Enviando payload corregido:", newPayload);

    try {
      await createNotification(newPayload);
      alert("✅ Notificación creada exitosamente");
      handleCloseForm();
    } catch (error: any) {
      console.error("❌ Error al crear notificación:", error);
      alert(
        `Error al crear notificación: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleEditClick = (notification: Notification) => {
    setNotificationToEdit(notification);
    setEditFormData({
      nro_notificacion: notification.nro_notificacion,
      tipo_infraccion: notification.tipo_infraccion,
      detalle_notificacion: notification.detalle_notificacion,
      fecha_notificacion: notification.fecha_notificacion,
      plazo_notificacion: notification.plazo_notificacion,
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
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Notificaciones..."
      minHeight="400px"
    >
      <div className=" bg-slate-700 max-w-full mx-auto p-6">
        <div className="bg-gray-100 rounded-lg border border-gray-200 shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600 ">
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

          <div className="p-6">
            {currentNotifications.slice(0, 3).length > 0 ? (
              <div className="space-y-3">
                {currentNotifications.slice(0, 3).map((notification) => (
                  <div
                    key={`preview-${notification.id}`}
                    className="flex items-start space-x-4 p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <Bell className="w-5 h-5 text-orange-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.tipo_infraccion}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {notification.plazo_notificacion}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {notification.detalle_notificacion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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

        <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-100 mt-4">
          <div className=" bg-gray-100 p-6 rounded-lg ">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 pb-5">
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-black">
                    Lista de Notificaciones
                  </h1>
                </div>

                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-300">
                {" "}
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
                {" "}
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
                        {notification.tipo_infraccion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.fecha_notificacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.plazo_notificacion}
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
                            onClick={() => deleteNotification(notification.id)}
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

          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-center">
            {" "}
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

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                  <label className="font-semibold text-white mt-4 mb-2">
                    Selecciona Inspector
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allInspecto.length &&
                      allInspecto.map((insp) => (
                        <div className="flex items-center">
                          <input
                            id="link-checkbox"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="link-checkbox"
                            className="ms-2 text-sm font-medium text-white dark:text-gray-300"
                          >
                            {insp.nombres}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="N° Notificación"
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
                    Tipo de Infracción:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "MATA FUEGO",
                      "OEP ÁRIDOS MATERIALES DE CONSTRUCCIÓN",
                      "VEHÍCULOS EN ESTADO DE ABANDONO",
                      "CHATARRA",
                      "CHASIS",
                      "ESQUELETOS VEHÍCULOS",
                      "OTROS",
                      "LAVADO DE VEREDA",
                      "PÉRDIDA DE AGUA/LÍQUIDOS CLOACALES",
                      "REPARACION DE VEREDA",
                      "HABILITACIÓN COMERCIAL DEFINITIVA",
                    ].map((TIPOS_INFRACCION) => (
                      <label
                        key={TIPOS_INFRACCION}
                        className="flex items-center space-x-2"
                      >
                        <input type="checkbox" className="accent-blue-600" />
                        <span className="text-white text-sm">
                          {TIPOS_INFRACCION}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <textarea
                  maxLength={600}
                  placeholder="Observaciones..."
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

                  <input
                    type="time"
                    placeholder="Hora"
                    value={formData.hora}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hora: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />

                  <input
                    type="date"
                    placeholder="Plazo Notificación"
                    value={formData.plazo_notificacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plazo_notificacion: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="border-t border-gray-400 pt-4 mt-4">
                  <h3 className="text-white font-semibold mb-3">
                    Datos del Contribuyente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre"
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
                      placeholder="Apellido"
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
                      placeholder="DNI"
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
                      placeholder="Dirección"
                      value={formData.direccion_notificacion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          direccion_notificacion: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
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
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Tipo de Infracción"
                    value={editFormData.tipo_infraccion}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        tipo_infraccion: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={editFormData.fecha_notificacion}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        fecha_notificacion: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="date"
                    placeholder="Plazo Notificación"
                    value={editFormData.plazo_notificacion}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        plazo_notificacion: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
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
          <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                      {selectedNotification.tipo_infraccion}
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
                    <h3 className="text-sm font-medium text-white mb-2">
                      Fecha de Notificación
                    </h3>
                    <p className="text-gray-200">
                      {selectedNotification.fecha_notificacion}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Plazo de Vencimiento
                    </h3>
                    <p className="text-gray-200">
                      {selectedNotification.plazo_notificacion}
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
                        Nombre Completo
                      </h4>
                      <p className="text-gray-200">
                        {selectedNotification.nombre_contribuyente}{" "}
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
