export type LinkLivre = {
    titulo: string
    url: string
}

export type LinksPerfil = {
    github?: string
    linkedin?: string
    outros?: LinkLivre[]
}

export type UsuarioTipo = {
    uid: string
    username?: string
    nome?: string
    email?: string
    senha?: string
    bio?: string
    pronomes?: string
    photoURL?: string
    followersCount?: number
    followingCount?: number
    verificado?: boolean
    emblemas?: string[]
    links?: LinksPerfil
}