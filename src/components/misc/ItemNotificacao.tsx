import styles from './ItemNotificacao.module.css'
import type { IconType } from 'react-icons';
import { TbHeart, TbUserPlus, TbMessage, TbAt, TbMoodSmileBeam } from 'react-icons/tb'
import type { NotificacaoTipo, TipoNotificacao } from '../../types/Notificacao'
import { formatarTempo } from '../../utils/formatarTempo'

const iconesPorTipo: Record<TipoNotificacao, IconType> = {
    curtida: TbHeart,
    seguidor: TbUserPlus,
    comentario: TbMessage,
    mencao: TbAt,
    sistema: TbMoodSmileBeam,
}

const coresPorTipo: Record<TipoNotificacao, string> = {
    curtida: 'var(--rosa)',
    seguidor: 'rgba(112, 69, 146, .8)',
    comentario: 'var(--verde)',
    mencao: 'var(--verde)',
    sistema: 'var(--primaria)',
}

interface ItemNotificacaoProps{
    notificacao: NotificacaoTipo;
    onClick?: () => void;
}

export function ItemNotificacao({ notificacao, onClick }: ItemNotificacaoProps) {
    const Icon = iconesPorTipo[notificacao.tipo]
    const cor = coresPorTipo[notificacao.tipo]

    return(
        <button
            type="button"
            className={`${styles.container} ${notificacao.lida ? '' : styles.naoLida}`}
            onClick={onClick}
        >
            <div className={ styles.icon } style={{ backgroundColor: cor }}>
                <Icon size={28}/>
            </div>
            <div className={ styles.texto }>
                <h1>{notificacao.titulo}</h1>
                <p>{notificacao.mensagem}</p>
                <span className={ styles.tempo }>{formatarTempo(notificacao.createdAt)}</span>
            </div>
            {!notificacao.lida && <span className={ styles.pontoNaoLido } />}
        </button>
    )
}