import { apiClient } from "@/services/authService";
import {
  InspectorFormData,
  Inspector,
} from "@/modules/Inspectores/types/inspector.types";

// const API_URL = "http://localhost:4000/api/v1";

// const normalizeActivoFromBackend = (value: any): boolean => {
//   if (typeof value === "boolean") return value
//   if (typeof value === "number") return value === 1
//   if (typeof value === "string") return value.toLowerCase() === "true" || value === "1"
//   return false
// }

// const normalizeInspectorFromBackend = (raw: any): Inspector => {
//   return {
//     id: raw.id,
//     nombres: raw.nombres ?? raw.nombre ?? "",
//     apellidos: raw.apellidos ?? raw.apellido ?? "",
//     funcion: raw.funcion ?? "",
//     identificador: raw.identificador ?? "",
//     cuil: raw.cuil ?? "",
//     nro_legajo: raw.nro_legajo ?? raw.legajo ?? "",
//     activo: normalizeActivoFromBackend(raw.activo),
//   }
// }

export const inspectorRepository = {
  findAll: async ({page = 1}: {page:number, size:number, nombres:string, apellido:string}) => {
    const { data } = await apiClient.get(`inspector?${'page='+page}`);
    return data;
  },

  createInspector: async (inspector: InspectorFormData): Promise<Inspector> => {
    //   const payload = {
    //     nombres: data.nombres,
    //     apellidos: data.apellidos,
    //     cuil: data.cuil,
    //     nro_legajo: data.nro_legajo,
    //   }

    const { data } = await apiClient.post(`inspector`, inspector);

    return data;
  },

  updateInspector: async (
    id: number,
    payload: Partial<InspectorFormData>
  ): Promise<void> => {
    const { data } = await apiClient.patch(`/inspector/${id}`, payload);
    return data;
  },

  getInspectores: async (id: number) => {
    const { data } = await apiClient.get(`inspector/${id}`);
    return data;
  },

  deleteInspector: async (id: number): Promise<void> => {
   const { data } = await apiClient.get(`inspector/delete/${id}`);
   return data;
  },
};
