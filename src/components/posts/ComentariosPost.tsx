import { useState } from 'react'
import { 
    TbUser, 
    TbSend, 
    TbCornerDownRight, 
    TbStarFilled, 
    TbStar 
} from 'react-icons/tb'
import { useComentarios, useCriarComentario, useCurtidaComentario } from '../../hooks/useComentarios'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { formatarTempo } from '../../utils/formatarTempo'
import { type ComentarioTipo } from '../../types/Comentario'
import styles from './ComentariosPost.module.css'

interface ComentariosPostProps {
    postId: string
    authorId: string
}

function BotaoCurtirComentario({ postId, comentario }: { postId: string; comentario: ComentarioTipo }) {
    const { curtido, alternarCurtida } = useCurtidaComentario(postId, comentario.id, comentario.authorId)

    return (
        <button
            className={`${styles.btnAcao} ${curtido ? styles.btnAcaoAtiva : ''}`}
            onClick={alternarCurtida}
            aria-pressed={curtido}
            aria-label="Curtir comentário"
        >
            {curtido ? <TbStarFilled size={16} /> : <TbStar size={16} />}
            {comentario.likesCount > 0 && <span>{comentario.likesCount}</span>}
        </button>
    )
}

export function ComentariosPost({ postId, authorId }: ComentariosPostProps) {
    const { usuario } = useAutenticacao()
    const { comentarios, carregando } = useComentarios(postId)
    const { criarComentario, enviando } = useCriarComentario(postId, authorId)
    const [texto, setTexto] = useState('')
    const [textoResposta, setTextoResposta] = useState('')
    const [comentarioRespondido, setComentarioRespondido] = useState<string | null>(null)
    const [enviandoResposta, setEnviandoResposta] = useState(false)
    const [erro, setErro] = useState('')

    const enviarComentario = async () => {
        if (!texto.trim()) return

        setErro('')

        try {
            await criarComentario(texto)
            setTexto('')
        } catch (e) {
            console.error('Erro ao enviar comentário:', e)
            setErro('Não foi possível enviar o comentário. Tente novamente.')
        }
    }

    const enviarResposta = async (comentario: typeof comentarios[number]) => {
        if (!textoResposta.trim()) return

        setErro('')
        setEnviandoResposta(true)

        try {
            await criarComentario(textoResposta, {
                parentId: comentario.id,
                respostaParaAuthorId: comentario.authorId,
                respostaParaUsername: comentario.authorUsername,
            })

            setTextoResposta('')
            setComentarioRespondido(null)
        } catch (e) {
            console.error('Erro ao enviar resposta:', e)
            setErro('Não foi possível enviar a resposta. Tente novamente.')
        } finally {
            setEnviandoResposta(false)
        }
    }

    const cancelarResposta = () => {
        setComentarioRespondido(null)
        setTextoResposta('')
    }

    const renderAvatar = (fotoURL: string | null, username: string, classe: string) => (
        fotoURL ? (
            <img
                src={fotoURL}
                className={classe}
                alt={`Foto de ${username || 'usuária'}`}
            />
        ) : (
            <div className={`${classe} ${styles.avatarDefault}`}>
                <TbUser size={18} />
            </div>
        )
    )

    return (
        <section className={styles.secao} aria-label="Comentários da publicação">
            <header className={styles.header}>
                <h2>Comentários</h2>
                <span className={styles.contagem}>
                    {comentarios.reduce((total, comentario) => total + 1 + comentario.respostas.length, 0)}
                </span>
            </header>

            <div className={styles.listaComentarios}>
                {carregando ? (
                    <p className={styles.mensagemVazio}>Carregando comentários...</p>
                ) : comentarios.length === 0 ? (
                    <div className={styles.vazio}>
                        <p className={styles.mensagemVazio}>
                            Ainda não há comentários. Seja a primeira a comentar!
                        </p>
                    </div>
                ) : (
                    comentarios.map((comentario) => (
                        <div key={comentario.id} className={styles.thread}>
                            <div className={styles.comentario}>
                                {renderAvatar(
                                    comentario.authorPhotoURL,
                                    comentario.authorUsername,
                                    styles.avatar
                                )}

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
                                            type="button"
                                            className={styles.btnAcao}
                                            onClick={() => {
                                                setComentarioRespondido(
                                                    comentarioRespondido === comentario.id ? null : comentario.id
                                                )
                                                setTextoResposta('')
                                            }}
                                        >
                                            <TbCornerDownRight size={16} />
                                            <span>Responder</span>
                                        </button>
                                    </div>

                                    {comentarioRespondido === comentario.id && (
                                        <div className={styles.caixaResposta}>
                                            <span className={styles.respondendoLabel}>
                                                Respondendo a @{comentario.authorUsername}
                                                <button
                                                    type="button"
                                                    className={styles.btnCancelarResposta}
                                                    onClick={cancelarResposta}
                                                >
                                                    Cancelar
                                                </button>
                                            </span>

                                            <div className={styles.capsulaInput}>
                                                <textarea
                                                    className={styles.inputComentario}
                                                    rows={1}
                                                    maxLength={1000}
                                                    placeholder={`Responder a @${comentario.authorUsername || 'usuaria'}...`}
                                                    value={textoResposta}
                                                    onChange={(e) => setTextoResposta(e.target.value)}
                                                    disabled={enviandoResposta}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.btnEnviar}
                                                    onClick={() => enviarResposta(comentario)}
                                                    disabled={!textoResposta.trim() || enviandoResposta}
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
                                                    {renderAvatar(
                                                        resposta.authorPhotoURL,
                                                        resposta.authorUsername,
                                                        styles.avatarResposta
                                                    )}

                                                    <div className={styles.blocoComentario}>
                                                        <div className={styles.bolhaComentario}>
                                                            <div className={styles.linhaAutor}>
                                                                <span className={styles.nome}>
                                                                    {resposta.authorDisplayName || resposta.authorUsername || 'Usuária'}
                                                                </span>
                                                                <span className={styles.username}>@{resposta.authorUsername || 'usuaria'}</span>
                                                                <span className={styles.tempo}>{formatarTempo(resposta.createdAt)}</span>
                                                            </div>

                                                            <p className={styles.texto}>
                                                                {resposta.respostaParaUsername && (
                                                                    <span className={styles.mencao}>@{resposta.respostaParaUsername} </span>
                                                                )}
                                                                {resposta.text}
                                                            </p>
                                                        </div>
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
            {erro && <p className={styles.erroTexto} role="alert">{erro}</p>}

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
                        className={styles.inputComentario}
                        rows={1}
                        maxLength={1000}
                        placeholder="Escreva um comentário..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        disabled={enviando}
                    />

                    <button
                        type="button"
                        className={styles.btnEnviar}
                        onClick={enviarComentario}
                        disabled={enviando || !texto.trim()}
                        aria-label="Enviar comentário"
                    >
                        <TbSend size={20} />
                    </button>
                </div>
            </div>
        </section>
    )
}