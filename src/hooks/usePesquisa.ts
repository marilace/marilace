import { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { formatarTexto } from '../utils/formatarTexto'
import { artigosExemplo } from '../utils/artigosExemplo'
import { oportunidadesExemplo } from '../utils/oportunidadesExemplo'
import { type UsuarioTipo } from '../types/Usuario'
import { type PublicacaoTipo } from '../types/Publicacao'
import { type ArtigoTipo } from '../types/Artigo'
import { type OportunidadeTipo } from '../types/Oportunidade'

const TAMANHO_MINIMO = 2
const VALIDADE_CACHE_MS = 60_000
const LIMITE_USUARIOS = 300
const LIMITE_POSTS = 150

export type ResultadoPesquisa = {
    usuarios: UsuarioTipo[]
    publicacoes: PublicacaoTipo[]
    artigos: ArtigoTipo[]
    oportunidades: OportunidadeTipo[]
}

const VAZIO: ResultadoPesquisa = { usuarios: [], publicacoes: [], artigos: [], oportunidades: [] }

// cache simples p/ evitar reler o firestore a cada letra digitada
const cache = new Map<string, { em: number; dados: unknown[] }>()

async function comCache<T>(chave: string, carregar: () => Promise<T[]>): Promise<T[]> {
    const guardado = cache.get(chave)
    if (guardado && Date.now() - guardado.em < VALIDADE_CACHE_MS) {
        return guardado.dados as T[]
    }
    const dados = await carregar()
    cache.set(chave, { em: Date.now(), dados })
    return dados
}

const carregarUsuarios = () =>
    comCache<UsuarioTipo>('usuarios', async () => {
        const snap = await getDocs(query(collection(banco, 'users'), limit(LIMITE_USUARIOS)))
        return snap.docs.map((d) => {
            const dados = d.data()
            return {
                uid: d.id,
                username: dados.username,
                nome: dados.displayName,
                bio: dados.bio,
                photoURL: dados.photoURL,
                emblemas: dados.emblemas ?? [],
            } as UsuarioTipo
        })
    })

const carregarPublicacoes = () =>
    comCache<PublicacaoTipo>('posts', async () => {
        const snap = await getDocs(
            query(collection(banco, 'posts'), orderBy('createdAt', 'desc'), limit(LIMITE_POSTS))
        )
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PublicacaoTipo)
    })

// mesma coisa do blog, se não tem artigos no banco, usa os de exemplo
const carregarArtigos = () =>
    comCache<ArtigoTipo>('artigos', async () => {
        const snap = await getDocs(collection(banco, 'artigos'))
        if (snap.empty) return artigosExemplo
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ArtigoTipo)
    })

// todas as palavras digitadas precisam aparecer em algum lugar do texto
function contemTodas(campos: (string | undefined)[], partes: string[]): boolean {
    const texto = formatarTexto(campos.filter(Boolean).join(' '))
    return partes.every((parte) => texto.includes(parte))
}

// 0 = username começa com o termo,
// 1 = nome começa com o termo,
// 2 = só tem o termo em algum lugar
function pontuarUsuario(usuario: UsuarioTipo, termo: string): number {
    if (formatarTexto(usuario.username ?? '').startsWith(termo)) return 0
    if (formatarTexto(usuario.nome ?? '').startsWith(termo)) return 1
    return 2
}

function useDebounce<T>(valor: T, atrasoMs: number): T {
    const [debounced, setDebounced] = useState(valor)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(valor), atrasoMs)
        return () => clearTimeout(timer)
    }, [valor, atrasoMs])

    return debounced
}

export function usePesquisa(termoBruto: string, atrasoMs = 300) {
    const termo = useDebounce(termoBruto, atrasoMs)
    const termoNormalizado = formatarTexto(termo)
    const termoValido = termoNormalizado.length >= TAMANHO_MINIMO

    const [resultado, setResultado] = useState<ResultadoPesquisa>(VAZIO)
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        if (!termoValido) {
            setResultado(VAZIO)
            setCarregando(false)
            return
        }

        let cancelado = false // descarta respostas de pesquisas antigas
        setCarregando(true)

        const partes = termoNormalizado.split(/\s+/)

        const pesquisar = async () => {
            try {
                const [usuarios, publicacoes, artigos] = await Promise.all([
                    carregarUsuarios(),
                    carregarPublicacoes(),
                    carregarArtigos(),
                ])

                if (cancelado) return

                setResultado({
                    usuarios: usuarios
                        .filter((u) => contemTodas([u.username, u.nome], partes))
                        .sort((a, b) => pontuarUsuario(a, termoNormalizado) - pontuarUsuario(b, termoNormalizado)),
                    publicacoes: publicacoes.filter((p) =>
                        contemTodas([p.text, p.authorDisplayName, p.authorUsername], partes)
                    ),
                    artigos: artigos.filter((a) =>
                        contemTodas([a.titulo, a.descricao, ...(a.categorias ?? [])], partes)
                    ),
                    oportunidades: oportunidadesExemplo.filter((o) =>
                        contemTodas([o.titulo, o.instituicao, o.descricao, o.categoria, ...o.tags], partes)
                    ),
                })
            } catch (erro) {
                console.error('Erro ao realizar a pesquisa:', erro)
                if (!cancelado) setResultado(VAZIO)
            } finally {
                if (!cancelado) setCarregando(false)
            }
        }

        pesquisar()

        return () => {
            cancelado = true
        }
    }, [termoNormalizado, termoValido])

    return { ...resultado, carregando, termoValido }
}