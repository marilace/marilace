import styles from './CardOportunidade.module.css'
import { TbMapPin, TbClock } from "react-icons/tb";
import { Chip } from './Chip'
import { type OportunidadeTipo } from '../../types/Oportunidade'
import { ICONE_CATEGORIA, COR_CATEGORIA } from '../../utils/categoriasOportunidade'

interface CardOportunidadeProps {
    oportunidade: OportunidadeTipo
}

export function CardOportunidade({ oportunidade }: CardOportunidadeProps) {
    const Icone = ICONE_CATEGORIA[oportunidade.categoria]
    const href = oportunidade.link ?? '#'
    const abrirEmNovaAba = Boolean(oportunidade.link) && oportunidade.link !== '#'

    return (
        <article className={ styles.card }>

            <div className={ styles.topo }>
                <div className={ styles.iconeCategoria } style={{ backgroundColor: COR_CATEGORIA[oportunidade.categoria] }}>
                    <Icone className={ styles.icone } />
                </div>
                <div className={ styles.chip }>
                    <Chip texto={ oportunidade.categoria } cor={ COR_CATEGORIA[oportunidade.categoria] } />
                </div>
            </div>

            <h2 className={ styles.titulo }>{ oportunidade.titulo }</h2>
            <span className={ styles.instituicao }>{ oportunidade.instituicao }</span>

            <p className={ styles.descricao }>{ oportunidade.descricao }</p>

            <div className={ styles.tags }>
                {oportunidade.tags.map((tag) => (
                    <span key={ tag } className={ styles.tag }>{ tag }</span>
                ))}
            </div>

            <div className={ styles.info }>
                <span className={ styles.infoItem }>
                    <TbMapPin className={ styles.infoIcone } />
                    { oportunidade.modalidade }{ oportunidade.local ? ` · ${oportunidade.local}` : '' }
                </span>
                {oportunidade.prazo && (
                    <span className={ styles.infoItem }>
                        <TbClock className={ styles.infoIcone } />
                        { oportunidade.prazo }
                    </span>
                )}
            </div>

            <a href={ href } target={ abrirEmNovaAba ? '_blank' : undefined } rel="noreferrer" className={ styles.botao }>
                Saiba mais
            </a>
        </article>
    )
}