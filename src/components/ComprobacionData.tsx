"use client";

import type React from "react";
import { X } from "lucide-react";

interface ComprobacionDataProps {
  isOpen: boolean;
  onClose: () => void;
  acta: {
    numero: string;
    creado: string;
    propietarios: string;
    nJuzgado: string;
    nombreFantasia: string;
    razonSocial: string;
  } | null;
}

const ComprobacionData: React.FC<ComprobacionDataProps> = ({
  isOpen,
  onClose,
  acta,
}) => {
  if (!isOpen || !acta) return null;

  return (
    <div className="fixed inset-0 bg-green-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-700 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-800">
                Acta Comprobación N° {acta.numero}
              </h2>
              <p className="text-sm text-black">
                Fecha de creación: {acta.creado}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4 space-y-4">
          {/* Razón Social y CUIT */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-center font-semibold text-gray-700 mb-2">
              Razón Social y CUIT
            </h3>
            <p className="text-center text-blue-700 font-medium">
              {acta.razonSocial}
            </p>
            <p className="text-center text-gray-800 font-medium">{"-"}</p>
          </div>

          {/* Nombre del propietario y CUIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-center font-semibold text-gray-700 mb-2">
                Nombre del propietario
              </h3>
              <p className="text-center text-gray-800">{acta.propietarios}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-center font-semibold text-gray-700 mb-2">
                CUIL Propietario
              </h3>
              <p className="text-center text-gray-800">{"-"}</p>
            </div>
          </div>

          {/* Procedimiento realizado */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-center font-semibold text-gray-700 mb-2">
              Procedimiento realizado
            </h3>
            <p className="text-center text-blue-700 font-medium">
              ACTA DE COMPROBACION
            </p>
          </div>

          {/* Detalle del procedimiento */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-center font-semibold text-gray-700 mb-2">
              Detalle del procedimiento
            </h3>
            <p className="text-center text-blue-700 font-medium">
              POR INCUMPLIMIENTO DE NOTIFICACIÓN
            </p>
          </div>

          {/* Zona de fajado y Días hábiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-center font-semibold text-gray-700 mb-2">
                Zona de fajado
              </h3>
              <p className="text-center text-gray-800">{"-"}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-center font-semibold text-gray-700 mb-2">
                Días hábiles para descargo
              </h3>
              <p className="text-center text-gray-800">3</p>
            </div>
          </div>

          {/* Notificaciones Incumplidas */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-center font-semibold text-gray-700 mb-2">
              Notificaciones Incumplidas
            </h3>
            <p className="text-center text-gray-800">
              N° <span className="text-blue-600">0899</span> - Fecha:{" "}
              <span className="text-blue-600">16 de noviembre de 2024</span>
            </p>
          </div>

          {/* Inspectores */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-center font-semibold text-gray-700 mb-3">
              Inspector/es
            </h3>
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-blue-700 font-medium">BRANDAN TAMARA</p>
                <p className="text-gray-800 font-medium">42188882</p>
              </div>
              <div className="text-center">
                <p className="text-blue-700 font-medium">CATIVA MALVINA</p>
                <p className="text-gray-800 font-medium">30033240</p>
              </div>
              <div className="text-center">
                <p className="text-blue-700 font-medium">ROJAS MARIANA</p>
                <p className="text-gray-800 font-medium">33049336</p>
              </div>
            </div>
          </div>

          {/* DATOS DEL COMERCIO */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                DATOS DEL COMERCIO:
              </h3>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                Ver históricos
              </button>{" "}
              {/* sabra Dios como metemos el historial de notificaciones aca */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Entidad */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-gray-800 text-center mb-3">
                  Entidad
                </h4>
                <div>
                  <p className="text-sm text-gray-600">Nombre de fantasía:</p>
                  <p className="font-medium text-gray-800">
                    {acta.nombreFantasia}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Nombre o razon Social:
                  </p>
                  <p className="font-medium text-gray-800">
                    {acta.razonSocial}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CUIT:</p>
                  <p className="font-medium text-gray-800">{"-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Activo:</p>
                  <p className="font-medium text-gray-800">SI</p>
                </div>
              </div>

              {/* Ubicacion (ver si despues va el mapa aqui) */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-gray-800 text-center mb-3">
                  Ubicacion
                </h4>
                <div>
                  <p className="text-sm text-gray-600">Zona:</p>
                  <p className="font-medium text-gray-800">OESTE</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Barrio:</p>
                  <p className="font-medium text-gray-800">{"-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Calle:</p>
                  <p className="font-medium text-gray-800">
                    AV BARTOLOME DE CASTRO
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matricula:</p>
                  <p className="font-medium text-gray-800">{"-"}</p>
                </div>
              </div>

              {/* Habilitaciones */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-gray-800 text-center mb-3">
                  Habilitaciones
                </h4>
                <div>
                  <p className="text-sm text-gray-600">Hab. Bromatologica:</p>
                  <p className="font-medium text-gray-800">NO</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">N°:</p>
                  <p className="font-medium text-gray-800">----</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Hab. Comercial Municipal:
                  </p>
                  <p className="font-medium text-gray-800">NO</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">N°:</p>
                  <p className="font-medium text-gray-800">----</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">N° de Expediente:</p>
                  <p className="font-medium text-gray-800">----</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprobacionData;
