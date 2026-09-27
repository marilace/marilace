import { useState } from 'react'
import styles from './ModalComentarios.module.css'
import { TbUser, TbSend, TbX, TbMoodEmpty } from 'react-icons/tb'
import { useComentarios, useCriarComentario } from '../../hooks/useComentarios'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { formatarTempo } from '../../utils/formatarTempo'
import { Link } from 'react-router-dom'

type ModalComentariosProps = {
    aberto: boolean
    postId: string
    authorId: string
    fechar: () => void
}

export function ModalComentarios({ aberto, postId, authorId, fechar }: ModalComentariosProps) {
    const { usuario } = useAutenticacao()
    const { comentarios, carregando } = useComentarios(aberto ? postId : undefined)
    const { criarComentario, enviando } = useCriarComentario(postId, authorId)

    const [texto, setTexto] = useState('')
    const [erro, setErro] = useState('')

    if (!aberto) return null

    const fecharModal = () => {
        setTexto('')
        setErro('')
        fechar()
    }

    const enviarComentario = async () => {
        if (!texto.trim()) return

        setErro('')

        try {
            await criarComentario(texto)
            setTexto('')
        } catch (e) {
            setErro('Não foi possível enviar o comentário. Tente novamente.')
        }
    }

    const aoPressionarTecla = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            enviarComentario()
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={fecharModal}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>Comentários</h2>
                    <button className={styles.btnFechar} onClick={fecharModal} aria-label="Fechar">
                        <TbX size={22} />
                    </button>
                </header>

                <div className={styles.listaComentarios}>
                    {carregando ? (
                        <p className={styles.mensagemVazio}>Carregando comentários...</p>
                    ) : comentarios.length === 0 ? (
                        <div className={styles.vazio}>
                            <TbMoodEmpty size={40} className={styles.iconVazio} />
                            <p className={styles.mensagemVazio}>Ainda não há comentários. Seja a primeira a comentar!</p>
                        </div>
                    ) : (
                        comentarios.map((comentario) => (
                            <div key={comentario.id} className={styles.comentario}>
                                <Link to={`/${comentario.authorUsername}`}>
                                    {comentario.authorPhotoURL ? (
                                        <img src={comentario.authorPhotoURL} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarDefault}>
                                            <TbUser size={18} />
                                        </div>
                                    )}
                                </Link>

                                <div className={styles.bolhaComentario}>
                                    <div className={styles.linhaAutor}>
                                        <span className={styles.nome}>{comentario.authorDisplayName}</span>
                                        <span className={styles.username}>@{comentario.authorUsername}</span>
                                        <span className={styles.tempo}>{formatarTempo(comentario.createdAt)}</span>
                                    </div>
                                    <p className={styles.texto}>{comentario.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {erro && <p className={styles.erroTexto}>{erro}</p>}

                <div className={styles.containerInput}>
                    {usuario?.photoURL ? (
                        <img src={usuario.photoURL} className={styles.avatarUsuario} />
                    ) : (
                        <div className={styles.avatarDefault}>
                            <TbUser size={18} />
                        </div>
                    )}

                    <textarea
                        className={styles.inputComentario}
                        rows={1}
                        maxLength={300}
                        placeholder="Escreva um comentário..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={aoPressionarTecla}
                        disabled={enviando}
                    />

                    <button
                        className={styles.btnEnviar}
                        onClick={enviarComentario}
                        disabled={enviando || !texto.trim()}
                        aria-label="Enviar comentário"
                    >
                        <TbSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}