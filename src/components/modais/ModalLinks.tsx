import { useState, useEffect } from 'react'
import styles from './ModalLinks.module.css'
import type { IconType } from 'react-icons'
import {
    TbX,
    TbBrandGithub,
    TbBrandLinkedin,
    TbLink,
    TbExternalLink,
    TbMoodEmpty,
} from 'react-icons/tb'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import type { LinksPerfil, LinkLivre } from '../../types/Usuario'

const PREFIXO_GITHUB = 'https://github.com/'
const PREFIXO_LINKEDIN = 'https://www.linkedin.com/in/'
const QTD_LINKS_LIVRES = 3

type ModalLinksProps = {
    aberto: boolean
    fechar: () => void
    links?: LinksPerfil
    ehMeuPerfil: boolean
}

// ve se o link é um https válido (pra evitar ir pra outro tipo de 
// site, arquivo e afins)
function ehLinkHttps(valor: string) {
    try {
        return new URL(valor).protocol === 'https:'
    } catch {
        return false
    }
}

function linksLivres(links?: LinksPerfil): LinkLivre[] {
    const salvos = links?.outros ?? []
    return Array.from({ length: QTD_LINKS_LIVRES }, (_, i) => ({
        titulo: salvos[i]?.titulo ?? '',
        url: salvos[i]?.url ?? '',
    }))
}

export function ModalLinks({ aberto, fechar, links, ehMeuPerfil }: ModalLinksProps) {
    const { atualizarLinks } = useAutenticacao()

    const [github, setGithub] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [livres, setLivres] = useState<LinkLivre[]>(linksLivres())
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState('')

    // vai mostrar os links que a pessoa já colocou no modal
    useEffect(() => {
        if (aberto) {
            setGithub(links?.github ?? '')
            setLinkedin(links?.linkedin ?? '')
            setLivres(linksLivres(links))
            setErro('')
        }
    }, [aberto])

    if (!aberto) return null

    // vai posicionar o link livre no campo certo que o user colocar
    // (ex: colocou no link livre 2, vai ficar lá e não vai ir pro livre 1)
    const alterarLivre = (indice: number, campo: keyof LinkLivre, valor: string) => {
        setLivres((atuais) =>
            atuais.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item))
        )
    }

    const validar = (): string => {
        const gh = github.trim()
        const li = linkedin.trim()

        // ve se os links estão com o prefixo certo e completos e 
        // completos (com o mínimo de caracteres)
        if (gh && (!gh.startsWith(PREFIXO_GITHUB) || gh.length === PREFIXO_GITHUB.length)) {
            return `O link do GitHub deve começar com ${PREFIXO_GITHUB} e conter seu usuário.`
        }

        if (li && (!li.startsWith(PREFIXO_LINKEDIN) || li.length === PREFIXO_LINKEDIN.length)) {
            return `O link do LinkedIn deve começar com ${PREFIXO_LINKEDIN} e conter seu perfil.`
        }

        for (let i = 0; i < livres.length; i++) {
            const titulo = livres[i].titulo.trim()
            const url = livres[i].url.trim()

            if (!titulo && !url) continue

            if (!titulo) return `Link livre ${i + 1}: informe um título.`
            if (!url) return `Link livre ${i + 1}: informe o endereço do link.`
            if (!ehLinkHttps(url)) return `Link livre ${i + 1}: o link deve começar com https://`
        }

        return ''
    }

    const salvar = async () => {
        const mensagemErro = validar()
        if (mensagemErro) {
            setErro(mensagemErro)
            return
        }

        setSalvando(true)
        setErro('')

        const outros = livres
            .map((item) => ({ titulo: item.titulo.trim(), url: item.url.trim() }))
            .filter((item) => item.titulo && item.url)

        const retorno = await atualizarLinks({
            github: github.trim(),
            linkedin: linkedin.trim(),
            outros,
        })

        setSalvando(false)

        if (retorno !== 'sucesso') {
            setErro(retorno)
            return
        }

        fechar()
    }

    // lista q vai ser mostrada pros outros usuários
    const itensVisiveis: { chave: string; titulo: string; url: string; icon: IconType }[] = []

    if (links?.github) {
        itensVisiveis.push({ chave: 'github', titulo: 'GitHub', url: links.github, icon: TbBrandGithub })
    }
    if (links?.linkedin) {
        itensVisiveis.push({ chave: 'linkedin', titulo: 'LinkedIn', url: links.linkedin, icon: TbBrandLinkedin })
    }
    links?.outros?.forEach((item, i) => {
        if (item.titulo && item.url) {
            itensVisiveis.push({ chave: `outro-${i}`, titulo: item.titulo, url: item.url, icon: TbLink })
        }
    })

    return (
        <div className={styles.modalOverlay} onClick={fechar}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.cabecalho}>
                    <h2>{ehMeuPerfil ? 'Editar links' : 'Links'}</h2>
                    <button className={styles.btnFechar} onClick={fechar} aria-label="Fechar">
                        <TbX size={20} className={styles.btnFecharIcon} />
                    </button>
                </div>

                {ehMeuPerfil ? (
                    <>
                        <div className={styles.formulario}>
                            <div className={styles.campo}>
                                <label htmlFor="linkGithub">
                                    <TbBrandGithub size={18} />
                                    GitHub
                                </label>
                                <input
                                id="linkGithub"
                                type="url"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                disabled={salvando}
                                placeholder={`${PREFIXO_GITHUB}seu-perfil`}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="linkLinkedin">
                                    <TbBrandLinkedin size={18} />
                                    LinkedIn
                                </label>
                                <input
                                id="linkLinkedin"
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                disabled={salvando}
                                placeholder={`${PREFIXO_LINKEDIN}seu-perfil`}
                                />
                            </div>

                            <div className={styles.divisor}>
                                <span>Outros links</span>
                            </div>

                            {livres.map((item, i) => (
                                <div key={i} className={styles.linkLivre}>
                                    <label htmlFor="linkLivre">
                                        <div className={ styles.estrela } />
                                        {`Link livre ${i + 1}`}
                                    </label>
                                    <input
                                    type="text"
                                    className={styles.inputTitulo}
                                    value={item.titulo}
                                    onChange={(e) => alterarLivre(i, 'titulo', e.target.value)}
                                    disabled={salvando}
                                    maxLength={30}
                                    placeholder="Título"
                                    aria-label={`Título do link livre ${i + 1}`}
                                    />
                                    <input
                                    type="url"
                                    value={item.url}
                                    onChange={(e) => alterarLivre(i, 'url', e.target.value)}
                                    disabled={salvando}
                                    placeholder="https://..."
                                    aria-label={`Endereço do link livre ${i + 1}`}
                                    />
                                </div>
                            ))}

                            <span className={styles.desc}>
                                Deixe um campo vazio para remover o link. :)
                            </span>

                            {erro && <p className={styles.erroTexto}>{erro}</p>}
                        </div>

                        <div className={styles.acoes}>
                            <button className={styles.btnCancelar} onClick={fechar} disabled={salvando}>
                                Cancelar
                            </button>
                            <button className={styles.btnSalvar} onClick={salvar} disabled={salvando}>
                                {salvando ? 'Salvando...' : 'Salvar links'}
                            </button>
                        </div>
                    </>
                ) : itensVisiveis.length === 0 ? (
                    <div className={styles.vazio}>
                        <TbMoodEmpty size={48} />
                        <p>Poxa! Parece que não tem links aqui.</p>
                    </div>
                ) : (
                    <ul className={styles.listaLinks}>
                        {itensVisiveis.map(({ chave, titulo, url, icon: Icon }) => (
                            <li key={chave}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.itemLink}
                                >
                                    <Icon size={22} />
                                    <span className={styles.itemTitulo}>{titulo}</span>
                                    <TbExternalLink size={18} className={styles.iconExterno} />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}