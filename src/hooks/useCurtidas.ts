import { useEffect, useState } from 'react'
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    updateDoc,
    increment,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { useAutenticacao } from './useAutenticacao'
import { criarNotificacao } from '../services/Notificacoes'

export function useCurtida(postId: string, authorId: string) {
    const { usuario } = useAutenticacao()
    const [curtido, setCurtido] = useState(false)

    // Observa se o usuário logado já curtiu esse post específico
    useEffect(() => {
        if (!usuario) return

        const curtidaRef = doc(banco, 'posts', postId, 'likes', usuario.uid)
        const unsubscribe = onSnapshot(curtidaRef, (snap) => {
            setCurtido(snap.exists())
        })

        return () => unsubscribe()
    }, [postId, usuario])

    const alternarCurtida = async () => {
        if (!usuario) return

        const curtidaRef = doc(banco, 'posts', postId, 'likes', usuario.uid)
        const postRef = doc(banco, 'posts', postId)
        const snap = await getDoc(curtidaRef)

        if (snap.exists()) {
            await deleteDoc(curtidaRef)
            await updateDoc(postRef, { likesCount: increment(-1) })
        } else {
            await setDoc(curtidaRef, { createdAt: serverTimestamp() })
            await updateDoc(postRef, { likesCount: increment(1) })

            await criarNotificacao({
                paraUid: authorId,
                tipo: 'curtida',
                titulo: 'Nova curtida',
                mensagem: `${usuario.nome ?? usuario.username ?? 'Alguém'} curtiu sua publicação.`,
                deQuemId: usuario.uid,
                deQuemUsername: usuario.username,
                deQuemNome: usuario.nome,
                deQuemPhotoURL: usuario.photoURL,
                postId,
            })
        }
    }

    return { curtido, alternarCurtida }
}