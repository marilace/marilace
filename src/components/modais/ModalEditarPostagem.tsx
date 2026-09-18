import { useState, useEffect } from 'react'
import styles from './ModalEditarPostagem.module.css'
import { TbX } from "react-icons/tb"
import { usePublicacoes } from '../../hooks/usePublicacoes'

type ModalEditarPostagemProps = {
    aberto: boolean;
    postId: string;
    conteudoAtual: string;
    imagemUrl?: string | null;
    fechar: () => void;
};

export function ModalEditarPostagem({ aberto, postId, conteudoAtual, imagemUrl, fechar }: ModalEditarPostagemProps) {
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
                <div className={styles.cabecalho}>
                    <h2>Editar publicação</h2>
                    <button className={styles.btnFechar} onClick={fechar} aria-label="Fechar">
                        <TbX size={20} className={styles.btnFecharIcon} />
                    </button>
                </div>

                <textarea
                    className={styles.inputEdicao}
                    rows={5}
                    maxLength={300}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    disabled={salvando}
                    placeholder='O que você está pensando?'
                    autoFocus
                />
                <span className={styles.contador}>{texto.length}/300</span>

                {imagemUrl && (
                    <div className={styles.previewContainer}>
                        <img src={imagemUrl} className={styles.previewImagem} alt="Imagem da publicação" />
                    </div>
                )}

                {erro && <p className={styles.erroTexto}>{erro}</p>}

                <div className={styles.acoes}>
                    <button className={styles.btnCancelar} onClick={fechar} disabled={salvando}>
                        Cancelar
                    </button>
                    <button className={styles.btnSalvar} onClick={salvar} disabled={salvando}>
                        {salvando ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                </div>
            </div>
        </div>
    )
}