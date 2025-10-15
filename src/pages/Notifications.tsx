"use client";

import type React from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
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

interface Notification {
  id: number;
  tipo_infraccion: string;
  notificacion_nro: string;
  detalle_notificacion: string; // Observaciones
  hora?: string;
  fecha_notificacion: string;
  plazo_notificacion: string;
  nombre_inspector: string;
  identificador_inspector: string;
  // -------Contribuyente--------
  nombre_contribuyente: string;
  apellido_contribuyente: string;
  direccion_notificacion: string;
  dni_contribuyente: string;
}

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode] = useState<"cards" | "table">("cards");
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = viewMode === "cards" ? 3 : 8;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationToEdit, setNotificationToEdit] =
    useState<Notification | null>(null);

  const [formData, setFormData] = useState({
    nombre_inspector: "",
    identificador_inspector: "",
    notificacion_nro: "",
    tipo_infraccion: "",
    detalle_notificacion: "",
    fecha_notificacion: "",
    hora: "",
    plazo_notificacion: "",
    nombre_contribuyente:"",
    apellido_contribuyente:"",
    direccion_notificacion:"",
    dni_contribuyente:"",
  });

  const [editFormData, setEditFormData] = useState({
    notificacion_nro: "",
    tipo_infraccion: "",
    detalle_notificacion: "",
    fecha_notificacion: "",
  });

  const API_URL = "http://localhost:4000/api/v1";

  const normalizeNotificationFromBackend = (raw: any): Notification => {
    return {
      id: raw.id,
      tipo_infraccion: raw.tipo_infraccion ?? "",
      notificacion_nro: raw.notificacion_nro ?? raw.notification_number ?? "",
      detalle_notificacion: raw.detalle_notificacion ?? raw.observaciones ?? "",
      hora: raw.hora ?? "",
      fecha_notificacion: raw.fecha_notificacion ?? raw.notification_date ?? "",
      plazo_notificacion: raw.plazo_notificacion ?? raw.expiration_date ?? "",
      nombre_inspector: raw.nombre_inspector ?? raw.nombre_inspector ?? "",
      identificador_inspector:
        raw.identificador_inspector ?? raw.identificador_inspector ?? "",
      nombre_contribuyente:
        raw.nombre_contribuyente ?? raw.nombre_contribuyente ?? "",
      apellido_contribuyente:
        raw.apellido_contribuyente ?? raw.apellido_contribuyente ?? "",
      dni_contribuyente: raw.dni_contribuyente,
      direccion_notificacion:
        raw.direccion_notificacion ?? raw.direccion_notificacion ?? "",
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
  }, [currentPage]);

  // CREATE

  const createNotification = async (newNotification: typeof formData) => {
    try {
      const payload = {
        // De la notificacion
        notificacion_nro: newNotification.notificacion_nro,
        tipo_infraccion: newNotification.tipo_infraccion,
        detalle_notificacion: newNotification.detalle_notificacion,
        fecha_notificacion: newNotification.fecha_notificacion,
        nombre_inspector: newNotification.nombre_inspector,
        identificador_inspector: newNotification.identificador_inspector,
        hora: newNotification.hora,
        plazo_notificacion: newNotification.plazo_notificacion,
        // Del contribuyente
        nombre_contribuyente: newNotification.nombre_contribuyente,
        apellido_contribuyente: newNotification.apellido_contribuyente,
        direccion_notificacion: newNotification.direccion_notificacion,
        dni_contribuyente: newNotification.dni_contribuyente,
      };

      const res = await axios.post(`${API_URL}/notificacion`, payload);
      const createdRaw = res.data?.data ?? res.data;
      const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;

      const normalized = normalizeNotificationFromBackend(created);
      setNotifications((prev) => [...prev, normalized]);

      await getNotifications();
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
        notificacion_nro: updatedData.notificacion_nro,
        tipo_infraccion: updatedData.tipo_infraccion,
        detalle_notificacion: updatedData.detalle_notificacion,
        fecha_notificacion: updatedData.fecha_notificacion,
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

  const maxPages = 5;

  const filteredNotifications = notifications.filter((notification) => {
    if (!filterType || !searchTerm) return true;

    switch (filterType) {
      case "Fecha":
        return (
          notification.fecha_notificacion.includes(searchTerm) ||
          notification.plazo_notificacion.includes(searchTerm)
        );
      case "Numero de Notificacion":
        return notification.notificacion_nro
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      default:
        return true;
    }
  });

  const totalPages = Math.max(
    1,
    Math.min(Math.ceil(filteredNotifications.length / itemsPerPage), maxPages)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex
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
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleNuevaNotificacion = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      identificador_inspector: "",
      nombre_inspector: "",
      notificacion_nro: "",
      tipo_infraccion: "",
      detalle_notificacion: "",
      fecha_notificacion: "",
      hora: "",
      plazo_notificacion: "",
        nombre_contribuyente:"",
    apellido_contribuyente:"",
    direccion_notificacion:"",
    dni_contribuyente:"",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNotification(formData);
    handleCloseForm();
  };

  const handleEditClick = (notification: Notification) => {
    setNotificationToEdit(notification);
    setEditFormData({
      notificacion_nro: notification.notificacion_nro,
      tipo_infraccion: notification.tipo_infraccion,
      detalle_notificacion: notification.detalle_notificacion,
      fecha_notificacion: notification.fecha_notificacion,
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

          {viewMode === "cards" ? (
            <div className="divide-y divide-gray-500">
              {currentNotifications.map((notification) => (
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.tipo_infraccion}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-800">
                      {notification.detalle_notificacion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de notificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha notificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado notificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menú de Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.notificacion_nro}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.plazo_notificacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.fecha_notificacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-blue-900 hover:text-blue-700"
                          onClick={() => handleViewDetails(notification)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === 1
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-900 text-white hover:bg-blue-800"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </button>

                  <span className="text-sm text-gray-600 font-medium">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-900 text-white hover:bg-blue-800"
                    }`}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentNotifications.length === 0 && (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-500">
                Cuando tengas nuevas notificaciones aparecerán aquí.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-100 mt-4">
          <div className=" bg-gray-100 p-6 rounded-lg ">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-black">
                    Lista de Notificaciones
                  </h1>
                </div>

                <select
                  className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-gray-600"
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="">Filtros</option>
                  <option value="Fecha">Fecha</option>
                  <option value="Numero de Notificacion">
                    Numero de Notificacion
                  </option>
                </select>

                {filterType && (
                  <input
                    type="text"
                    placeholder={`Buscar por ${filterType.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
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
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número de notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-100 divide-y divide-gray-100">
                {filteredNotifications.slice(0, 8).map((notification) => (
                  <tr
                    key={`table-${notification.id}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.notificacion_nro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.plazo_notificacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.fecha_notificacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-900 hover:text-blue-700"
                          onClick={() => handleViewDetails(notification)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          onClick={() => handleEditClick(notification)}
                          title="Editar notificación"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors"
                          onClick={() => deleteNotification(notification.id)}
                          title="Eliminar notificación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    Nueva Notificacion
                  </h2>
                </div>

                <br />
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre Inspector"
                      value={formData.notificacion_nro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notificacion_nro: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="Identificador"
                      value={formData.identificador_inspector}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          identificador_inspector: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="N° Notificación"
                      value={formData.notificacion_nro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notificacion_nro: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="Otro Tipo de Infraccion ()*"
                      value={formData.tipo_infraccion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipo_infraccion: e.target.value,
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
                        "Matafuego",
                        "OEP Áridos materiales de construcción",
                        "Vehículos en estado de abandono",
                        "Chatarras/chasis/esqueletos vehículos",
                        "Lavado de vereda",
                        "Pérdida de agua/líquidos cloacales",
                        "Reparación vereda",
                        "Habilitación comercial definitiva",
                      ].map((tipo) => (
                        <label
                          key={tipo}
                          className="flex items-center space-x-2"
                        >
                          <input type="checkbox" className="accent-blue-600" />
                          <span className="text-white text-sm">{tipo}</span>
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
                    className="border p-2 rounded w-full h-24 resize-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Nombre Contribuyente"
                    value={formData.notificacion_nro} // Cambiar
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificacion_nro: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Apellido Contribuyente"
                    value={formData.notificacion_nro} // Cambiar
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificacion_nro: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="D.N.I"
                    value={formData.identificador_inspector}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identificador_inspector: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Direccion"
                    value={formData.identificador_inspector} // Ver como colocar mapita
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identificador_inspector: e.target.value,
                      })
                    }
                    required
                    className="border p-2 rounded w-full"
                  />

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
                      value={editFormData.notificacion_nro}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          notificacion_nro: e.target.value,
                        })
                      }
                      required
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      placeholder="tipo_infraccion"
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
              <div className="bg-slate-600 rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Notificación
                    </h3>
                    <h2 className="text-2xl font-bold text-gray-200">
                      {selectedNotification.notificacion_nro}
                    </h2>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-2">
                      tipo_infraccion
                    </h3>
                    <p className="text-4xl font-bold text-orange-500">
                      {selectedNotification.tipo_infraccion}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white mb-2">
                      Observaciones
                    </h3>
                    <p className="text-gray-200">
                      {selectedNotification.detalle_notificacion}
                    </p>
                  </div>
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
                      Estado
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Página {currentPage} de{" "}
                {Math.ceil(totalNotifications / itemsPerPage)}
              </button>
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage >= Math.ceil(totalNotifications / itemsPerPage)
                }
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage >= Math.ceil(totalNotifications / itemsPerPage)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-900 text-white hover:bg-blue-800"
                }`}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoaderContent>
  );
};

export default Notifications;
