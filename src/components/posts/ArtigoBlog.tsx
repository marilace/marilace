import { useState } from 'react'
import { TbStar, TbStarFilled, TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import styles from './ArtigoBlog.module.css'
import { useSalvo } from '../../hooks/useSalvos'

interface ArtigoBlogProps {
    id: string
    src: string
    titulo: string
    descricao: string
}

export function ArtigoBlog({ id, src, titulo, descricao }: ArtigoBlogProps) {
    const { salvo, alternarSalvo, salvando } = useSalvo(id, 'artigo')
    const [favorito, setFavorito] = useState(false)
    // só troquei o onClick do botão de salvar pra `alternarSalvo`

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
                    onClick={alternarSalvo}
                    disabled={salvando}
                    aria-label="Salvar"
                >
                    {salvo ? (
                        <TbBookmarkFilled className={ styles.iconSalvo } />
                    ) : (
                        <TbBookmark className={ styles.icon } />
                    )}
                </button>

                <button
                    className={ styles.iconBtn }
                    onClick={() => setFavorito(!favorito)}
                    aria-label="Favoritar"
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
