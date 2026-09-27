import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbStar, TbStarFilled, TbBookmark, TbBookmarkFilled } from "react-icons/tb";
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

    // Quem não está logada pode ler os artigos normalmente, mas salvar e
    // favoritar exigem login. Nesse caso o clique manda direto pra tela de
    // login em vez de fazer alguma alteração.
    const aoClicarSalvar = () => {
        if (!usuario) {
            navigate('/login')
            return
        }
        alternarSalvo()
    }

    const aoClicarFavoritar = () => {
        if (!usuario) {
            navigate('/login')
            return
        }
        setFavorito(!favorito)
    }

    return (
    <div className={ styles.card }>
        <img src={ src } className={ styles.cardImg } />

        <div className={ styles.cardInfo }>
            <div className={ styles.cardTexto }>
                <h1 className={ styles.titulo }>{ titulo }</h1>
                <p className={ styles.descricao }>"{ descricao }"</p>
            </div>

            <div className={ styles.cardIcones }>
                <button
                    className={ styles.iconBtn }
                    onClick={aoClicarSalvar}
                    disabled={salvando}
                    aria-label={ usuario ? "Salvar" : "Faça login para salvar" }
                    title={ usuario ? undefined : "Faça login para salvar" }
                >
                    {salvo ? (
                        <TbBookmarkFilled className={ styles.iconSalvo } />
                    ) : (
                        <TbBookmark className={ styles.icon } />
                    )}
                </button>

                <button
                    className={ styles.iconBtn }
                    onClick={aoClicarFavoritar}
                    aria-label={ usuario ? "Favoritar" : "Faça login para favoritar" }
                    title={ usuario ? undefined : "Faça login para favoritar" }
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