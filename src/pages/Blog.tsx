import styles from './Blog.module.css'
import { HeaderAnon } from '../components/headers/HeaderAnon'
import { FooterAnon } from '../components/footers/FooterAnon'
import { Chip } from '../components/misc/Chip';
import { ArtigoBlog } from '../components/posts/ArtigoBlog';
import { TelaCarregamento } from '../components/misc/TelaCarregamento';
import { useArtigos } from '../hooks/useArtigos';
import { useAutenticacao } from '../hooks/useAutenticacao';
import { artigosExemplo } from '../utils/artigosExemplo';
import { TbChevronRight } from "react-icons/tb";

import logoComp from '../assets/img/logo-compacta.svg'
import telefone from '../assets/img/telefone.png'
import mulherMegafone from '../assets/img/mulhermegafone.png'

const CORES_CATEGORIA: Record<string, string> = {
    'Ciência': 'var(--verde)',
    'Tecnologia': 'rgba(112, 69, 146, .8)',
    'Engenharia': 'var(--primaria)',
    'Matemática': 'var(--rosa)',
    'Questões de Gênero': 'var(--primaria-escura)',
}
const CATEGORIA_COR_PADRAO = 'var(--cinza)'

function corDaCategoria(categoria: string) {
    return CORES_CATEGORIA[categoria] ?? CATEGORIA_COR_PADRAO
}

export function Blog(){
    const { artigos: artigosBanco, carregando } = useArtigos()
    const { usuario } = useAutenticacao()

    if (carregando) return <TelaCarregamento />

    // Quando acessado de dentro da área logada (/forum/blog), o header e o
    // footer públicos não aparecem, já que o HeaderUser e o Menu do layout
    // Principal já cuidam da navegação nesse caso.
    const logada = Boolean(usuario)

    // Enquanto não existem artigos cadastrados no Firestore, mostramos
    // alguns exemplos estáticos (src/utils/artigosExemplo.ts) só para
    // ilustrar o layout do blog. Assim que houver artigos reais, eles
    // substituem os exemplos automaticamente.
    const usandoExemplos = artigosBanco.length === 0
    const artigos = usandoExemplos ? artigosExemplo : artigosBanco

    const destaques = artigos.filter((artigo) => artigo.destaque).slice(0, 3)

    const categorias: string[] = []
    artigos.forEach((artigo) => {
        artigo.categorias?.forEach((categoria) => {
            if (!categorias.includes(categoria)) categorias.push(categoria)
        })
    })

    return(
        <main className={ styles.container }>
            {!logada && <HeaderAnon/>}

            {destaques.length > 0 && (
                <section className={`${ styles.destaques } ${ logada ? styles.destaquesLogada : '' }`}>
                    <h1 className={ styles.tituloDestaques }>
                        Destaques da <span>semana</span>
                        <TbChevronRight size={24} className={ styles.icon } />
                    </h1>

                    {usandoExemplos && (
                        <span className={ styles.containerChip }>
                            <Chip texto="exemplos ilustrativos" cor="var(--cinza)" />
                        </span>
                    )}

                    <section className={ styles.artigosDestaque }>
                        {destaques[0] && (
                            <article className={ styles.artigo1 }>
                                <img src={ destaques[0].imagemURL }/>
                                <div className={ styles.containerChip }>
                                    {destaques[0].categorias.map((categoria) => (
                                        <Chip key={categoria} texto={categoria} cor={corDaCategoria(categoria)}/>
                                    ))}
                                </div>
                                <span>{ destaques[0].titulo }</span>
                                <p>{ destaques[0].descricao }</p>
                            </article>
                        )}

                        {destaques[1] && (
                            <article className={ styles.artigo2 }>
                                <img src={ destaques[1].imagemURL }/>
                                <div className={ styles.conteudoArtigo }>
                                    <div className={ styles.containerChip }>
                                        {destaques[1].categorias.map((categoria) => (
                                            <Chip key={categoria} texto={categoria} cor={corDaCategoria(categoria)}/>
                                        ))}
                                    </div>
                                    <span>{ destaques[1].titulo }</span>
                                    <p>{ destaques[1].descricao }</p>
                                </div>
                            </article>
                        )}

                        {destaques[2] && (
                            <article className={ styles.artigo3 }>
                                <img src={ destaques[2].imagemURL } />
                                <div className={ styles.conteudoArtigo }>
                                    <div className={ styles.containerChip }>
                                        {destaques[2].categorias.map((categoria) => (
                                            <Chip key={categoria} texto={categoria} cor={corDaCategoria(categoria)}/>
                                        ))}
                                    </div>
                                    <span>{ destaques[2].titulo }</span>
                                    <p>{ destaques[2].descricao }</p>
                                </div>
                            </article>
                        )}
                    </section>
                </section>
            )}

            <div className={ styles.divisoria }>
                <img src={ logoComp } />
            </div>

            <div className={ styles.artigos }>
                <div className={ styles.flexArtigos }>
                    <img
                        src={ mulherMegafone }
                        className={ styles.imgMegafone }
                        alt="Ilustração em preto e branco de uma mulher com vestido longo falando em um megafone grande"
                    />

                    <div className={ styles.headingArtigos }>
                        <div className={ styles.tituloArtigos }>
                            <h2>NOSSOS</h2>
                            <span>artigos:</span>
                        </div>

                        <img src={ telefone } className={ styles.imgTelefone} />

                        {categorias.length === 0 && (
                            <p>Ainda não temos artigos publicados por aqui.</p>
                        )}
                    </div>
                </div>

                {categorias.map((categoria) => (
                    <section className={ styles.categoria } key={categoria}>
                        <h2 className={ styles.tituloCategoria }>{ categoria.toUpperCase() }</h2>
                        <div className={ styles.artigosCategoria }>
                            {artigos
                                .filter((artigo) => artigo.categorias?.includes(categoria))
                                .map((artigo) => (
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
                ))}
            </div>
            {!logada && <FooterAnon/>}
        </main>
    )
}