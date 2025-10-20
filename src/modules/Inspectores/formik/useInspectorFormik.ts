import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "react-toastify";

interface initialValues {
  nombres: string;
  apellidos: string;
  cuil: string;
  nro_legajo:string;
}
const useInspecttorFormik = () => {
  return useFormik<initialValues>({
    initialValues: {
      nombres: "",
      apellidos: "",
      cuil:"",
      nro_legajo:""
    },
    validationSchema: Yup.object({
      nombres: Yup.string().required(),
      apellidos: Yup.string().required(),
      cuil: Yup.string().required(),
      nro_legajo: Yup.string().required(),
  
    }),
    onSubmit: async (
      values: initialValues,
      formikHelpers: FormikHelpers<initialValues>
    ) => {
      formikHelpers.setSubmitting(true);
      try {
      } catch (error) {
        console.error("Error al iniciar sesión");
        toast.error(
          `Error al iniciar sesión, compruebe los datos ingresados ${
            (error as Error)?.message ? (error as Error).message : ""
          }`
        );
      }

      formikHelpers.setSubmitting(false);
    },
  });
};

export { useInspecttorFormik };
