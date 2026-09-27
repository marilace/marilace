export type CategoriaOportunidade = 'Vaga' | 'Estágio' | 'Bolsa' | 'Mentoria' | 'Evento'

export type OportunidadeTipo = {
    id: string
    titulo: string
    instituicao: string
    categoria: CategoriaOportunidade
    modalidade: 'Remoto' | 'Presencial' | 'Híbrido'
    local?: string
    descricao: string
    tags: string[]
    prazo?: string
    link?: string
}