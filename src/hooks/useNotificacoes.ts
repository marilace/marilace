import { useEffect, useState } from 'react'
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    doc,
    updateDoc,
    writeBatch,
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { useAutenticacao } from './useAutenticacao'
import type { NotificacaoTipo } from '../types/Notificacao'

export function useNotificacoes() {
    const { usuario } = useAutenticacao()
    const [notificacoes, setNotificacoes] = useState<NotificacaoTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!usuario) {
            setNotificacoes([])
            setCarregando(false)
            return
        }

        setCarregando(true)

        const q = query(
            collection(banco, 'users', usuario.uid, 'notificacoes'),
            orderBy('createdAt', 'desc'),
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snap) => {
            const lista = snap.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as NotificacaoTipo[]

            setNotificacoes(lista)
            setCarregando(false)
        })

        return () => unsubscribe()
    }, [usuario])

    const naoLidasCount = notificacoes.filter((notificacao) => !notificacao.lida).length

    const marcarComoLida = async (notificacaoId: string) => {
        if (!usuario) return
        const ref = doc(banco, 'users', usuario.uid, 'notificacoes', notificacaoId)
        await updateDoc(ref, { lida: true })
    }

    const marcarTodasComoLidas = async () => {
        if (!usuario) return
        const naoLidas = notificacoes.filter((notificacao) => !notificacao.lida)
        if (naoLidas.length === 0) return

        const batch = writeBatch(banco)
        naoLidas.forEach((notificacao) => {
            const ref = doc(banco, 'users', usuario.uid, 'notificacoes', notificacao.id)
            batch.update(ref, { lida: true })
        })
        await batch.commit()
    }

    return { notificacoes, carregando, naoLidasCount, marcarComoLida, marcarTodasComoLidas }
}