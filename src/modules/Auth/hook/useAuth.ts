import {useMutation } from '@tanstack/react-query'
import { authRepository } from '../repository/authRepository'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn: authRepository.login,
        onSuccess: () => {
            navigate('/home')
            localStorage.setItem('isAuthenticated', "true")
            toast.success('Bienvenido al sistema de Bromatologia Municipal')
        },
        onError: () => {
            toast.error('Error al ingresar al Sistema')
        }
    })
    return { loginMutation }
}