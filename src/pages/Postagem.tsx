import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TbArrowLeft, TbAlertCircle } from 'react-icons/tb'
import { Post } from '../components/posts/Post'
import { ComentariosPost } from '../components/posts/ComentariosPost'
import { usePublicacao } from '../hooks/usePublicacoes'
import { formatarTempo } from '../utils/formatarTempo'
import { TelaCarregamento } from '../components/misc/TelaCarregamento'
import styles from './Postagem.module.css'
const fundo = 'https://i.imgur.com/0x40IR0.png'

export function Postagem() {
    const { id } = useParams()
    const { publicacao, carregando, erro } = usePublicacao(id)
    const comentariosRef = useRef<HTMLDivElement>(null)

    const irParaComentarios = () => {
        comentariosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (carregando) return <TelaCarregamento />

    if (erro || !publicacao) {
        return (
            <main className={styles.pagina}>
                <Link to="/forum" className={styles.voltar}>
                    <TbArrowLeft size={20} />
                    Voltar ao fórum
                </Link>
                <div className={ styles.containerErro }>
                    <img src={ fundo } className={ styles.fundo } />
                    <div className={ styles.conteudoErro }>
                        <h1>404</h1>
                        <div className={ styles.desc }>
                            <h2>Página não encontrada.</h2>
                            <p>Poxa! Parece que essa página não existe...<br/>
                            Talvez o link esteja errado ou foi removido.</p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.pagina}>
            <Link to="/forum" className={styles.voltar}>
                <TbArrowLeft size={28} />
                Publicação
            </Link>

            <section className={styles.conteudo}>
                <Post
                    postId={publicacao.id}
                    authorId={publicacao.authorId}
                    avatarSrc={publicacao.authorPhotoURL}
                    nome={publicacao.authorDisplayName}
                    username={publicacao.authorUsername}
                    emblemas={publicacao.authorEmblemas}
                    tempo={formatarTempo(publicacao.createdAt)}
                    conteudo={publicacao.text}
                    imagemUrl={publicacao.imageURL}
                    curtidas={publicacao.likesCount ?? 0}
                    comentarios={publicacao.commentsCount ?? 0}
                    compartilhamentos={0}
                    onVerComentarios={irParaComentarios}
                />
                <div ref={comentariosRef} className={styles.areaComentarios}>
                    <ComentariosPost postId={publicacao.id} authorId={publicacao.authorId} />
                </div>
            </section>
        </main>
    )
}
