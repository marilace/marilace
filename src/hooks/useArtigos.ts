import { useEffect, useState } from 'react'
import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { type ArtigoTipo } from '../types/Artigo'

// Busca todos os artigos do blog, do mais recente para o mais antigo
export function useArtigos() {
    const [artigos, setArtigos] = useState<ArtigoTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const q = query(
            collection(banco, 'artigos'),
            orderBy('createdAt', 'desc')
        )

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ArtigoTipo)
                setArtigos(lista)
                setCarregando(false)
            },
            (erro) => {
                console.error('Erro ao buscar artigos:', erro)
                setCarregando(false)
            }
        )

        return () => unsubscribe()
    }, [])

    return { artigos, carregando }
}

// Cadastra um novo artigo no Firestore.
// Ainda não existe uma tela de administração, então por enquanto essa função
// pode ser chamada manualmente (ex: pelo console do navegador, logada como
// usuária autenticada) até que um painel de gestão de conteúdo seja criado.
export async function criarArtigo(dados: {
    titulo: string
    descricao: string
    conteudo?: string
    imagemURL: string
    categorias: string[]
    destaque?: boolean
}): Promise<string> {
    const artigoRef = await addDoc(collection(banco, 'artigos'), {
        titulo: dados.titulo,
        descricao: dados.descricao,
        conteudo: dados.conteudo ?? '',
        imagemURL: dados.imagemURL,
        categorias: dados.categorias,
        destaque: dados.destaque ?? false,
        createdAt: serverTimestamp()
    })

    return artigoRef.id
}