import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import type { TipoNotificacao } from '../types/Notificacao'

interface CriarNotificacaoParams {
    paraUid: string
    tipo: TipoNotificacao
    titulo: string
    mensagem: string
    deQuemId?: string
    deQuemUsername?: string
    deQuemNome?: string
    deQuemPhotoURL?: string
    postId?: string
}

export async function criarNotificacao({
    paraUid,
    tipo,
    titulo,
    mensagem,
    deQuemId,
    deQuemUsername,
    deQuemNome,
    deQuemPhotoURL,
    postId,
}: CriarNotificacaoParams) {
    // Não notifica o usuário sobre a própria ação (ex: curtir o próprio post)
    if (deQuemId && deQuemId === paraUid) return

    await addDoc(collection(banco, 'users', paraUid, 'notificacoes'), {
        tipo,
        titulo,
        mensagem,
        lida: false,
        createdAt: serverTimestamp(),
        ...(deQuemId && { deQuemId }),
        ...(deQuemUsername && { deQuemUsername }),
        ...(deQuemNome && { deQuemNome }),
        ...(deQuemPhotoURL && { deQuemPhotoURL }),
        ...(postId && { postId }),
    })
}