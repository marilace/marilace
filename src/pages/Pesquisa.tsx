import styles from './Pesquisa.module.css'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
    TbSearch, 
    TbMoodEmpty, 
    TbUsers, 
    TbNews 
} from 'react-icons/tb'
import { usePesquisa } from '../hooks/usePesquisa'
import { ChipClicavel } from '../components/misc/ChipClicavel'
import { CardPerfil } from '../components/misc/CardPerfil'
import { CardOportunidade } from '../components/misc/CardOportunidade'
import { Post } from '../components/posts/Post'
import { ArtigoBlog } from '../components/posts/ArtigoBlog'
import { formatarTempo } from '../utils/formatarTempo'

type Filtro = 'tudo' | 'pessoas' | 'posts' | 'artigos' | 'oportunidades'

export function Pesquisa(){
    const [params] = useSearchParams()
    const termo = (params.get('q') ?? '').trim()
    const [filtro, setFiltro] = useState<Filtro>('tudo')

    const { usuarios, publicacoes, artigos, oportunidades, carregando, termoValido } = usePesquisa(termo)

    const total = usuarios.length + publicacoes.length + artigos.length + oportunidades.length
    const exibe = (secao: Filtro) => filtro === 'tudo' || filtro === secao

    const filtros: { texto: string; valor: Filtro }[] = [
        { texto: 'Tudo', valor: 'tudo' },
        { texto: `Pessoas (${usuarios.length})`, valor: 'pessoas' },
        { texto: `Posts (${publicacoes.length})`, valor: 'posts' },
        { texto: `Artigos (${artigos.length})`, valor: 'artigos' },
        { texto: `Oportunidades (${oportunidades.length})`, valor: 'oportunidades' },
    ]

    return (
        <main className={ styles.pesquisa }>
            <div className={ styles.cabecalho }>
                <h1 className={ styles.titulo }>
                    {termo ? <>Resultados para <span>"{termo}"</span></> : 'Pesquisar'}
                </h1>
            </div>

            {!termoValido ? (
                <div className={ styles.vazio }>
                    <TbSearch className={ styles.iconeVazio } />
                    <p>O que você quer encontrar?</p>
                    <span>Digite pelo menos 2 letras na barra de pesquisa para pesquisar pessoas, posts, artigos e oportunidades.</span>
                </div>
            ) : (
                <>
                    <div className={ styles.filtros }>
                        {filtros.map((f) => (
                            <ChipClicavel
                                key={f.valor}
                                texto={f.texto}
                                cor="var(--primaria)"
                                selecionado={filtro === f.valor}
                                onClick={() => setFiltro(f.valor)}
                            />
                        ))}
                    </div>

                    {carregando && <p className={ styles.status }>Pesquisando...</p>}

                    {!carregando && total === 0 && (
                        <div className={ styles.vazio }>
                            <TbMoodEmpty className={ styles.iconeVazio } />
                            <p>Nada encontrado por aqui...</p>
                            <span>Confira a escrita ou tente outras palavras.</span>
                        </div>
                    )}

                    {!carregando && exibe('pessoas') && usuarios.length > 0 && (
                        <section className={ styles.secao }>
                            <h2>
                                <TbUsers size={32} className={ styles.icon } /> 
                                Pessoas
                                </h2>
                            <div className={ styles.listaPessoas }>
                                {usuarios.map((u) => (
                                    <CardPerfil
                                        key={u.uid}
                                        uid={u.uid}
                                        avatarSrc={u.photoURL}
                                        nome={u.nome ?? ''}
                                        username={u.username ?? ''}
                                        emblemas={u.emblemas}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {!carregando && exibe('posts') && publicacoes.length > 0 && (
                        <section className={ styles.secao }>
                            <h2>
                                <TbNews size={32} className={ styles.icon } /> 
                                Posts
                            </h2>
                            <div className={ styles.listaPosts }>
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
                        </section>
                    )}

                    {!carregando && exibe('artigos') && artigos.length > 0 && (
                        <section className={ styles.secao }>
                            <h2>Artigos</h2>
                            <div className={ styles.listaArtigos }>
                                {artigos.map((artigo) => (
                                    <ArtigoBlog
                                        key={artigo.id}
                                        id={artigo.id}
                                        src={artigo.imagemURL}
                                        titulo={artigo.titulo}
                                        descricao={artigo.descricao}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {!carregando && exibe('oportunidades') && oportunidades.length > 0 && (
                        <section className={ styles.secao }>
                            <h2>Oportunidades</h2>
                            <div className={ styles.listaOportunidades }>
                                {oportunidades.map((o) => (
                                    <CardOportunidade key={o.id} oportunidade={o} />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </main>
    )
}