import { useRef, useState } from 'react'
import styles from './ModalComentarios.module.css'
import { TbUser, TbSend, TbX, TbMoodEmpty, TbHeart, TbHeartFilled, TbArrowBackUp } from 'react-icons/tb'
import { useComentarios, useCriarComentario, useCurtidaComentario } from '../../hooks/useComentarios'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { formatarTempo } from '../../utils/formatarTempo'
import { type ComentarioTipo } from '../../types/Comentario'
import { Link } from 'react-router-dom'

type ModalComentariosProps = {
    aberto: boolean
    postId: string
    authorId: string
    fechar: () => void
}

type AlvoResposta = {
    itemId: string
    raizId: string
    authorId: string
    username: string
}

// Botão de curtir de um comentário/resposta específico, com seu próprio contador
function BotaoCurtirComentario({ postId, comentario }: { postId: string; comentario: ComentarioTipo }) {
    const { curtido, alternarCurtida } = useCurtidaComentario(postId, comentario.id, comentario.authorId)

    return (
        <button
            className={`${styles.btnAcao} ${curtido ? styles.btnAcaoAtiva : ''}`}
            onClick={alternarCurtida}
            aria-pressed={curtido}
            aria-label="Curtir comentário"
        >
            {curtido ? <TbHeartFilled size={16} /> : <TbHeart size={16} />}
            {comentario.likesCount > 0 && <span>{comentario.likesCount}</span>}
        </button>
    )
}

export function ModalComentarios({ aberto, postId, authorId, fechar }: ModalComentariosProps) {
    const { usuario } = useAutenticacao()
    const { comentarios, carregando } = useComentarios(aberto ? postId : undefined)
    const { criarComentario, enviando } = useCriarComentario(postId, authorId)

    const [texto, setTexto] = useState('')
    const [erro, setErro] = useState('')
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const [alvoResposta, setAlvoResposta] = useState<AlvoResposta | null>(null)
    const [textoResposta, setTextoResposta] = useState('')

    if (!aberto) return null

    const ajustarAltura = (elemento: HTMLTextAreaElement) => {
        elemento.style.height = 'auto'
        elemento.style.height = `${Math.min(elemento.scrollHeight, 96)}px`
    }

    const fecharModal = () => {
        setTexto('')
        setErro('')
        setAlvoResposta(null)
        setTextoResposta('')
        fechar()
    }

    const enviarComentario = async () => {
        if (!texto.trim()) return

        setErro('')

        try {
            await criarComentario(texto)
            setTexto('')
            if (inputRef.current) inputRef.current.style.height = 'auto'
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

    const abrirResposta = (item: ComentarioTipo, raizId: string) => {
        setAlvoResposta({ itemId: item.id, raizId, authorId: item.authorId, username: item.authorUsername })
        setTextoResposta('')
    }

    const cancelarResposta = () => {
        setAlvoResposta(null)
        setTextoResposta('')
    }

    const enviarResposta = async () => {
        if (!alvoResposta || !textoResposta.trim()) return

        try {
            await criarComentario(textoResposta, {
                parentId: alvoResposta.raizId,
                respostaParaAuthorId: alvoResposta.authorId,
                respostaParaUsername: alvoResposta.username,
            })
            cancelarResposta()
        } catch (e) {
            setErro('Não foi possível enviar a resposta. Tente novamente.')
        }
    }

    const aoPressionarTeclaResposta = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            enviarResposta()
        }
    }

    const renderAvatar = (fotoURL: string | null, username: string, classe: string) =>
        fotoURL ? (
            <img src={fotoURL} className={classe} />
        ) : (
            <div className={`${classe} ${styles.avatarDefault}`}>
                <TbUser size={username ? 18 : 18} />
            </div>
        )

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
                            <div key={comentario.id} className={styles.thread}>
                                <div className={styles.comentario}>
                                    <Link to={`/${comentario.authorUsername}`}>
                                        {renderAvatar(comentario.authorPhotoURL, comentario.authorUsername, styles.avatar)}
                                    </Link>

                                    <div className={styles.blocoComentario}>
                                        <div className={styles.bolhaComentario}>
                                            <div className={styles.linhaAutor}>
                                                <span className={styles.nome}>{comentario.authorDisplayName}</span>
                                                <span className={styles.username}>@{comentario.authorUsername}</span>
                                                <span className={styles.tempo}>{formatarTempo(comentario.createdAt)}</span>
                                            </div>
                                            <p className={styles.texto}>{comentario.text}</p>
                                        </div>

                                        <div className={styles.acoesComentario}>
                                            <BotaoCurtirComentario postId={postId} comentario={comentario} />
                                            <button
                                                className={styles.btnAcao}
                                                onClick={() => abrirResposta(comentario, comentario.id)}
                                            >
                                                <TbArrowBackUp size={16} />
                                                <span>Responder</span>
                                            </button>
                                        </div>

                                        {alvoResposta?.itemId === comentario.id && (
                                            <div className={styles.caixaResposta}>
                                                <span className={styles.respondendoLabel}>
                                                    Respondendo a @{alvoResposta.username}
                                                    <button className={styles.btnCancelarResposta} onClick={cancelarResposta}>Cancelar</button>
                                                </span>
                                                <div className={styles.capsulaInput}>
                                                    <textarea
                                                        className={styles.inputComentario}
                                                        rows={1}
                                                        maxLength={300}
                                                        autoFocus
                                                        placeholder={`Responder a @${alvoResposta.username}...`}
                                                        value={textoResposta}
                                                        onChange={(e) => {
                                                            setTextoResposta(e.target.value)
                                                            ajustarAltura(e.target)
                                                        }}
                                                        onKeyDown={aoPressionarTeclaResposta}
                                                    />
                                                    <button
                                                        className={styles.btnEnviar}
                                                        onClick={enviarResposta}
                                                        disabled={!textoResposta.trim()}
                                                        aria-label="Enviar resposta"
                                                    >
                                                        <TbSend size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {comentario.respostas.length > 0 && (
                                            <div className={styles.listaRespostas}>
                                                {comentario.respostas.map((resposta) => (
                                                    <div key={resposta.id} className={styles.comentario}>
                                                        <Link to={`/${resposta.authorUsername}`}>
                                                            {renderAvatar(resposta.authorPhotoURL, resposta.authorUsername, styles.avatarResposta)}
                                                        </Link>

                                                        <div className={styles.blocoComentario}>
                                                            <div className={styles.bolhaComentario}>
                                                                <div className={styles.linhaAutor}>
                                                                    <span className={styles.nome}>{resposta.authorDisplayName}</span>
                                                                    <span className={styles.username}>@{resposta.authorUsername}</span>
                                                                    <span className={styles.tempo}>{formatarTempo(resposta.createdAt)}</span>
                                                                </div>
                                                                <p className={styles.texto}>
                                                                    {resposta.respostaParaUsername && (
                                                                        <span className={styles.mencao}>@{resposta.respostaParaUsername} </span>
                                                                    )}
                                                                    {resposta.text}
                                                                </p>
                                                            </div>

                                                            <div className={styles.acoesComentario}>
                                                                <BotaoCurtirComentario postId={postId} comentario={resposta} />
                                                                <button
                                                                    className={styles.btnAcao}
                                                                    onClick={() => abrirResposta(resposta, comentario.id)}
                                                                >
                                                                    <TbArrowBackUp size={16} />
                                                                    <span>Responder</span>
                                                                </button>
                                                            </div>

                                                            {alvoResposta?.itemId === resposta.id && (
                                                                <div className={styles.caixaResposta}>
                                                                    <span className={styles.respondendoLabel}>
                                                                        Respondendo a @{alvoResposta.username}
                                                                        <button className={styles.btnCancelarResposta} onClick={cancelarResposta}>Cancelar</button>
                                                                    </span>
                                                                    <div className={styles.capsulaInput}>
                                                                        <textarea
                                                                            className={styles.inputComentario}
                                                                            rows={1}
                                                                            maxLength={300}
                                                                            autoFocus
                                                                            placeholder={`Responder a @${alvoResposta.username}...`}
                                                                            value={textoResposta}
                                                                            onChange={(e) => {
                                                                                setTextoResposta(e.target.value)
                                                                                ajustarAltura(e.target)
                                                                            }}
                                                                            onKeyDown={aoPressionarTeclaResposta}
                                                                        />
                                                                        <button
                                                                            className={styles.btnEnviar}
                                                                            onClick={enviarResposta}
                                                                            disabled={!textoResposta.trim()}
                                                                            aria-label="Enviar resposta"
                                                                        >
                                                                            <TbSend size={18} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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

                    <div className={styles.capsulaInput}>
                        <textarea
                            ref={inputRef}
                            className={styles.inputComentario}
                            rows={1}
                            maxLength={300}
                            placeholder="Escreva um comentário..."
                            value={texto}
                            onChange={(e) => {
                                setTexto(e.target.value)
                                ajustarAltura(e.target)
                            }}
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
        </div>
    )
}