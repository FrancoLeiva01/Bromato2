"use client";

import type React from "react";
import { X } from "lucide-react";

interface ActaData {
  id: number;
  numero: string;
  denuncia: string;
  fecha: string;
  turno: string;
  cargado: string;
  numeroNotificacion: string;
  razonSocial: string;
  fantasia: string;
}

interface InspeccionesDataProps {
  actaData: ActaData;
  onClose: () => void;
}

const InspeccionesData: React.FC<InspeccionesDataProps> = ({
  actaData,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Detalles del Acta de Inspección
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-500">
                Número de Acta
              </p>
              <p className="text-base font-medium">{actaData.numero}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-500">Denuncia</p>
              <p className="text-base font-medium">{actaData.denuncia}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-500">Fecha</p>
              <p className="text-base font-medium">{actaData.fecha}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-500">Turno</p>
              <p className="text-base font-medium">{actaData.turno}</p>
            </div>
          </div>

          {/* Información del Comercio */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">
              Información del Comercio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">
                  Razón Social
                </p>
                <p className="text-base font-medium">{actaData.razonSocial}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">
                  Nombre de Fantasía
                </p>
                <p className="text-base font-medium">{actaData.fantasia}</p>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">
                  Estado de Carga
                </p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    actaData.cargado === "Completada"
                      ? "bg-green-100 text-green-800"
                      : actaData.cargado === "En proceso"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {actaData.cargado}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-500">
                  Estado de Notificación
                </p>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    actaData.numeroNotificacion === "Aprobada"
                      ? "bg-green-100 text-green-800"
                      : actaData.numeroNotificacion === "Observaciones"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {actaData.numeroNotificacion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspeccionesData;
