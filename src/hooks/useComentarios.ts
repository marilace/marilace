import { useEffect, useState } from 'react'
import {
    collection,
    addDoc,
    doc,
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
import { type ComentarioTipo } from '../types/Comentario'

// Observa em tempo real os comentários de um post (posts/{postId}/comments)
export function useComentarios(postId: string | undefined) {
    const [comentarios, setComentarios] = useState<ComentarioTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!postId) {
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
                const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ComentarioTipo)
                setComentarios(lista)
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

// Cria comentários em um post específico
export function useCriarComentario(postId: string, authorId: string) {
    const { usuario } = useAutenticacao()
    const [enviando, setEnviando] = useState(false)

    const criarComentario = async (texto: string): Promise<void> => {
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
                createdAt: serverTimestamp()
            })

            await updateDoc(doc(banco, 'posts', postId), { commentsCount: increment(1) })

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
        } finally {
            setEnviando(false)
        }
    }

    return { criarComentario, enviando }
}