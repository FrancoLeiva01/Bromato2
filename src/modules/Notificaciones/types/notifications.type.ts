export interface Notification {
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

export interface Inspector {
  id: number;
  nombres: string;
  apellidos: string;
  identificador: string;
}

export enum TIPO_INFRACCION {
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

export interface NotificationFormData {
  nro_notificacion: string;
  tipo_infraccion: string[];
  detalle_notificacion: string;
  fecha_notificacion: string;
  hora_notificacion: string;
  plazo_dias: number;
  inspector_id: number[];
  nombre_contribuyente: string;
  apellido_contribuyente: string;
  dni_contribuyente: string;
  direccion_contribuyente: string;
}

export interface EditNotificationFormData {
  nro_notificacion: string;
  tipo_infraccion: string[];
  detalle_notificacion: string;
  fecha_notificacion: string;
  hora_notificacion: string;
  plazo_dias: number;
}