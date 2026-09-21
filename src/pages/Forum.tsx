import styles from './Forum.module.css'
import { useState } from 'react';
import { TbUser, TbChevronDown, TbPencilStar } from "react-icons/tb";
import { Post } from '../components/posts/Post';
import { useFeed } from '../hooks/usePublicacoes';
import { useAutenticacao } from '../hooks/useAutenticacao';
import { formatarTempo } from '../utils/formatarTempo';
import { TelaCarregamento } from '../components/misc/TelaCarregamento';
import { ModalPostagem } from '../components/modais/ModalPostagem';

export function Forum(){
    const { usuario } = useAutenticacao()
    const { publicacoes, carregando } = useFeed()
    const [modalAberto, setModalAberto] = useState(false);

    if (carregando) return <TelaCarregamento />

    return(
        <main className={ styles.forum }>
            <button className={ styles.btnPost } onClick={() => setModalAberto(true)}>
                <TbPencilStar size={ 40 }/>
            </button>
            <button className={ styles.inputPost } onClick={() => setModalAberto(true)}>
                {usuario?.photoURL ? (
                    <img
                        src={usuario.photoURL}
                        className={ styles.avatarPerfil }
                        alt="Foto de perfil"
                    />
                ) : (
                    <TbUser size={24} className={ styles.iconPerfil }/>
                )}
                <span>O que você está pensando?</span>
            </button>

            <div className={ styles.containerPosts }>

                <span className={ styles.forYou }>
                    Para você <TbChevronDown size={20}/>
                </span>

                    {publicacoes.map((post) => (
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
                    ))}

            </div>

            <ModalPostagem
                aberto={modalAberto}
                fechar={() => setModalAberto(false)}
            />
        </main>
    )
}