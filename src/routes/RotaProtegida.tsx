import { Navigate } from 'react-router-dom'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { TelaCarregamento } from '../components/misc/TelaCarregamento'
import { type ReactNode } from 'react'

interface RotaProtegidaProps {
    children: ReactNode
}

export function RotaProtegida({ children }: RotaProtegidaProps) {

    const { usuario, carregando } = useAutenticacao()

    if (carregando) {
        return <TelaCarregamento />
    }

    if (!usuario) {
        return <Navigate to='/' replace />
    }

    return children
}