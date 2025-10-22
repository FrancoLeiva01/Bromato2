import { apiClient } from "@/services/authService";
import { useEffect } from "react";
import type {
  Notification,
  NotificationFormData,
  Inspector,
} from "../types/notifications.type";

const normalizeNotificationFromBackend = (raw: any): Notification => {
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

export const notificationRepository = {
  getNotifications: async (page = 1) => {
    const { data } = await apiClient.get(`notificacion?page=${page}`);

    const payload = Array.isArray(data)
      ? data
      : data?.data ?? data?.notifications ?? data;
    const payloadArray = Array.isArray(payload)
      ? payload
      : payload?.data ?? payload?.notifications ?? [];
    const total =
      typeof data?.total === "number" ? data.total : payloadArray.length;

    const normalized = payloadArray.map(normalizeNotificationFromBackend);
    return { notifications: normalized, total };
  },

  createNotification: async (
    inspector: NotificationFormData
  ): Promise<Notification> => {
    const { data } = await apiClient.post(`notificacion`, inspector);
    const createdRaw = data?.data ?? data;
    const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;
    return normalizeNotificationFromBackend(created);
  },

  // GET INSPECTORES
  //   getAllInspectorForSelect: async (inspector: Inspector): Promise<Inspector> => {
  //     const { data } = await apiClient.get(`inspector/all-inspector`);
  //     setAllInspector(data);

  //      useEffect(() => {
  //     getAllInspectorForSelect();
  //   }, []);

  //   },

  updateNotification: async (
    id: number,
    payload: Partial<NotificationFormData>
  ): Promise<void> => {
    await apiClient.patch(`notificacion/${id}`, payload);
  },

  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.get(`notificacion/delete/${id}`);
  },
};
