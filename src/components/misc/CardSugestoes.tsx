import styles from './CardSugestoes.module.css'
import { CardPerfil } from './CardPerfil'
import { useSugestoes } from '../../hooks/useSugestoes'

export function CardSugestoes(){

    const { sugestoes } = useSugestoes(4)

    return(
        <div className={ styles.container }>
            <h1>Sugestões para seguir</h1>

            <div className={ styles.containerCards }>
                {sugestoes.map((sugestao) => (
                    <CardPerfil
                        key={sugestao.uid}
                        nome={sugestao.nome ?? ''}
                        username={sugestao.username ?? ''}
                        emblemas={sugestao.emblemas}
                    />
                ))}

            </div>
            <hr className={ styles.linha} />
            <button className={ styles.btnVerTodos }>Ver todos</button>
        </div>
    )
}