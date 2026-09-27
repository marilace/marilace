import { type PublicacaoTipo } from './Publicacao'
import { type ArtigoTipo } from './Artigo'

export type TipoSalvo = 'post' | 'artigo'

export type SalvoTipo = {
    id: string
    tipo: TipoSalvo
    criadoEm: any
}

export type ItemSalvo =
    | { tipo: 'post'; dados: PublicacaoTipo }
    | { tipo: 'artigo'; dados: ArtigoTipo }