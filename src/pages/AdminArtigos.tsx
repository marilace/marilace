
import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
    TbNews,
    TbStar,
    TbTags,
    TbPlus,
    TbSearch,
    TbExternalLink,
    TbFilter,
    TbX,
} from 'react-icons/tb'

import styles from './AdminArtigos.module.css'
import { useArtigos } from '../hooks/useArtigos'
import { useAutenticacao } from '../hooks/useAutenticacao';

type FiltroArtigos = 'todos' | 'destaques' | 'sem-categoria'

export function AdminArtigos() {
    const { usuario } = useAutenticacao()
    const { artigos, carregando } = useArtigos()
    const navegacao = useNavigate()

    const [busca, setBusca] = useState('')
    const [filtro, setFiltro] = useState<FiltroArtigos>('todos')

    if (!usuario?.admin) return <Navigate to='/forum' replace />

    const categorias = useMemo(() => {
        const encontradas: string[] = []

        artigos.forEach((artigo) => {
            artigo.categorias?.forEach((categoria) => {
                if (!encontradas.includes(categoria)) {
                    encontradas.push(categoria)
                }
            })
        })

        return encontradas
    }, [artigos])

    const artigosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        return artigos.filter((artigo) => {
            const correspondeBusca =
                artigo.titulo.toLowerCase().includes(termo) ||
                artigo.descricao.toLowerCase().includes(termo) ||
                artigo.categorias?.some((categoria) =>
                    categoria.toLowerCase().includes(termo)
                )

            const correspondeFiltro =
                filtro === 'todos' ||
                (filtro === 'destaques' && artigo.destaque) ||
                (filtro === 'sem-categoria' &&
                    (!artigo.categorias || artigo.categorias.length === 0))

            return correspondeBusca && correspondeFiltro
        })
    }, [artigos, busca, filtro])

    const totalDestaques = artigos.filter(
        (artigo) => artigo.destaque
    ).length

    const limparBusca = () => {
        setBusca('')
        setFiltro('todos')
    }

    return (
        <main className={styles.pagina}>
            <header className={styles.cabecalho}>
                <div>
                    <h3 className={styles.sobretitulo}>
                        <span>MARILACE</span> / ARTIGOS
                    </h3>
                    <h1>Artigos<span>.</span></h1>
                    <h2>Gerencie os conteúdos publicados no blog da MariLace.</h2>
                </div>
                <button
                    type="button"
                    className={styles.botaoNovo}
                    onClick={() => navegacao('/admin/artigos/novo')}
                >
                    <TbPlus size={21} className={styles.icon}/>
                    Novo artigo
                </button>
            </header>

            <section className={styles.estatisticas} aria-label="Resumo dos artigos">
                <article className={styles.cardEstatistica}>
                    <div className={styles.iconeEstatistica}>
                        <TbNews size={23} />
                    </div>

                    <div>
                        <span className={styles.rotuloEstatistica}>
                            Artigos cadastrados
                        </span>

                        <strong className={styles.valorEstatistica}>
                            {artigos.length}
                        </strong>

                        <span className={styles.descricaoEstatistica}>
                            Conteúdos no blog
                        </span>
                    </div>
                </article>

                <article className={styles.cardEstatistica}>
                    <div className={`${styles.iconeEstatistica} ${styles.iconeDestaque}`}>
                        <TbStar size={23} />
                    </div>

                    <div>
                        <span className={styles.rotuloEstatistica}>
                            Em destaque
                        </span>

                        <strong className={styles.valorEstatistica}>
                            {totalDestaques}
                        </strong>

                        <span className={styles.descricaoEstatistica}>
                            Artigos destacados
                        </span>
                    </div>
                </article>

                <article className={styles.cardEstatistica}>
                    <div className={`${styles.iconeEstatistica} ${styles.iconeCategorias}`}>
                        <TbTags size={23} />
                    </div>

                    <div>
                        <span className={styles.rotuloEstatistica}>
                            Categorias utilizadas
                        </span>

                        <strong className={styles.valorEstatistica}>
                            {categorias.length}
                        </strong>

                        <span className={styles.descricaoEstatistica}>
                            Categorias diferentes
                        </span>
                    </div>
                </article>
            </section>

            <section className={styles.secaoArtigos}>
                <div className={styles.cabecalhoSecao}>
                    <div>
                        <h2>Seus artigos</h2>
                        <p>
                            Consulte os conteúdos cadastrados e encontre um artigo.
                        </p>
                    </div>

                    <span className={styles.contadorResultados}>
                        {artigosFiltrados.length}{' '}
                        {artigosFiltrados.length === 1 ? 'artigo' : 'artigos'}
                    </span>
                </div>

                <div className={styles.ferramentas}>
                    <div className={styles.busca}>
                        <TbSearch size={20} />

                        <input
                            type="search"
                            placeholder="Buscar por título, descrição ou categoria..."
                            aria-label="Buscar artigos"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />

                        {busca && (
                            <button
                                type="button"
                                className={styles.limparBusca}
                                onClick={() => setBusca('')}
                                aria-label="Limpar busca"
                            >
                                <TbX size={18} />
                            </button>
                        )}
                    </div>

                    <div className={styles.filtros}>
                        <TbFilter size={19} />

                        <label htmlFor="filtroArtigos">Exibir:</label>

                        <select
                            id="filtroArtigos"
                            value={filtro}
                            onChange={(e) =>
                                setFiltro(e.target.value as FiltroArtigos)
                            }
                        >
                            <option value="todos">Todos os artigos</option>
                            <option value="destaques">Em destaque</option>
                            <option value="sem-categoria">Sem categoria</option>
                        </select>
                    </div>
                </div>

                {carregando ? (
                    <div className={styles.estado}>
                        <span className={styles.carregamento} />
                        <p>Carregando artigos...</p>
                    </div>
                ) : artigos.length === 0 ? (
                    <div className={styles.estado}>
                        <div className={styles.iconeVazio}>
                            <TbNews size={36} />
                        </div>

                        <h3>Nenhum artigo cadastrado</h3>

                        <p>
                            Comece criando o primeiro artigo do blog do MariLace.
                        </p>

                        <button
                            type="button"
                            className={styles.botaoNovo}
                            onClick={() => navegacao('/admin/artigos/novo')}
                        >
                            <TbPlus size={20} />
                            Criar primeiro artigo
                        </button>
                    </div>
                ) : artigosFiltrados.length === 0 ? (
                    <div className={styles.estado}>
                        <div className={styles.iconeVazio}>
                            <TbSearch size={28} />
                        </div>

                        <h3>Nenhum resultado encontrado</h3>

                        <p>
                            Tente alterar os termos da busca ou os filtros selecionados.
                        </p>

                        <button
                            type="button"
                            className={styles.botaoSecundario}
                            onClick={limparBusca}
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    <div className={styles.listaArtigos}>
                        {artigosFiltrados.map((artigo) => (
                            <article className={styles.artigo} key={artigo.id}>
                                <img
                                    src={artigo.imagemURL}
                                    alt=""
                                    className={styles.imagemArtigo}
                                    loading="lazy"
                                />

                                <div className={styles.conteudoArtigo}>
                                    <div className={styles.etiquetas}>
                                        {artigo.destaque && (
                                            <span className={styles.etiquetaDestaque}>
                                                <TbStar size={14} />
                                                Destaque
                                            </span>
                                        )}

                                        {artigo.categorias?.map((categoria) => (
                                            <span
                                                className={styles.etiquetaCategoria}
                                                key={categoria}
                                            >
                                                {categoria}
                                            </span>
                                        ))}
                                    </div>

                                    <h3>{artigo.titulo}</h3>

                                    <p className={styles.descricaoArtigo}>
                                        {artigo.descricao}
                                    </p>

                                    <span className={styles.indicadorConteudo}>
                                        <TbNews size={16} />
                                        Artigo cadastrado
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className={styles.botaoVisualizar}
                                    onClick={() =>
                                        navegacao(`/blog/${artigo.id}`)
                                    }
                                    aria-label={`Visualizar artigo: ${artigo.titulo}`}
                                    title="Visualizar artigo"
                                >
                                    <TbExternalLink size={20} />
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
