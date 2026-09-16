import { useState, useRef } from 'react'
import styles from './ModalPostagem.module.css'
import { TbUser, TbPhotoPlus, TbMoodSmile, TbSettings, TbX } from "react-icons/tb";
import { usePublicacoes } from '../../hooks/usePublicacoes'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'
import type { EmojiClickData } from 'emoji-picker-react'

type ModalPostagemProps = {
    aberto: boolean;
    fechar: () => void;
};

export function ModalPostagem({ aberto, fechar }: ModalPostagemProps) {
    const { usuario } = useAutenticacao()
    const { criarPublicacao } = usePublicacoes()

    const [texto, setTexto] = useState('')
    const [arquivoImagem, setArquivoImagem] = useState<File | null>(null)
    const [previewImagem, setPreviewImagem] = useState<string | null>(null)
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState('')

    const inputImagemRef = useRef<HTMLInputElement>(null)

    const [pickerEmojiAberto, setPickerEmojiAberto] = useState(false)

    const aoSelecionarEmoji = (emojiData: EmojiClickData) => {
        setTexto((atual) => atual + emojiData.emoji)
    }

    if (!aberto) return null

    const limparEFechar = () => {
        setTexto('')
        setArquivoImagem(null)
        setPreviewImagem(null)
        setErro('')
        setPickerEmojiAberto(false)
        fechar()
    }

    const aoSelecionarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0]
        if (!arquivo) return

        setArquivoImagem(arquivo)
        setPreviewImagem(URL.createObjectURL(arquivo))
    }

    const removerImagem = () => {
        setArquivoImagem(null)
        setPreviewImagem(null)
        if (inputImagemRef.current) inputImagemRef.current.value = ''
    }

    const aoPostar = async () => {
        if (!texto.trim() && !arquivoImagem) {
            setErro('Escreva algo ou selecione uma imagem antes de postar.')
            return
        }

        setEnviando(true)
        setErro('')

        try {
            await criarPublicacao(texto.trim(), arquivoImagem ?? undefined)
            limparEFechar()
        } catch (e) {
            setErro('Não foi possível criar a publicação. Tente novamente.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className={styles.modalOverlay} onClick={limparEFechar}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <main>
                    {usuario?.photoURL ? (
                        <img src={usuario.photoURL} className={styles.avatarUsuario} />
                    ) : (
                        <TbUser size={24} className={styles.iconPerfil} />
                    )}

                    <div className={styles.containerInput}>
                        <span>{usuario?.nome ?? usuario?.username ?? 'Usuário'}</span>
                        <textarea
                            className={styles.inputPostagem}
                            name="conteudoPostagem"
                            id="conteudoPostagem"
                            rows={4}
                            cols={75}
                            maxLength={300}
                            placeholder='O que você está pensando?'
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            disabled={enviando}
                        />

                        {previewImagem && (
                            <div className={styles.previewContainer}>
                                <img src={previewImagem} className={styles.previewImagem} />
                                <button
                                    type="button"
                                    className={styles.removerImagemBtn}
                                    onClick={removerImagem}
                                    aria-label="Remover imagem"
                                >
                                    <TbX size={16} />
                                </button>
                            </div>
                        )}

                        {erro && <p className={styles.erroTexto}>{erro}</p>}
                    </div>
                </main>

                <div className={styles.containerAcoes}>
                    <div className={styles.acoesPostagem}>
                        <label htmlFor="inputImagemPostagem">
                            <TbPhotoPlus size={24} className={styles.acao} style={{ cursor: 'pointer' }} />
                        </label>
                        <input
                            ref={inputImagemRef}
                            id="inputImagemPostagem"
                            type="file"
                            accept="image/*"
                            onChange={aoSelecionarImagem}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.acaoEmoji}>
                            <TbMoodSmile
                                size={24}
                                className={styles.acao}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setPickerEmojiAberto((atual) => !atual)}
                                aria-label="Adicionar emoji"
                            />
                            {pickerEmojiAberto && (
                                <div className={styles.emojiPickerContainer}>
                                    <EmojiPicker
                                        onEmojiClick={aoSelecionarEmoji}
                                        theme={Theme.LIGHT}
                                        emojiStyle={EmojiStyle.NATIVE}
                                        autoFocusSearch={false}
                                        searchPlaceholder="Buscar emoji..."
                                        previewConfig={{ showPreview: false }}
                                        width={380}
                                        height={320}
                                        lazyLoadEmojis
                                    />
                                </div>
                            )}
                        </div>
                        <TbSettings size={24} className={styles.acao} />
                    </div>
                    <div className={styles.btnsPostagem}>
                        <button className={styles.btnCancelar} onClick={limparEFechar} disabled={enviando}>
                            Cancelar
                        </button>
                        <button className={styles.btnPostar} onClick={aoPostar} disabled={enviando}>
                            {enviando ? 'Postando...' : 'Postar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}