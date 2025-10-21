import { apiClient } from "@/services/authService"
import type { Inspector, InspectorFormData } from "@/modules/Inspectores/types/inspector.types"

// ✅ Mantén la normalización (es importante para manejar inconsistencias del backend)
const normalizeActivoFromBackend = (value: any): boolean => {
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value === 1
  if (typeof value === "string") return value.toLowerCase() === "true" || value === "1"
  return false
}

const normalizeInspectorFromBackend = (raw: any): Inspector => {
  return {
    id: raw.id,
    nombres: raw.nombres ?? raw.nombre ?? "",
    apellidos: raw.apellidos ?? raw.apellido ?? "",
    funcion: raw.funcion ?? "",
    identificador: raw.identificador ?? "",
    cuil: raw.cuil ?? "",
    nro_legajo: raw.nro_legajo ?? raw.legajo ?? "",
    activo: normalizeActivoFromBackend(raw.activo),
  }
}

// ✅ Usa apiClient (mejor para auth) + normalización
export const inspectorRepository = {
  getInspectores: async (page = 1) => {
    const { data } = await apiClient.get(`inspector?page=${page}`)
    
    const payload = Array.isArray(data) ? data : (data?.data ?? data?.inspectores ?? data)
    const payloadArray = Array.isArray(payload) ? payload : (payload?.data ?? payload?.inspectores ?? [])
    const total = typeof data?.total === "number" ? data.total : payloadArray.length
    
    const normalized = payloadArray.map(normalizeInspectorFromBackend)
    return { inspectores: normalized, total }
  },

  createInspector: async (inspector: InspectorFormData): Promise<Inspector> => {
    const { data } = await apiClient.post(`inspector`, inspector)
    const createdRaw = data?.data ?? data
    const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw
    return normalizeInspectorFromBackend(created)
  },

  updateInspector: async (id: number, payload: Partial<InspectorFormData>): Promise<void> => {
    await apiClient.patch(`inspector/${id}`, payload)
  },

  deleteInspector : async (id: number): Promise<void> => {
    await apiClient.get(`inspector/delete/${id}`)
  },

  toggleInspectorActivo: async (id: number, currentActivo: boolean): Promise<void> => {
    await apiClient.patch(`inspector/${id}`, { activo: String(!currentActivo) })
  }
}