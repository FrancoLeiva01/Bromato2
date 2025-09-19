
import type React from "react"

import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useState } from "react"
import { authService } from "../services/authService"

interface LoginValues {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<LoginValues>({
    email: "",
    password: "",
  })

  const handleSubmit = async (values: LoginValues) => {

    setIsSubmitting(true)
    try {
      const authResponse = await authService.login({
        email: values.email,
        password: values.password,
      })

      localStorage.setItem("userData", JSON.stringify(authResponse.user))
      localStorage.setItem("isAuthenticated", "true")

      toast.success(`¡Bienvenido ${authResponse.user.name || authResponse.user.email}!`)
      navigate("/home")
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    E.
    handleSubmit(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-blue-400 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src="/src/assets/logo-municipalidad.png" alt="Logo Municipalidad" className="h-24 w-24" />
              <div className="text-left">
                <h2 className="font-bold text-3xl text-gray-800">Catamarca</h2>
                <p className="text-xl text-slate-600">Capital</p>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Administración de Bromatología</h1>
          <p className="text-gray-600">Catamarca Capital</p>
        </div>

        <div className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="usuario@ejemplo.com"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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
          </div>

          {/* Botón Submit */}
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="w-full bg-yellow-500 hover:bg-yellow-300 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>

        {/* Información de prueba */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Usa tus credenciales del sistema</strong>
            <br />
            Email y contraseña porporcionados por el administrador
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
