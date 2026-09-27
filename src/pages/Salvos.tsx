import styles from './Salvos.module.css'
import { useState } from 'react'
import { TbBookmark } from "react-icons/tb";
import { useItensSalvos } from '../hooks/useSalvos';
import { Post } from '../components/posts/Post';
import { ArtigoBlog } from '../components/posts/ArtigoBlog';
import { ChipClicavel } from '../components/misc/ChipClicavel';
import { TelaCarregamento } from '../components/misc/TelaCarregamento';
import { formatarTempo } from '../utils/formatarTempo';

type Filtro = 'todos' | 'post' | 'artigo'

export function Salvos(){
    const { itens, carregando } = useItensSalvos()
    const [filtro, setFiltro] = useState<Filtro>('todos')

    if (carregando) return <TelaCarregamento />

    const itensFiltrados = itens.filter((item) => filtro === 'todos' || item.tipo === filtro)

    return(
        <main className={ styles.salvos }>
            <h1 className={ styles.titulo }>Salvos</h1>

            <div className={ styles.filtros }>
                <ChipClicavel
                    texto="Todos"
                    cor="var(--primaria)"
                    selecionado={filtro === 'todos'}
                    onClick={() => setFiltro('todos')}
                />
                <ChipClicavel
                    texto="Posts"
                    cor="var(--primaria)"
                    selecionado={filtro === 'post'}
                    onClick={() => setFiltro('post')}
                />
                <ChipClicavel
                    texto="Artigos"
                    cor="var(--primaria)"
                    selecionado={filtro === 'artigo'}
                    onClick={() => setFiltro('artigo')}
                />
            </div>

            {itensFiltrados.length === 0 ? (
                <div className={ styles.vazio }>
                    <TbBookmark className={ styles.iconeVazio } />
                    <p>Nada por aqui ainda...</p>
                    <span>Toque no ícone de salvar em um post ou artigo para vê-lo aqui depois.</span>
                </div>
            ) : (
                <div className={ styles.containerItens }>
                    {itensFiltrados.map((item) => (
                        item.tipo === 'post' ? (
                            <Post
                                key={`post-${item.dados.id}`}
                                postId={item.dados.id}
                                authorId={item.dados.authorId}
                                avatarSrc={item.dados.authorPhotoURL}
                                nome={item.dados.authorDisplayName}
                                username={item.dados.authorUsername}
                                emblemas={item.dados.authorEmblemas}
                                tempo={formatarTempo(item.dados.createdAt)}
                                conteudo={item.dados.text}
                                imagemUrl={item.dados.imageURL}
                                curtidas={item.dados.likesCount}
                                comentarios={item.dados.commentsCount}
                                compartilhamentos={0}
                            />
                        ) : (
                            <ArtigoBlog
                                key={`artigo-${item.dados.id}`}
                                id={item.dados.id}
                                src={item.dados.imagemURL}
                                titulo={item.dados.titulo}
                                descricao={item.dados.descricao}
                            />
                        )
                    ))}
                </div>
            )}
        </main>
    )
}