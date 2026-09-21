export type PublicacaoTipo = {
    id: string
    authorId: string
    authorUsername: string
    authorDisplayName: string
    authorPhotoURL: string
    authorEmblemas?: string[]
    text: string
    imageURL: string | null
    likesCount: number
    commentsCount: number
    createdAt: any
}