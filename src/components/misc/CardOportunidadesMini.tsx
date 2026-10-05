import styles from './CardOportunidadesMini.module.css'
import cardStyles from './CardSugestoes.module.css'
import { Link } from 'react-router-dom'
import { TbClock } from 'react-icons/tb'
import { oportunidadesExemplo } from '../../utils/oportunidadesExemplo'
import { ICONE_CATEGORIA, COR_CATEGORIA } from '../../utils/categoriasOportunidade'

const LIMITE = 3

export function CardOportunidadesMini(){

    // ! trocar linha quando criar o hook de oportunidades
    const oportunidades = oportunidadesExemplo.slice(0, LIMITE)

    return (
        <div className={ cardStyles.container }>
            <h1>Oportunidades para você</h1>

            <div className={ styles.lista }>
                {oportunidades.map((oportunidade) => {
                    const Icone = ICONE_CATEGORIA[oportunidade.categoria]

                    return (
                        <Link
                            key={ oportunidade.id }
                            to='/forum/oportunidades'
                            className={ styles.item }
                        >
                            <div
                                className={ styles.icone }
                                style={{ backgroundColor: COR_CATEGORIA[oportunidade.categoria] }}
                            >
                                <Icone size={ 20 } />
                            </div>

                            <div className={ styles.info }>
                                <span className={ styles.titulo }>{ oportunidade.titulo }</span>
                                <span className={ styles.instituicao }>{ oportunidade.instituicao }</span>
                                {oportunidade.prazo && (
                                    <span className={ styles.prazo }>
                                        <TbClock size={ 12 } />
                                        { oportunidade.prazo }
                                    </span>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>

            <hr className={ cardStyles.linha } />
            <Link
                to='/forum/oportunidades'
                className={ `${cardStyles.btnVerTodos} ${styles.verTodas}` }
            >
                Ver todas
            </Link>
        </div>
    )
}