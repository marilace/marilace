import { useState, useRef, useEffect } from 'react'
import styles from './ModalEditarPerfil.module.css'
import { TbUser, TbCamera, TbX, TbAt } from 'react-icons/tb'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { EMBLEMAS_DISPONIVEIS } from '../../types/Emblemas'
import { ChipClicavel } from '../misc/ChipClicavel'

type ModalEditarPerfilProps = {
    aberto: boolean
    fechar: () => void
}

export function ModalEditarPerfil({ aberto, fechar }: ModalEditarPerfilProps) {
    const { usuario, atualizarPerfil, atualizarFotoPerfil, alterarUsername } = useAutenticacao()

    const [displayName, setDisplayName] = useState('')
    const [username, setUsername] = useState('')
    const [bio, setBio] = useState('')
    const [emblemas, setEmblemas] = useState<string[]>([])

    const [arquivoFoto, setArquivoFoto] = useState<File | null>(null)
    const [previewFoto, setPreviewFoto] = useState<string | null>(null)

    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState('')

    const inputFotoRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (aberto && usuario) {
            setDisplayName(usuario.nome ?? '')
            setUsername(usuario.username ?? '')
            setBio(usuario.bio ?? '')
            setEmblemas(usuario.emblemas ?? [])
            setArquivoFoto(null)
            setPreviewFoto(null)
            setErro('')
        }
    }, [aberto, usuario])

    if (!aberto) return null

    const toggleEmblema = (id: string) => {
    setEmblemas((atuais) =>
        atuais.includes(id)
            ? atuais.filter((emblemaId) => emblemaId !== id)
            : [...atuais, id]
    )
}

    const aoSelecionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivo = e.target.files?.[0]
        if (!arquivo) return
        setArquivoFoto(arquivo)
        setPreviewFoto(URL.createObjectURL(arquivo))
    }

    const salvar = async () => {
        if (!displayName.trim()) {
            setErro('O nome não pode ficar vazio.')
            return
        }
        if (!username.trim()) {
            setErro('O nome de usuário não pode ficar vazio.')
            return
        }

        setSalvando(true)
        setErro('')

        try {
            // 1. Foto
            if (arquivoFoto) {
                const retornoFoto = await atualizarFotoPerfil(arquivoFoto)
                if (retornoFoto !== 'sucesso') {
                setErro(retornoFoto)
                setSalvando(false)
                return
                }
            }
            // 2. Username
            const usernameFormatado = username.toLowerCase().trim()
            if (usernameFormatado !== usuario?.username) {
                const retornoUsername = await alterarUsername(usernameFormatado)
                if (retornoUsername !== 'sucesso') {
                    setErro(retornoUsername)
                    setSalvando(false)
                    return
                }
            }

            // 3. Dados de texto
            const retornoPerfil = await atualizarPerfil({
                displayName: displayName.trim(),
                bio: bio.trim(),
                emblemas,
            })
            if (retornoPerfil !== 'sucesso') {
                setErro(retornoPerfil)
                setSalvando(false)
                return
            }

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
                    <h2>Editar perfil</h2>
                    <button className={styles.btnFechar} onClick={fechar} aria-label="Fechar">
                        <TbX size={20} className={styles.btnFecharIcon} />
                    </button>
                </div>

                <div className={styles.containerFoto}>
                    <div className={styles.avatarWrapper}>
                        {previewFoto || usuario?.photoURL ? (
                            <img
                                src={previewFoto ?? usuario?.photoURL}
                                className={styles.avatar}
                                alt="Foto de perfil"
                            />
                        ) : (
                            <div className={styles.avatarPadrao}>
                                <TbUser size={40} />
                            </div>
                        )}

                        <label htmlFor="inputFotoPerfil" className={styles.btnTrocarFoto}>
                            <TbCamera size={16} />
                        </label>
                        <input
                        ref={inputFotoRef}
                            id="inputFotoPerfil"
                            type="file"
                            accept="image/*"
                            onChange={aoSelecionarFoto}
                            style={{ display: 'none' }}
                            />
                    </div>
                </div>

                <div className={styles.formulario}>
                    <div className={styles.campo}>
                        <label htmlFor="displayName">
                            <div className={ styles.estrela } />
                            Nome
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            disabled={salvando}
                            maxLength={50}
                        />
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="username">
                            <div className={ styles.estrela } />
                            Nome de usuário
                        </label>
                        <div className={styles.inputComPrefixo}>
                            <TbAt className={ styles.iconInput } />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={salvando}
                                maxLength={30}
                            />
                        </div>
                    </div>

                    <div className={styles.campo}>
                        <label htmlFor="bio">
                            <div className={ styles.estrela } />
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={salvando}
                            rows={3}
                            maxLength={160}
                            placeholder="Conte um pouco sobre você..."
                        />
                        <span className={styles.contador}>{bio.length}/160</span>
                    </div>

                    <div className={styles.campo}>
                        <label>
                            <div className={ styles.estrela } />
                            Áreas de interesse
                        </label>
                        <div className={styles.listaChips}>
                            {EMBLEMAS_DISPONIVEIS.map((emblema) => (
                                <ChipClicavel
                                    key={emblema.id}
                                    texto={emblema.texto}
                                    cor={emblema.cor}
                                    selecionado={emblemas.includes(emblema.id)}
                                    onClick={() => !salvando && toggleEmblema(emblema.id)}
                                />
                            ))}
                        </div>
                        <span className={ styles.desc }>
                            As áreas escolhidas aparecem como emblemas do lado do seu nome! :)
                        </span>
                    </div>

                {   erro && <p className={styles.erroTexto}>{erro}</p>}
                </div>

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