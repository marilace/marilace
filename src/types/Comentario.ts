export type ComentarioTipo = {
    id: string
    authorId: string
    authorUsername: string
    authorDisplayName: string
    authorPhotoURL: string | null
    text: string
    createdAt: any
    likesCount: number
    parentId: string | null
    respostaParaUsername?: string | null
}

// comentário de topo já com as respostas dele agrupadas (thread estilo Twitter)
export type ComentarioComRespostas = ComentarioTipo & {
    respostas: ComentarioTipo[]
}