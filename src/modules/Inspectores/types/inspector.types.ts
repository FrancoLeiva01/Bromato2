export interface Inspector {
  id: number
  nombres: string
  apellidos: string
  activo: boolean
  funcion?: string
  identificador?: string
  cuil?: string
  nro_legajo?: string
}

export interface InspectorFormData {
  nombres: string
  apellidos: string
  cuil: string
  nro_legajo: string
}

export interface InspectorApiResponse {
  data?: Inspector[]
  inspectores?: Inspector[]
  total?: number
}
