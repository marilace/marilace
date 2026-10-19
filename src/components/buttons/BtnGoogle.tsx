
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbBrandGoogle } from "react-icons/tb";
import { useAutenticacao } from '../../hooks/useAutenticacao'
import styles from './BtnGoogle.module.css'

export function BtnGoogle() {
    const navigate = useNavigate()
    const { autenticarComGoogle } = useAutenticacao()
    const [carregando, setCarregando] = useState(false)

    const entrarComGoogle = async () => {
        setCarregando(true)

        try {
            const resultado = await autenticarComGoogle()

            if (resultado === 'Sucesso!') {
                navigate('/forum')
            } else {
                console.error(resultado)
            }
        } finally {
            setCarregando(false)
        }
    }

    return (
        <button
            className={styles.btnGoogle}
            onClick={entrarComGoogle}
            disabled={carregando}
            type="button"
        >
            <TbBrandGoogle size={20} />
            <span>
                {carregando ? 'Conectando...' : 'Continuar com Google'}
            </span>
        </button>
    )
}
