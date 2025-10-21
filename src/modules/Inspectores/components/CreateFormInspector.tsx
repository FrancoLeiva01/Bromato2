"use client";

import { useInspectorFormik } from "../formik/useInspectorFormik.ts";
// import { X } from "lucide-react";
import type { Inspector, InspectorFormData } from "../types/inspector.types.ts";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";

interface CreateFormInspectorProps {
  onSubmit: (values: InspectorFormData) => Promise<void>;
  onClose: () => void;
  inspector?: Inspector | null;
  isEditing?: boolean;
}

export const CreateFormInspector = ({
  onSubmit,
  onClose,
  inspector,
  isEditing = false,
}: CreateFormInspectorProps) => {
  const {
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    isSubmitting,
  } = (useInspectorFormik as any)({
    initialValues: inspector
      ? {
          nombres: inspector.nombres,
          apellidos: inspector.apellidos,
          cuil: inspector.cuil,
          nro_legajo: inspector.nro_legajo,
        }
      : {},
    onSubmit,
  });

  return (
    <Modal className="rounded-lg " show={true} onClose={onClose}>
      <ModalHeader className="bg-blue-500">
        {isEditing ? "Editar Inspector" : "Crear Inspector"}
      </ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ------------------- Nombre ------------------- */}
          <div>
            <label
              htmlFor="nombres"
              className="block text-sm font-medium text-black"
            >
              Nombre *
            </label>
            <input
              id="nombres"
              name="nombres"
              type="text"
              value={values.nombres}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingrese nombres"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            />
            {touched.nombres && errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
          </div>

          {/* ------------------- Apellido ------------------- */}
          <div>
            <label
              htmlFor="apellidos"
              className="block text-sm font-medium text-black"
            >
              Apellido *
            </label>
            <input
              id="apellidos"
              name="apellidos"
              type="text"
              value={values.apellidos}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingrese apellidos"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            />
            {touched.apellidos && errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
          </div>

          {/* ------------------- CUIL ------------------- */}
          <div>
            <label
              htmlFor="cuil"
              className="block text-sm font-medium text-black"
            >
              CUIL *
            </label>
            <input
              id="cuil"
              name="cuil"
              type="text"
              value={values.cuil}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="20123456789"
              maxLength={11}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            />
            {touched.cuil && errors.cuil && (
              <p className="text-red-500 text-sm mt-1">{errors.cuil}</p>
            )}
          </div>

          {/* ------------------- Número de legajo ------------------- */}
          <div>
            <label
              htmlFor="nro_legajo"
              className="block text-sm font-medium text-black"
            >
              Número de Legajo *
            </label>
            <input
              id="nro_legajo"
              name="nro_legajo"
              type="text"
              value={values.nro_legajo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingrese número de legajo"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-400"
            />
            {touched.nro_legajo && errors.nro_legajo && (
              <p className="text-red-500 text-sm mt-1">{errors.nro_legajo}</p>
            )}
          </div>
        </form>
      </ModalBody>

      <ModalFooter className="flex justify-end gap-2">
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
       <Button
  type="submit"
  onClick={handleSubmit}
  disabled={isSubmitting}
>
  {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear +"}
</Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateFormInspector;
