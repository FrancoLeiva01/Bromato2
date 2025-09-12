"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useState } from "react"

// Esquema de validación con Yup
const LoginSchema = Yup.object().shape({
  username: Yup.string().min(3, "El usuario debe tener al menos 3 caracteres").required("El usuario es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
})

interface LoginValues {
  username: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values: LoginValues, { setSubmitting }: any) => {
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aquí harías la llamada real con Axios
      // const response = await axios.post('/api/login', values)

      // Simulación de login exitoso
      if (values.username === "admin" && values.password === "admin123") {
        toast.success("¡Bienvenido al Sistema de Bromatología!")
        localStorage.setItem("isAuthenticated", "true")
        navigate("/dashboard")
      } else {
        toast.error("Credenciales incorrectas")
      }
    } catch (error) {
      toast.error("Error al iniciar sesión")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Administración de Bromatología</h1>
          <p className="text-gray-600">Catamarca Capital</p>
        </div>

        {/* Formulario con Formik */}
        <Formik initialValues={{ username: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Campo Usuario */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Field
                    type="text"
                    name="username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ingrese su usuario"
                  />
                </div>
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Campo Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ingrese su contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </Form>
          )}
        </Formik>

        {/* Información de prueba */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Credenciales de prueba:</strong>
            <br />
            Usuario: admin | Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
