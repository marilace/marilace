import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbStar, TbStarFilled, TbBookmark, TbBookmarkFilled } from 'react-icons/tb'
import styles from './ArtigoBlog.module.css'
import { useSalvo } from '../../hooks/useSalvos'
import { useAutenticacao } from '../../hooks/useAutenticacao'

interface ArtigoBlogProps {
    id: string
    src: string
    titulo: string
    descricao: string
}

export function ArtigoBlog({ id, src, titulo, descricao }: ArtigoBlogProps) {
    const { usuario } = useAutenticacao()
    const navigate = useNavigate()
    const { salvo, alternarSalvo, salvando } = useSalvo(id, 'artigo')
    const [favorito, setFavorito] = useState(false)

    const abrirArtigo = () => navigate(`/blog/${id}`)

    const aoClicarSalvar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (!usuario) {
            navigate('/login')
            return
        }
        alternarSalvo()
    }

    const aoClicarFavoritar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (!usuario) {
            navigate('/login')
            return
        }
        setFavorito(!favorito)
    }

    const aoPressionarCard = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            abrirArtigo()
        }
    }

    return (
        <div
            className={styles.card}
            onClick={abrirArtigo}
            onKeyDown={aoPressionarCard}
            role="link"
            tabIndex={0}
            aria-label={`Ler artigo: ${titulo}`}
        >
            <img src={src} className={styles.cardImg} alt={`Capa do artigo: ${titulo}`} />

            <div className={styles.cardInfo}>
                <div className={styles.cardTexto}>
                    <h2 className={styles.titulo}>{titulo}</h2>
                    <p className={styles.descricao}>{descricao}</p>
                </div>

                <div className={styles.cardIcones}>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={aoClicarSalvar}
                        disabled={salvando}
                        aria-label={usuario ? 'Salvar artigo' : 'Faça login para salvar'}
                        title={usuario ? undefined : 'Faça login para salvar'}
                    >
                        {salvo ? (
                            <TbBookmarkFilled className={styles.iconSalvo} />
                        ) : (
                            <TbBookmark className={styles.icon} />
                        )}
                    </button>

                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={aoClicarFavoritar}
                        aria-label={usuario ? 'Favoritar artigo' : 'Faça login para favoritar'}
                        title={usuario ? undefined : 'Faça login para favoritar'}
                    >
                        {favorito ? (
                            <TbStarFilled className={styles.iconFavorito} />
                        ) : (
                            <TbStar className={styles.icon} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
