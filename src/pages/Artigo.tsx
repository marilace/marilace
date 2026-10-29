import { useNavigate, useParams } from 'react-router-dom'
import { TbArrowLeft, TbBookmark, TbStar } from 'react-icons/tb'
import { HeaderAnon } from '../components/headers/HeaderAnon'
import { Chip } from '../components/misc/Chip'
import { TelaCarregamento } from '../components/misc/TelaCarregamento'
import { useArtigo } from '../hooks/useArtigos'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { artigosExemplo } from '../utils/artigosExemplo'
import type { ArtigoTipo } from '../types/Artigo'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './Artigo.module.css'

const CORES_CATEGORIA: Record<string, string> = {
    'Ciência': 'var(--verde)',
    'Tecnologia': 'rgba(112, 69, 146, .8)',
    'Engenharia': 'var(--primaria)',
    'Matemática': 'var(--rosa)',
    'Questões de Gênero': 'var(--primaria-escura)',
}

function corDaCategoria(categoria: string) {
    return CORES_CATEGORIA[categoria] ?? 'var(--cinza)'
}

export function Artigo() {
    const { id } = useParams<{ id: string }>()
    const navegacao = useNavigate()
    const { usuario } = useAutenticacao()
    const { artigo: artigoBanco, carregando } = useArtigo(id)

    // Os artigos ilustrativos não existem no Firestore. Procuramos neles
    // somente quando o ID corresponde a um exemplo estático.
    const artigoExemplo = artigosExemplo.find((item: ArtigoTipo) => item.id === id)
    const artigo = artigoBanco ?? artigoExemplo ?? null

    if (carregando && !artigoExemplo) return <TelaCarregamento />

    const logada = Boolean(usuario)

    return (
        <main className={styles.pagina}>
            {!logada && <HeaderAnon />}

            {!artigo ? (
                <section className={styles.estado}>
                    <span className={styles.selo}>MariLace • Blog</span>
                    <h1>Artigo não encontrado</h1>
                    <p>Este artigo pode ter sido removido ou o endereço pode estar incorreto.</p>
                    <button className={styles.botaoVoltar} onClick={() => navegacao(-1)}>
                        <TbArrowLeft aria-hidden="true" />
                        Voltar ao blog
                    </button>
                </section>
            ) : (
                <>
                    <div className={styles.barraTopo}>
                        <button className={styles.linkVoltar} onClick={() => navegacao(-1)}>
                            <TbArrowLeft aria-hidden="true" />
                            Voltar ao blog
                        </button>
                    </div>

                    <article className={styles.artigo}>
                        <header className={styles.cabecalho}>
                            <h3 className={styles.selo}><span>MariLace</span> / Blog</h3>

                            <div className={styles.categorias} aria-label="Categorias do artigo">
                                {artigo.categorias?.map((categoria) => (
                                    <Chip
                                        key={categoria}
                                        texto={categoria}
                                        cor={corDaCategoria(categoria)}
                                        className={styles.chipPequeno}
                                    />
                                ))}
                            </div>

                            <h1>{artigo.titulo}</h1>
                            <p className={styles.descricao}>{artigo.descricao}</p>
                        </header>

                        {artigo.imagemURL && (
                            <img
                                src={artigo.imagemURL}
                                alt={`Capa do artigo: ${artigo.titulo}`}
                                className={styles.capa}
                            />
                        )}

                        <div className={styles.conteudo}>
                            {artigo.conteudo?.trim() ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {artigo.conteudo}
                                </ReactMarkdown>
                            ) : (
                                <p className={styles.semConteudo}>
                                    O conteúdo completo deste artigo ainda não foi disponibilizado.
                                </p>
                            )}
                        </div>

                        <footer className={styles.rodapeArtigo}>
                            <span>Conteúdo MariLace</span>
                            <span className={styles.rodapeIcones} aria-hidden="true">
                                <TbBookmark />
                                <TbStar />
                            </span>
                        </footer>
                    </article>
                </>
            )}
        </main>
    )
}
