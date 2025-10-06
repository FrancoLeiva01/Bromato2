"use client";

import type React from "react";
import { X } from "lucide-react";

interface ActaData {
  numero: string;
  fecha: string;
  turno: string;
  razonSocial: string;
  fantasia: string;
  cargado: string;
  numeroNotificacion: string;
  denuncia: string;
}

interface InspeccionesDataProps {
  onClose: () => void;
  actaData: ActaData;
}

const InspeccionesData: React.FC<InspeccionesDataProps> = ({
  onClose,
  actaData,
}) => {
  return (
    <div className="fixed inset-0 bg-red-200 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-200 rounded-xl p-6 w-full max-w-[700px] shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Acta de Inspección N° {actaData.numero}
        </h2>

        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-800">Fecha:</p>
            <p className="text-gray-600">{actaData.fecha}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Vía Pública:</p>
            <p className="text-gray-600">-</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Hora:</p>
            <p className="text-gray-600">-</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Turno:</p>
            <p className="text-gray-600">{actaData.turno}</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">
            Manipulador Alimentos
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">
                Cantidad Indumentaria Completa:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Cantidad Indumentaria Incompleta:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Higiene:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Carnet Vigentes:</span> -
            </p>
            <p className="font-semibold text-gray-800 mt-3">Carnts:</p>
            <div className="grid grid-cols-2 gap-4 mt-2 bg-white p-3 rounded">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  Carnet de Manipulador N°
                </p>
                <p className="text-gray-700">-</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  Carnet de Manipulador Vencimiento
                </p>
                <p className="text-gray-700">-</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">
            Resultados Inspeccion
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Notificacion Nro:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Notificacion Plazo:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Notificacion Motivo:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Notificacion Motivo Detalle:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Acta Comprobacion Nro:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Acta Comprobcaion Motivo:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Acta Comprobacion Motivo Detalle:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Destrucciones Detalle:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Observaciones:</span> -
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">Destrucciones</h3>
          <p className="text-gray-600 text-sm">-</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Comercio Dato</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Persona Recibe Nombre:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Persona Recibe Dni:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Persona Recibe Caracter:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Persona Recibe Email:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Persona Recibe Telefono:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Constancia:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Nro Tramite:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Certificado Desinfeccion Nro:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Empresa Desinfeccion:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Expedito:</span> -
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Comercio Entidad</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">
                Habilitacion Comercial Municipal:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Habilitacion Comercial Municipal Nro:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Habilitacion Bromatologica:</span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Habilitacion Bromatologica Nro:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Expte Nro:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Nombre Razon Social:</span>{" "}
              {actaData.razonSocial}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Nombre Fantasia:</span>{" "}
              {actaData.fantasia}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Cuit:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Via Publica:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Puesto Movil:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">
                Permiso Ocupacion Via Publica Vigente:
              </span>{" "}
              -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Barrio:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Calle:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Zona:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Referencia Ubicacion:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">IsActive:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Matricula:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">NroSuministro:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">IsMovil:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Pto Geografico:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Latitud:</span> -
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Longitud:</span> -
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Notificación N° {actaData.numeroNotificacion}
            </h3>
           <button className="text-gray-400 hover:text-blue-500">Agregar +</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspeccionesData;
