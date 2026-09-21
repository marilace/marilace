import styles from './Profile.module.css'
import { useOutletContext } from 'react-router-dom'
import { usePublicacoesDoUsuario } from '../hooks/usePublicacoes'
import { Post } from '../components/posts/Post'
import { formatarTempo } from '../utils/formatarTempo'
import { type UsuarioTipo } from '../types/Usuario'
import { TbMoodConfuzed } from 'react-icons/tb'
import { TelaCarregamento } from '../components/misc/TelaCarregamento'

    type ContextoPerfil = { 
        perfil: UsuarioTipo
        meuPerfil: boolean 
    }
export function Profile(){

    const { perfil } = useOutletContext<ContextoPerfil>()
    const { publicacoes, carregando } = usePublicacoesDoUsuario(perfil.uid)

    if (carregando) {
        return <TelaCarregamento />
    }

    return (
        <div className={styles.container}>
            {publicacoes.length === 0 ? ( 
                <main className={styles.default}> 
                    <TbMoodConfuzed size={100} className={styles.icon} />
                    <h1>Nada aqui ainda!</h1>
                </main>
            ) : ( 
                publicacoes.map((post) => ( 
                    <Post
                        key={post.id}
                        postId={post.id}
                        authorId={post.authorId}
                        avatarSrc={post.authorPhotoURL}
                        nome={post.authorDisplayName}
                        username={post.authorUsername}
                        emblemas={post.authorEmblemas}
                        tempo={formatarTempo(post.createdAt)}
                        conteudo={post.text}
                        imagemUrl={post.imageURL}
                        curtidas={post.likesCount}
                        comentarios={post.commentsCount}
                        compartilhamentos={0}
                    />
                ))
            )} 
        </div>
    )
}