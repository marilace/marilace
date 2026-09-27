import type { Timestamp } from 'firebase/firestore'

export type TipoNotificacao = 'curtida' | 'seguidor' | 'comentario' | 'mencao' | 'sistema'

export type NotificacaoTipo = {
    id: string
    tipo: TipoNotificacao
    lida: boolean
    createdAt: Timestamp | null
    titulo: string
    mensagem: string
    deQuemId?: string
    deQuemUsername?: string
    deQuemNome?: string
    deQuemPhotoURL?: string
    postId?: string
}