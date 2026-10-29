import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { TbX } from 'react-icons/tb'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { criarArtigo } from '../hooks/useArtigos'
import { enviarImagem } from '../services/uploadImagem'
import { ChipClicavel } from '../components/misc/ChipClicavel'
import styles from './NovoArtigo.module.css'

const CATEGORIAS = [
    'Ciência',
    'Tecnologia',
    'Engenharia',
    'Matemática',
    'Questões de Gênero',
]

export function NovoArtigo() {
    const { usuario } = useAutenticacao()
    const navegacao = useNavigate()

    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [categorias, setCategorias] = useState<string[]>([])
    const [destaque, setDestaque] = useState(false)
    const [imagem, setImagem] = useState<File | null>(null)
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState('')
    const [previewImagem, setPreviewImagem] = useState<string | null>(null)
    const inputImagemRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        return () => {
            if (previewImagem) {
                URL.revokeObjectURL(previewImagem)
            }
        }
    }, [previewImagem])

    if (!usuario?.admin) {
        return <Navigate to="/forum" replace />
    }

    const alternarCategoria = (categoria: string) => {
        setCategorias((atuais) =>
            atuais.includes(categoria)
                ? atuais.filter((item) => item !== categoria)
                : [...atuais, categoria]
        )
    }

    const aoSelecionarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0]

        if (!arquivo) return

        setImagem(arquivo)
        setPreviewImagem(URL.createObjectURL(arquivo))
        setErro('')
    }

    const removerImagem = () => {
        setImagem(null)
        setPreviewImagem(null)

        if (inputImagemRef.current) {
            inputImagemRef.current.value = ''
        }
    }

    const publicar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (
            !titulo.trim() ||
            !descricao.trim() ||
            !conteudo.trim() ||
            !imagem ||
            categorias.length === 0
        ) {
            setErro(
                'Preencha tudo, escolha ao menos uma categoria e uma imagem de capa.'
            )
            return
        }

        setEnviando(true)
        setErro('')

        try {
            const imagemURL = await enviarImagem(imagem)

            const id = await criarArtigo({
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                conteudo: conteudo.trim(),
                imagemURL,
                categorias,
                destaque,
            })

            navegacao(`/blog/${id}`)
        } catch {
            setErro('Não foi possível publicar o artigo. Tente novamente.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className={styles.pagina}>
            <div className={styles.conteudo}>
                <header className={styles.cabecalho}>
                    <h3 className={styles.sobretitulo}>
                        <span>MARILACE</span> / ARTIGOS / NOVO
                    </h3>
                    <h1>Novo artigo<span>.</span></h1>
                </header>

                <form className={styles.formulario} onSubmit={publicar}>
                    <div className={styles.gradeFormulario }>
                        <section className={`${styles.painel} ${styles.painelInformacoes}`}>
                            <div className={styles.tituloPainel}>
                                <h2>Informações do artigo</h2>
                                <p>
                                    Preencha os dados que serão apresentados no blog.
                                </p>
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="titulo">Título do artigo</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    placeholder="Ex.: Mulheres que transformaram a tecnologia"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    maxLength={120}
                                    required
                                />
                                <span className={styles.ajuda}>
                                    Máximo de 120 caracteres.
                                </span>
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="descricao">Descrição curta</label>
                                <input
                                    id="descricao"
                                    type="text"
                                    placeholder="Resuma o assunto do artigo em poucas palavras"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    maxLength={200}
                                    required
                                />
                                <span className={styles.ajuda}>
                                    Máximo de 200 caracteres.
                                </span>
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="conteudo">Conteúdo do artigo</label>
                                <textarea
                                    id="conteudo"
                                    placeholder="Escreva o conteúdo completo do artigo..."
                                    rows={14}
                                    value={conteudo}
                                    onChange={(e) => setConteudo(e.target.value)}
                                    required
                                />
                            </div>
                        </section>

                        <div className={ styles.lateralGrade }>
                            <section className={styles.painel}>
                                <h2 className={styles.tituloPainel}>Imagem de capa</h2>

                                <div className={styles.campoImagem}>
                                    <input
                                        ref={inputImagemRef}
                                        id="imagem"
                                        type="file"
                                        accept="image/*"
                                        onChange={aoSelecionarImagem}
                                        className={styles.upload}
                                        required={!imagem}
                                        disabled={enviando}
                                    />

                                    {previewImagem && (
                                        <div className={styles.previewContainer}>
                                            <img
                                                src={previewImagem}
                                                alt="Pré-visualização da imagem de capa"
                                                className={styles.previewImagem}
                                            />

                                            <button
                                                type="button"
                                                className={styles.removerImagemBtn}
                                                onClick={removerImagem}
                                                aria-label="Remover imagem de capa"
                                                disabled={enviando}
                                            >
                                                <TbX size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className={styles.painel}>
                                <div className={styles.tituloPainel}>
                                    <h2>Categorias</h2>
                                    <p>
                                        Selecione uma ou mais categorias para organizar
                                        o artigo.
                                    </p>
                                </div>

                                <div
                                    className={styles.selecaoCategorias}
                                    aria-label="Categorias do artigo"
                                >
                                    {CATEGORIAS.map((categoria) => (
                                        <ChipClicavel
                                            key={categoria}
                                            texto={categoria}
                                            cor="var(--primaria)"
                                            selecionado={categorias.includes(categoria)}
                                            onClick={() => alternarCategoria(categoria)}
                                        />
                                    ))}
                                </div>
                            </section>

                            <section className={styles.painel}>
                                <div className={styles.tituloPainel}>
                                    <h2>Opções de publicação</h2>
                                    <p>
                                        Defina se o artigo será destacado no blog.
                                    </p>
                                </div>

                                <label className={styles.opcaoDestaque}>
                                    <input
                                        type="checkbox"
                                        checked={destaque}
                                        onChange={(e) => setDestaque(e.target.checked)}
                                    />

                                    <span className={styles.textoDestaque}>
                                        <strong>Destaque da semana</strong>
                                        <span>
                                            Marque esta opção para destacar o artigo
                                            conforme as regras de exibição do blog.
                                        </span>
                                    </span>
                                </label>
                            </section>
                        </div>
                    </div>

                    {erro && (
                        <p className={styles.erro} role="alert">
                            {erro}
                        </p>
                    )}

                    <div className={styles.acoes}>
                        <button
                            className={styles.botaoPublicar}
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? 'Publicando...' : 'Publicar artigo'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}