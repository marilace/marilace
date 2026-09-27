export type ArtigoTipo = {
    id: string
    titulo: string
    descricao: string
    conteudo?: string
    imagemURL: string
    categorias: string[]
    destaque?: boolean
    createdAt: any
}