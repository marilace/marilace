import { useEffect, useState } from 'react'
import {
    collection,
    addDoc,
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { useAutenticacao } from './useAutenticacao'
import { criarNotificacao } from '../services/Notificacoes'
import { type ComentarioTipo, type ComentarioComRespostas } from '../types/Comentario'

// Observa em tempo real os comentários de um post (posts/{postId}/comments)
// e já organiza em árvore: comentários de topo, cada um com suas respostas
// (respostas a respostas caem como irmãs do comentário de topo, estilo Twitter).
export function useComentarios(postId: string | undefined) {
    const [comentarios, setComentarios] = useState<ComentarioComRespostas[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!postId) {
            setComentarios([])
            setCarregando(false)
            return
        }

        setCarregando(true)

        const q = query(
            collection(banco, 'posts', postId, 'comments'),
            orderBy('createdAt', 'asc')
        )

        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const lista = snap.docs.map((d) => ({
                    id: d.id,
                    likesCount: 0,
                    parentId: null,
                    ...d.data(),
                }) as ComentarioTipo)

                const principais = lista.filter((c) => !c.parentId)

                const respostasPorPai = new Map<string, ComentarioTipo[]>()
                lista.forEach((c) => {
                    if (!c.parentId) return
                    const atuais = respostasPorPai.get(c.parentId) ?? []
                    atuais.push(c)
                    respostasPorPai.set(c.parentId, atuais)
                })

                const arvore: ComentarioComRespostas[] = principais.map((c) => ({
                    ...c,
                    respostas: respostasPorPai.get(c.id) ?? []
                }))

                setComentarios(arvore)
                setCarregando(false)
            },
            (erro) => {
                console.error('Erro ao buscar comentários:', erro)
                setCarregando(false)
            }
        )

        return () => unsubscribe()
    }, [postId])

    return { comentarios, carregando }
}

type OpcoesComentario = {
    parentId?: string
    respostaParaAuthorId?: string
    respostaParaUsername?: string
}

// Cria comentários (ou respostas, quando `opcoes.parentId` é informado) em um post
export function useCriarComentario(postId: string, authorId: string) {
    const { usuario } = useAutenticacao()
    const [enviando, setEnviando] = useState(false)

    const criarComentario = async (texto: string, opcoes?: OpcoesComentario): Promise<void> => {
        const textoLimpo = texto.trim()
        if (!usuario) throw new Error('Usuário não autenticado.')
        if (!textoLimpo) return

        setEnviando(true)

        try {
            await addDoc(collection(banco, 'posts', postId, 'comments'), {
                authorId: usuario.uid,
                authorUsername: usuario.username,
                authorDisplayName: usuario.nome,
                authorPhotoURL: usuario.photoURL ?? null,
                text: textoLimpo,
                createdAt: serverTimestamp(),
                likesCount: 0,
                parentId: opcoes?.parentId ?? null,
                ...(opcoes?.respostaParaUsername && { respostaParaUsername: opcoes.respostaParaUsername }),
            })

            await updateDoc(doc(banco, 'posts', postId), { commentsCount: increment(1) })

            if (opcoes?.parentId && opcoes.respostaParaAuthorId) {
                await criarNotificacao({
                    paraUid: opcoes.respostaParaAuthorId,
                    tipo: 'comentario',
                    titulo: 'Nova resposta',
                    mensagem: `${usuario.nome ?? usuario.username ?? 'Alguém'} respondeu seu comentário.`,
                    deQuemId: usuario.uid,
                    deQuemUsername: usuario.username,
                    deQuemNome: usuario.nome,
                    deQuemPhotoURL: usuario.photoURL,
                    postId,
                })
            } else {
                await criarNotificacao({
                    paraUid: authorId,
                    tipo: 'comentario',
                    titulo: 'Novo comentário',
                    mensagem: `${usuario.nome ?? usuario.username ?? 'Alguém'} comentou na sua publicação.`,
                    deQuemId: usuario.uid,
                    deQuemUsername: usuario.username,
                    deQuemNome: usuario.nome,
                    deQuemPhotoURL: usuario.photoURL,
                    postId,
                })
            }
        } finally {
            setEnviando(false)
        }
    }

    return { criarComentario, enviando }
}

// Observa e alterna a curtida da usuária logada num comentário específico
// (posts/{postId}/comments/{commentId}/likes/{uid})
export function useCurtidaComentario(postId: string, commentId: string, commentAuthorId: string) {
    const { usuario } = useAutenticacao()
    const [curtido, setCurtido] = useState(false)

    useEffect(() => {
        if (!usuario) {
            setCurtido(false)
            return
        }

        const curtidaRef = doc(banco, 'posts', postId, 'comments', commentId, 'likes', usuario.uid)
        const unsubscribe = onSnapshot(
            curtidaRef,
            (snap) => setCurtido(snap.exists()),
            (erro) => console.error('Erro ao observar curtida do comentário:', erro)
        )

        return () => unsubscribe()
    }, [postId, commentId, usuario])

    const alternarCurtida = async () => {
        if (!usuario) return

        const curtidaRef = doc(banco, 'posts', postId, 'comments', commentId, 'likes', usuario.uid)
        const comentarioRef = doc(banco, 'posts', postId, 'comments', commentId)

        try {
            const snap = await getDoc(curtidaRef)

            if (snap.exists()) {
                await deleteDoc(curtidaRef)
                await updateDoc(comentarioRef, { likesCount: increment(-1) })
            } else {
                await setDoc(curtidaRef, { createdAt: serverTimestamp() })
                await updateDoc(comentarioRef, { likesCount: increment(1) })

                if (commentAuthorId !== usuario.uid) {
                    await criarNotificacao({
                        paraUid: commentAuthorId,
                        tipo: 'curtida',
                        titulo: 'Nova curtida',
                        mensagem: `${usuario.nome ?? usuario.username ?? 'Alguém'} curtiu seu comentário.`,
                        deQuemId: usuario.uid,
                        deQuemUsername: usuario.username,
                        deQuemNome: usuario.nome,
                        deQuemPhotoURL: usuario.photoURL,
                        postId,
                    })
                }
            }
        } catch (erro) {
            console.error('Erro ao curtir/descurtir comentário:', erro)
        }
    }

    return { curtido, alternarCurtida }
}