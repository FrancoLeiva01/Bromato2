
import { useFormik } from "formik"
import * as Yup from "yup"
import type { InspectorFormData } from "../types/inspector.types"

const validationSchema = Yup.object({
  nombres: Yup.string().required("El nombre es requerido").min(2, "Mínimo 2 caracteres"),
  apellidos: Yup.string().required("El apellido es requerido").min(2, "Mínimo 2 caracteres"),
  cuil: Yup.string()
    .required("El CUIL es requerido")
    .matches(/^\d{11}$/, "El CUIL debe tener 11 dígitos"),
  nro_legajo: Yup.string().required("El número de legajo es requerido"),
})

interface UseInspectorFormikProps {
  initialValues?: Partial<InspectorFormData>
  onSubmit: (values: InspectorFormData) => Promise<void>
}

export const useInspectorFormik = ({ initialValues, onSubmit }: UseInspectorFormikProps) => {
  console.log("useInspectorFormik inicializado con:", { initialValues, onSubmit })

  // Valores por defecto del formulario
  const defaultValues: InspectorFormData = {
    nombres: "",
    apellidos: "",
    cuil: "",
    nro_legajo: "",
    ...initialValues,
  }

  console.log("Valores por defecto del formulario:", defaultValues)

  // Configuración de Formik
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit(values)
        resetForm() 
      } catch (error) {
        console.error("[v0] Error en submit:", error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return formik
}
