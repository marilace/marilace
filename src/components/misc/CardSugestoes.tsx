import styles from './CardSugestoes.module.css'
import { CardPerfil } from './CardPerfil'
import { useSugestoes } from '../../hooks/useSugestoes'
import { Link } from 'react-router-dom'

export function CardSugestoes(){

    const { sugestoes } = useSugestoes(4)

    return(
        <div className={ styles.container }>
            <h1>Sugestões para seguir</h1>

            <div className={ styles.containerCards }>
                {sugestoes.map((sugestao) => (
                    <CardPerfil
                        key={sugestao.uid}
                        uid={sugestao.uid}
                        avatarSrc={sugestao.photoURL}
                        nome={sugestao.nome ?? ''}
                        username={sugestao.username ?? ''}
                        emblemas={sugestao.emblemas}
                    />
                ))}

            </div>
            <hr className={ styles.linha} />
            <Link 
            to='/forum/seguir'
            className={ styles.btnVerTodos }
            >
                Ver todos
            </Link>
        </div>
    )
}