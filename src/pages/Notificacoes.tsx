import styles from './Notificacoes.module.css'
import { HeaderUser } from '../components/headers/HeaderUser'
import { ChipClicavel } from '../components/misc/ChipClicavel'
import { ItemNotificacao } from '../components/misc/ItemNotificacao'
import { useNotificacoes } from '../hooks/useNotificacoes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TipoNotificacao } from '../types/Notificacao'

const filtros: { texto: string; tipo: TipoNotificacao | 'tudo'; cor: string }[] = [
    { texto: 'Tudo', tipo: 'tudo', cor: 'var(--primaria)' },
    { texto: 'Menções', tipo: 'mencao', cor: 'var(--verde)' },
    { texto: 'Seguidores', tipo: 'seguidor', cor: 'rgba(112, 69, 146, .8)' },
    { texto: 'Curtidas', tipo: 'curtida', cor: 'var(--rosa)' },
    { texto: 'Comentários', tipo: 'comentario', cor: 'var(--verde)' },
    { texto: 'MariLace', tipo: 'sistema', cor: 'var(--primaria)' },
]

export function Notificacoes(){

    const { notificacoes, carregando, naoLidasCount, marcarComoLida, marcarTodasComoLidas } = useNotificacoes()
    const [filtroAtivo, setFiltroAtivo] = useState<TipoNotificacao | 'tudo'>('tudo')
    const navegacao = useNavigate()

    const notificacoesFiltradas = filtroAtivo === 'tudo'
        ? notificacoes
        : notificacoes.filter((notificacao) => notificacao.tipo === filtroAtivo)

    const abrirNotificacao = async (notificacaoId: string, lida: boolean, deQuemUsername?: string) => {
        if (!lida) await marcarComoLida(notificacaoId)
        if (deQuemUsername) navegacao(`/${deQuemUsername}`)
    }

    return (
        <div className={ styles.page }>

            <HeaderUser/>

            <main className={ styles.container }>
                <div className={ styles.titulo }>
                    <h1>Notificações</h1>
                    <span className={ styles.quantidade }>{naoLidasCount}</span>

                    {naoLidasCount > 0 && (
                        <button className={ styles.btnMarcarTodas } onClick={marcarTodasComoLidas}>
                            Marcar tudo como lido
                        </button>
                    )}
                </div>

                <div className={ styles.filtros}>
                    {filtros.map((filtro) => (
                        <ChipClicavel
                            key={filtro.tipo}
                            texto={filtro.texto}
                            cor={filtro.cor}
                            selecionado={filtroAtivo === filtro.tipo}
                            onClick={() => setFiltroAtivo(filtro.tipo)}
                        />
                    ))}
                </div>

                <section className={ styles.notificacoes }>
                    {carregando && (
                        <p className={ styles.mensagemVazia }>Carregando notificações...</p>
                    )}

                    {!carregando && notificacoesFiltradas.length === 0 && (
                        <p className={ styles.mensagemVazia }>Nenhuma notificação por aqui ainda.</p>
                    )}

                    {!carregando && notificacoesFiltradas.map((notificacao) => (
                        <ItemNotificacao
                            key={notificacao.id}
                            notificacao={notificacao}
                            onClick={() => abrirNotificacao(notificacao.id, notificacao.lida, notificacao.deQuemUsername)}
                        />
                    ))}
                </section>
            </main>
        </div>
    )
}