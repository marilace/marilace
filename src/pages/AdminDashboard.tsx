import { Navigate, useNavigate } from 'react-router-dom'
import {
    TbNews,
    TbUsers,
    TbFlag,
    TbPlus,
    TbArrowUpRight,
    TbAlertCircle,
    TbChevronRight,
} from 'react-icons/tb'
import { useArtigos } from '../hooks/useArtigos'
import { useAutenticacao } from '../hooks/useAutenticacao'
import styles from './AdminDashboard.module.css'

export function AdminDashboard() {
    const {usuario} = useAutenticacao()
    const navegacao = useNavigate()
    const { artigos, carregando } = useArtigos()

    if (!usuario?.admin) return <Navigate to='/forum' replace />

    const artigosRecentes = [...artigos]
        .sort((a, b) => {
            const dataA = a.createdAt?.toDate?.()?.getTime?.() ?? 0
            const dataB = b.createdAt?.toDate?.()?.getTime?.() ?? 0
            return dataB - dataA
        })
        .slice(0, 5)

    const formatarData = (data: any) => {
        const dataConvertida = data?.toDate?.() ?? (data ? new Date(data) : null)

        if (!dataConvertida || Number.isNaN(dataConvertida.getTime())) {
            return 'Data não disponível'
        }

        return dataConvertida.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    return (
        <div className={styles.pagina}>
            <main className={styles.conteudo}>

                <header className={styles.cabecalho}>
                    <div>
                        <h3 className={styles.sobretitulo}>
                            <span>MARILACE</span> / ADMIN
                        </h3>
                        <h1>Visão geral<span>.</span></h1>
                        <h2>Acompanhe os conteúdos e os próximos passos da gestão da comunidade.</h2>
                    </div>
                </header>

                <section className={styles.secao} aria-labelledby="indicadores-titulo">
                    <div className={styles.gradeIndicadores}>
                        
                        <article className={`${styles.indicador} ${styles.indicadorArtigos}`}>
                            <div className={styles.indicadorTopo}>
                                <span className={styles.iconeIndicador}><TbNews aria-hidden="true" /></span>
                                <span className={styles.statusDisponivel}>Disponível</span>
                            </div>
                            <p className={styles.nomeIndicador}>Artigos cadastrados</p>
                            <strong className={styles.numeroIndicador}>{carregando ? '…' : artigos.length}</strong>
                            <span className={styles.legendaIndicador}>Conteúdos registrados no blog</span>
                            <button type="button" className={styles.acaoIndicador} onClick={() => navegacao('artigos/novo')}>
                                Gerenciar artigos <TbArrowUpRight aria-hidden="true" />
                            </button>
                        </article>

                        <article className={styles.indicador}>
                            <div className={styles.indicadorTopo}>
                                <span className={`${styles.iconeIndicador} ${styles.iconeVerde}`}><TbUsers aria-hidden="true" /></span>
                                <span className={styles.statusPendente}>Integração pendente</span>
                            </div>
                            <p className={styles.nomeIndicador}>Usuários cadastrados</p>
                            <strong className={styles.numeroIndisponivel}>—</strong>
                            <span className={styles.legendaIndicador}>Quantidade e perfis ainda não conectados</span>
                            <span className={styles.acaoDesativada}>Gerenciamento em planejamento</span>
                        </article>

                        <article className={styles.indicador}>
                            <div className={styles.indicadorTopo}>
                                <span className={`${styles.iconeIndicador} ${styles.iconeRosa}`}><TbFlag aria-hidden="true" /></span>
                                <span className={styles.statusPendente}>Módulo futuro</span>
                            </div>
                            <p className={styles.nomeIndicador}>Denúncias abertas</p>
                            <strong className={styles.numeroIndisponivel}>—</strong>
                            <span className={styles.legendaIndicador}>Central de denúncias ainda não implementada</span>
                            <span className={styles.acaoDesativada}>Central em planejamento</span>
                        </article>
                    </div>
                </section>

                <div className={styles.gradeInferior}>
                    <section className={`${styles.painel} ${styles.painelArtigos}`} aria-labelledby="artigos-recentes-titulo">
                        <div className={styles.tituloPainel}>
                            <div>
                                <span className={styles.rotuloSecao}>CONTEÚDO</span>
                                <h2 id="artigos-recentes-titulo">Artigos recentes</h2>
                            </div>
                            <button type="button" className={styles.btnArtigo} onClick={() => navegacao('artigos/novo')}>
                                <TbPlus size={24}/>
                            </button>
                        </div>

                        {carregando ? (
                            <div className={styles.estadoVazio}>Carregando artigos...</div>
                        ) : artigosRecentes.length > 0 ? (
                            <ul className={styles.listaArtigos}>
                                {artigosRecentes.map((artigo) => (
                                    <li key={artigo.id} className={styles.artigoLinha}>
                                        {artigo.imagemURL ? (
                                            <img src={artigo.imagemURL} alt="" className={styles.miniatura} />
                                        ) : (
                                            <div className={styles.miniaturaVazia}><TbNews aria-hidden="true" /></div>
                                        )}
                                        <div className={styles.infoArtigo}>
                                            <strong>{artigo.titulo}</strong>
                                            <span>{artigo.categorias?.length ? artigo.categorias.join(' · ') : 'Sem categoria'}</span>
                                        </div>
                                        <time className={styles.dataArtigo}>{formatarData(artigo.createdAt)}</time>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.estadoVazio}>
                                <span className={styles.vazioIcone}><TbNews aria-hidden="true" size={36} /></span>
                                <strong>Nenhum artigo encontrado</strong>
                                <p>Quando houver conteúdos cadastrados, eles aparecerão nesta lista.</p>
                                <button type="button" className={styles.botaoSecundario} onClick={() => navegacao('artigos/novo')}>
                                    <TbPlus aria-hidden="true" /> Criar primeiro artigo
                                </button>
                            </div>
                        )}
                    </section>

                    <section className={`${styles.painel} ${styles.painelAtalhos}`} aria-labelledby="atalhos-titulo">
                        <div className={styles.tituloPainel}>
                            <div>
                                <span className={styles.rotuloSecao}>ACESSO RÁPIDO</span>
                                <h2 id="atalhos-titulo">Atalhos</h2>
                            </div>
                        </div>

                        <button type="button" className={styles.atalho} onClick={() => navegacao('artigos/novo')}>
                            <span className={styles.atalhoIcone}><TbPlus aria-hidden="true" /></span>
                            <span><strong>Publicar conteúdo</strong><small>Crie um artigo para o blog</small></span>
                            <TbChevronRight className={styles.atalhoSeta} aria-hidden="true" />
                        </button>
                        <div className={`${styles.atalho} ${styles.atalhoPendente}`}>
                            <span className={`${styles.atalhoIcone} ${styles.atalhoRosa}`}><TbUsers aria-hidden="true" /></span>
                            <span><strong>Gerenciar usuários</strong><small>Perfis, contas e permissões</small></span>
                            <span className={styles.tagEmBreve}>Em breve</span>
                        </div>
                        <div className={`${styles.atalho} ${styles.atalhoPendente}`}>
                            <span className={`${styles.atalhoIcone} ${styles.atalhoVerde}`}><TbAlertCircle aria-hidden="true" /></span>
                            <span><strong>Revisar denúncias</strong><small>Moderação e acompanhamento</small></span>
                            <span className={styles.tagEmBreve}>Em breve</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}