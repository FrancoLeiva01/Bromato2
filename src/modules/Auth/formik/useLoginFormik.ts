import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "react-toastify";
import { useAuth } from "../hook/useAuth";
import { LoginCredentials } from "@/services/authService";

const useLoginFormik = () => {
  const { loginMutation } = useAuth()
  return useFormik<LoginCredentials>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    }),
    onSubmit: async (
      values: LoginCredentials,
      formikHelpers: FormikHelpers<LoginCredentials>,
    ) => {
      formikHelpers.setSubmitting(true);
      try {
        await loginMutation.mutateAsync(values);
      } catch (error) {
        console.error("Error al iniciar sesión");
        toast.error(
          `Error al iniciar sesión, compruebe los datos ingresados ${
            (error as Error)?.message ? (error as Error).message : ""
          }`,
        );
      }

      formikHelpers.setSubmitting(false);
    },
  });
};

export { useLoginFormik };