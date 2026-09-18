import styles from "./Post.module.css";
import { TbStar, TbStarFilled, TbBookmark, TbBookmarkFilled, TbMessage, TbShare, TbDots, TbUser, TbEdit, TbTrash } from "react-icons/tb";
import { useState } from "react";
import badgeVerificado from '../../assets/img/verificado.png';
import { useCurtida } from "../../hooks/useCurtidas";
import { useAutenticacao } from "../../hooks/useAutenticacao";
import { usePublicacoes } from "../../hooks/usePublicacoes";
import { ModalEditarPostagem } from "../modais/ModalEditarPostagem";
import { ModalConfirmacao } from "../modais/ModalConfirmacao";
import { Link } from "react-router-dom";

interface PostProps {
    postId: string;
    authorId: string;
    avatarSrc?: string;
    nome: string;
    username: string;
    tempo: string;
    imagemUrl?: string | null;
    conteudo: string;
    curtidas: number;
    comentarios: number;
    compartilhamentos: number;
    verificado?: boolean;
    emblemaS?: boolean;
    emblemaT?: boolean;
    emblemaE?: boolean;
    emblemaM?: boolean;
}

export function Post({
    postId,
    authorId,
    avatarSrc,
    nome,
    username,
    tempo,
    imagemUrl,
    conteudo,
    curtidas,
    comentarios,
    compartilhamentos,
    verificado = false,
    emblemaS = false,
    emblemaT = false,
    emblemaE = false,
    emblemaM = false
}: PostProps) {

    const { curtido, alternarCurtida } = useCurtida(postId)
    const { usuario } = useAutenticacao()
    const { excluirPublicacao } = usePublicacoes()

    const [salvo, setSalvo] = useState(false)

    const [menuAberto, setMenuAberto] = useState(false)
    const [modalEditarAberto, setModalEditarAberto] = useState(false)
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
    const [excluindo, setExcluindo] = useState(false)

    const souAutor = usuario?.uid === authorId

    const excluir = async () => {
        setExcluindo(true)
        try {
            await excluirPublicacao(postId)
            setModalExcluirAberto(false)
        } catch (e) {
            console.error('Erro ao excluir publicação:', e)
        } finally {
            setExcluindo(false)
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Link to={`/${username}`}>
                    {avatarSrc ? (
                        <img src={avatarSrc} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarDefault}>
                            <TbUser size={28} />
                        </div>
                    )}
                </Link>


                <div className={styles.headerInfo}>
                    <div className={styles.nomeLinha}>
                        <h1 className={styles.nome}>{nome}</h1>

                        {verificado && <img src={badgeVerificado} className={styles.badgeVerificado} />}
                        {emblemaS && <span className={styles.badgeS}>s</span>}
                        {emblemaT && <span className={styles.badgeT}>t</span>}
                        {emblemaE && <span className={styles.badgeE}>e</span>}
                        {emblemaM && <span className={styles.badgeM}>m</span>}
                    </div>

                    <p className={styles.usernameLinha}>
                        @{username} • {tempo}
                    </p>
                </div>

                {souAutor && (
                    <div className={styles.menuContainer}>
                        <button
                            className={styles.menuBtn}
                            onClick={() => setMenuAberto((atual) => !atual)}
                            aria-label="Opções da publicação"
                        >
                            <TbDots />
                        </button>

                        {menuAberto && (
                            <>
                                <div
                                    className={styles.menuOverlay}
                                    onClick={() => setMenuAberto(false)}
                                />
                                <div className={styles.menuDropdown}>
                                    <button
                                        className={styles.menuItem}
                                        onClick={() => {
                                            setModalEditarAberto(true)
                                            setMenuAberto(false)
                                        }}
                                    >
                                        <TbEdit size={16} /> Editar
                                    </button>
                                    <button
                                        className={styles.menuItemExcluir}
                                        onClick={() => {
                                            setModalExcluirAberto(true)
                                            setMenuAberto(false)
                                        }}
                                    >
                                        <TbTrash size={16} /> Excluir
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <p className={styles.conteudo}>{conteudo}</p>

            {imagemUrl && (
            <img src={imagemUrl} className={styles.imagemPost} alt="Imagem do post" />
            )}

            <div className={styles.footer}>
                <div className={styles.acoes}>
                <button
                    className={styles.iconBtn}
                    onClick={alternarCurtida}
                    aria-label="Curtir"
                >
                    {curtido ? (
                    <TbStarFilled className={styles.iconFavorito} size={24}/>
                    ) : (
                    <TbStar className={styles.icon} size={24} />
                    )}
                    <span className={styles.numeros}>{curtidas}</span>
                </button>
                <span className={styles.acao}><TbMessage size={24}/> {comentarios}</span>
                <span className={styles.acao}><TbShare size={24}/> {compartilhamentos}</span>
                </div>

                <button
                className={styles.iconBtn}
                onClick={() => setSalvo(!salvo)}
                aria-label="Salvar"
                >
                {salvo ? (
                    <TbBookmarkFilled className={styles.iconSalvo} size={24}/>
                ) : (
                    <TbBookmark className={styles.icon} size={24}/>
                )}
                </button>
            </div>

            <ModalEditarPostagem
                aberto={modalEditarAberto}
                postId={postId}
                conteudoAtual={conteudo}
                imagemUrl={imagemUrl}
                fechar={() => setModalEditarAberto(false)}
            />

            <ModalConfirmacao
                aberto={modalExcluirAberto}
                titulo="Excluir publicação"
                mensagem="Tem certeza que deseja excluir esta publicação? Essa ação não pode ser desfeita."
                confirmando={excluindo}
                confirmar={excluir}
                cancelar={() => setModalExcluirAberto(false)}
            />
        </div>
    );
}