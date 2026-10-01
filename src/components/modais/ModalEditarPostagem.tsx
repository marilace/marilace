import { useState, useEffect } from 'react'
import styles from './ModalEditarPostagem.module.css'
import { TbUser } from "react-icons/tb"
import { usePublicacoes } from '../../hooks/usePublicacoes'
import { useAutenticacao } from '../../hooks/useAutenticacao'

type ModalEditarPostagemProps = {
    aberto: boolean;
    postId: string;
    conteudoAtual: string;
    imagemUrl?: string | null;
    fechar: () => void;
};

export function ModalEditarPostagem({ aberto, postId, conteudoAtual, imagemUrl, fechar }: ModalEditarPostagemProps) {
    const { usuario } = useAutenticacao()
    const { editarPublicacao } = usePublicacoes()

    const [texto, setTexto] = useState(conteudoAtual)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState('')

    useEffect(() => {
        if (aberto) {
            setTexto(conteudoAtual)
            setErro('')
        }
    }, [aberto, conteudoAtual])

    if (!aberto) return null

    const salvar = async () => {
        if (!texto.trim()) {
            setErro('A publicação não pode ficar vazia.')
            return
        }

        setSalvando(true)
        setErro('')

        try {
            await editarPublicacao(postId, texto.trim())
            fechar()
        } catch (e) {
            setErro('Não foi possível salvar as alterações. Tente novamente.')
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={fechar}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.conteudo}>
                    {usuario?.photoURL ? (
                        <img src={usuario.photoURL} className={styles.avatarUsuario} alt="Foto de perfil" />
                    ) : (
                        <TbUser size={24} className={styles.iconPerfil} />
                    )}

                    <div className={styles.containerInput}>
                        <span>{usuario?.nome ?? usuario?.username ?? 'Usuário'}</span>
                        <textarea
                            className={styles.inputEdicao}
                            rows={4}
                            maxLength={300}
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            disabled={salvando}
                            placeholder='O que você está pensando?'
                            autoFocus
                        />

                        {imagemUrl && (
                            <div className={styles.previewContainer}>
                                <img src={imagemUrl} className={styles.previewImagem} alt="Imagem da publicação" />
                            </div>
                        )}

                        {erro && <p className={styles.erroTexto}>{erro}</p>}
                    </div>
                </div>

                <div className={styles.containerAcoes}>
                    <span className={styles.contador}>{texto.length}/300</span>
                    <div className={styles.btnsEdicao}>
                        <button className={styles.btnCancelar} onClick={fechar} disabled={salvando}>
                            Cancelar
                        </button>
                        <button className={styles.btnSalvar} onClick={salvar} disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}