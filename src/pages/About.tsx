import styles from './About.module.css'
import ReactPlayer from 'react-player'
import { HeaderAnon } from '../components/headers/HeaderAnon'
import { FooterAnon } from '../components/footers/FooterAnon'
import { CardWomen } from '../components/misc/CardWomen'
import { Chip } from '../components/misc/Chip'
import { LinkRede } from '../components/links/LinkRede'
import { TbBrandGithub, TbBrandInstagram, TbBrandLinkedin } from "react-icons/tb";

import listrado from '../assets/img/listrado.svg'
import ada from '../assets/img/adaLovelace.png'
const ana = 'https://i.imgur.com/6lcZcHJ.jpeg'
const fefe = 'https://i.imgur.com/N3tjHOJ.jpeg'
const gui = 'https://i.imgur.com/cwHd3Oo.jpeg'
const emilly = 'https://i.imgur.com/YIsEJeq.jpeg'
const equipe = 'https://i.imgur.com/DF0I82T.jpeg'

export function About(){
    return(
        <div className={ styles.container }>
        <HeaderAnon/>
        <main className={ styles.main }>
            <div className={ styles.textoMain }>
                <div className={ styles.chipSobre}>
                    <div className={ styles.estrelaChip } aria-hidden="true" />
                    <h3 className={styles.textoChip}>SOBRE</h3>
                    <div className={ styles.estrelaChip } aria-hidden="true"/> 
                </div>
                <h1 className={ styles.subtituloMain }>CONHEÇA NOSSA</h1>
                <h1 className={ styles.tituloMain }>história</h1>
                <div className={ styles.brilhoMain } aria-hidden="true"/>
                {/* <div className={ styles.florMain }/> */}

            </div>
            <div className={ styles.moldura }>
                <div className={ styles.estrelaMoldura1 } aria-hidden="true"/>
                <img src={equipe} className={ styles.imgMoldura } alt='Imagem do grupo MariLace'/>
                <div className={ styles.estrelaMoldura2 } aria-hidden="true"/>
            </div>
            <img src={listrado} className={ styles.fundoMain } aria-hidden="true"/>
        </main>

        <section className={ styles.historia }>
            <img src={ ada } alt="Ilustração estilizada em tons de rosa e verde do perfil de Ada Lovelace, com legenda 'Ada Lovelace (1815-1852)'"/>
            <div className={ styles.conteudoHistoria }>
                <div className={ styles.tituloHistoria }>
                    <h2 className={ styles.tituloHistoria1 }>COMO SURGIU</h2>
                    <h2 className={ styles.tituloHistoria2 }>o <span>marilace?</span></h2>
                </div>
                <p>Somos um grupo formado por quatro estudantes do 3º ano do curso Técnico em Desenvolvimento de Sistemas da ETEC de Hortolândia, sendo três meninas e um menino. Esta plataforma foi desenvolvida como nosso Trabalho de Conclusão de Curso (TCC) e nasceu com o propósito de criar um espaço colaborativo voltado para mulheres. <br /> <br />
                A ideia surgiu ao percebermos a grande diferença entre a quantidade de homens e mulheres em nossa turma. Essa realidade nos fez refletir sobre os desafios enfrentados por muitas mulheres, especialmente na área da tecnologia, e despertou em nós o desejo de desenvolver um projeto que pudesse incentivar a conexão, a troca de experiências e o apoio entre elas.

                Com este projeto, buscamos contribuir para a construção de um ambiente mais acolhedor, onde a colaboração e a representatividade possam incentivar cada vez mais mulheres a compartilhar conhecimentos, encontrar oportunidades e fortalecer umas às outras.</p>
                </div>
        </section>

        <div className={ styles.quadriculado } aria-hidden="true"></div>

        <section className={ styles.objetivos }>
            <div className={ styles.tituloObjetivos }>
                <h2 className={ styles.tituloObjetivos1 }>
                    QUAL O NOSSO
                </h2>
                <h2 className={ styles.tituloObjetivos2 }>
                    <div className={ styles.pontilhado } aria-hidden="true"/> objetivo?
                </h2>
                <div className={ styles.brilhoObjetivos } aria-hidden="true"/>
            </div>
            
            <div className={ styles.conteudoObjetvos } aria-label="Vídeo explicando o objetivo do Marilace">
                <ReactPlayer 
                    src='https://www.youtube.com/watch?v=BqYByiaAwL0'
                    style={{ width: '60%', height: 'auto', aspectRatio: '16/9' }}
                    className={ styles.player } 
                />
            </div>
        </section>

        <div className={ styles.linhaCards } aria-hidden="true"/>

        <section className={ styles.cards } aria-label="Mulheres inspiradoras da tecnologia">
            <CardWomen 
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg/960px-Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg'
                nome='Grace Hooper'
                idade='(1906 - 1992)'
                profissao='Almirante e analista de sistemas'
            />

            <CardWomen 
                src='https://www.brasildefato.com.br/wp-content/uploads/2024/09/image_processing20200201-29235-1xqup4t.jpg'
                nome='Margaret Hamilton'
                idade='(1906 - 1992)'
                profissao='Cientista da computação e engenheira'
            />

            <CardWomen 
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Katherine_Johnson_1983.jpg/960px-Katherine_Johnson_1983.jpg'
                nome='Katherine Johnson'
                idade='(1918 - 2020)'
                profissao='Matemática, física e cientista espacial'
            />

            <CardWomen 
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRhcCn53Mgm4nf6XZrdwowwL58Wdb-NuH7xJgd4uZ0FFDrxZepbkAevzvseCld0fue3kwBlYqusS3-0LNgQZ6NUcrxNl6FP4v_aSu2SGs&s=10'
                nome='Emily Roebling'
                idade='(1843 - 1903)'
                profissao='Engenheira civil'
            />
        </section>

        <div className={ styles.linhaCards } aria-hidden="true"/>

        <section className={ styles.equipe }>

            <div className={ styles.tituloEquipe }>
                <h2 className={ styles.tituloEquipe1 }>NOSSA</h2>
                <h2 className={ styles.tituloEquipe2 }>equipe</h2>
                <div className={ styles.brilhoEquipe } aria-hidden="true"/>
            </div>

            <article className={ styles.ana }>

                <div className={ styles.conteudoAna }>

                    <div className={ styles.tituloAna}>
                        <h3 className={ styles.nome }>Ana</h3>
                        <div className={ styles.sub }>
                            <Chip texto='Dev Back-end' cor='var(--rosa)'/>
                            <h3 className={ styles.sobrenome }>Clara</h3>
                        </div>
                        <div className={ styles.estrelaAna } aria-hidden="true"/>
                    </div>

                    <div className={ styles.links }>
                        <LinkRede 
                            href='https://github.com/sfclara'
                            cor='var(--primaria-escura)'
                            icon={ TbBrandGithub }
                            texto='sfclara'
                        />
                        <LinkRede 
                            href='https://www.linkedin.com/'
                            cor='var(--primaria)'
                            icon={ TbBrandLinkedin }
                            texto='anaclara'
                        />
                        <LinkRede 
                            href='https://www.instagram.com/fclaraana_/'
                            cor='var(--rosa)'
                            icon={ TbBrandInstagram }
                            texto='fclaraana_'
                        />
                    </div>
                    <p>Meu nome é Ana Clara e sou uma pessoa curiosa, dedicada e sempre em busca de aprender coisas novas. Um dos meus maiores sonhos é viajar o mundo, conhecer diferentes culturas, idiomas e formas de viver, pois acredito que essas experiências ampliam nossa visão e nos fazem crescer como pessoas. Além disso, pretendo cursar Química, uma área que desperta meu interesse por unir conhecimento, pesquisa e inovação. Espero construir uma carreira que me permita contribuir para a sociedade, continuar aprendendo constantemente e, quem sabe, unir minha profissão à oportunidade de conhecer diversos lugares ao redor do mundo.</p>
                </div>

                <div className={ styles.molduraAna }>
                    <img src={ana} className={ styles.imgAna} alt='Foto de Ana Clara'/>
                    <p className={ styles.asciiAna } aria-hidden="true">⠀⠀⠀⢈⣁⠆⡀⠀⠀⠀⠀⣄⠀⠀<br />
                        ⠀⠀⠀⢳⢹⠁⠀⠱⡀⠀⠀⢈⠆⠀<br />
                        ⠀⠀⠀⠠⢾⣆⠀⠞⠁⠀⣠⠮⡤⡀<br />
                        ⠀⠀⠀⠀⠐⠹⢦⡀⠀⠰⠁⡀⢰⡁<br />
                        ⠀⠀⠀⢔⠞⠛⠶⣟⣦⣀⠀⠀⠛⠀<br />
                        ⠀⠀⠀⠌⣤⡴⠀⠀⠀⠉⠳⡰⡡⠄<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⠹⡄⠀<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⡇⢄⠙⢀⢷⢁<br />
                        ⠀⠀⠀⠀⣀⣄⡀⠀⠑⠀⠀⠊⣸⢰<br />
                        ⠀⠀⠀⡔⠁⠠⠗⠀⠀⠀⠀⠀⡭⠄<br />
                        ⠀⠀⠀⢣⠀⠀⠲⣄⣀⣀⢤⡾⠁⠀<br />
                        ⠀⠀⠀⠀⠑⠢⠀⠀⢠⣴⣟⠍⠀⠀<br />
                        ⠐⠄⠄⠤⢐⡢⣀⡼⡾⠋⠀⠀⠀⠀<br />
                        ⠀⠀⢀⠔⣡⣞⠏⠀⠀⠀⠀⠀⠀⠀<br />
                        ⠀⠔⢡⠞⠁⡎⠀⠔⠒⡄⠀⠀⠀⠀<br />
                        ⡎⢰⠃⠀⠀⡗⠄⠁⣀⠆⠀⠀⠀⠀<br />
                        ⠀⠁⢀⠃⠀⠣⡀⠀⠀⠀⠀⣥⠀⠱<br />
                        ⠀⠀⡂⢧⡀⠐⢌⣀⠀⠀⢀⡠⢠⢀<br />
                        ⠀⠀⠂⠀⠁⠀⠀⢐⠩⣏⣋⡸⠗⠊<br />
                        ⠀⠀⠀⠀⠀⠈⠉⡆⢡⠀⠀⠀⠀⠀<br />
                        ⠀⠀⠀⠀⠑⠤⠔⠁⣸⠀⠀⠀⠀⠀
                    </p>

                </div>

                
            </article>

            <article className={ styles.emilly }>

                <div className={ styles.conteudoEmilly }>

                    <div className={ styles.tituloEmilly }>
                        <h3 className={ styles.nome }>Emilly</h3>
                        <div className={ styles.sub }>
                            <Chip texto='Dev Front-end' cor='var(--rosa)'/>
                            <h3 className={ styles.sobrenome }>Brito</h3>
                        </div>
                        <div className={ styles.estrelaEmilly } aria-hidden="true"/>
                    </div>

                    <div className={ styles.links }>
                        <LinkRede 
                            href='https://github.com/emillysbrito'
                            cor='var(--primaria-escura)'
                            icon={ TbBrandGithub }
                            texto='emillysbrito'
                        />
                        <LinkRede 
                            href='https://www.linkedin.com/in/emillydesousabrito/'
                            cor='var(--primaria)'
                            icon={ TbBrandLinkedin }
                            texto='emillydesousabrito'
                        />
                        <LinkRede 
                            href='https://www.instagram.com/esbluet/'
                            cor='var(--rosa)'
                            icon={ TbBrandInstagram }
                            texto='esbluet'
                        />
                    </div>
                    <p>Meu nome é Emilly e amo criar minhas próprias coisas, sempre estou rocurando uma nova maneira de expressar minha criatividade e dar vida à um novo projeto! Por isso, quero cursar Design Gráfico e usar meus conhecimentos em tecnologia para me tornar UI/UX Designer. Meu objetivo de vida é ajudar as pessoas com minhas criações e ampliar cada vez mais minhas habilidades artísticas.</p>
                </div>

                <div className={ styles.molduraEmilly }>
                    <img src={emilly} className={ styles.imgEmilly } alt='Foto de Emilly Brito' />
                    <p className={ styles.asciiEmilly } aria-hidden="true">⠀⠀⠀⢈⣁⠆⡀⠀⠀⠀⠀⣄⠀⠀<br />
                        ⠀⠀⠀⢳⢹⠁⠀⠱⡀⠀⠀⢈⠆⠀<br />
                        ⠀⠀⠀⠠⢾⣆⠀⠞⠁⠀⣠⠮⡤⡀<br />
                        ⠀⠀⠀⠀⠐⠹⢦⡀⠀⠰⠁⡀⢰⡁<br />
                        ⠀⠀⠀⢔⠞⠛⠶⣟⣦⣀⠀⠀⠛⠀<br />
                        ⠀⠀⠀⠌⣤⡴⠀⠀⠀⠉⠳⡰⡡⠄<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⠹⡄⠀<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⡇⢄⠙⢀⢷⢁<br />
                        ⠀⠀⠀⠀⣀⣄⡀⠀⠑⠀⠀⠊⣸⢰<br />
                        ⠀⠀⠀⡔⠁⠠⠗⠀⠀⠀⠀⠀⡭⠄<br />
                        ⠀⠀⠀⢣⠀⠀⠲⣄⣀⣀⢤⡾⠁⠀<br />
                        ⠀⠀⠀⠀⠑⠢⠀⠀⢠⣴⣟⠍⠀⠀<br />
                        ⠐⠄⠄⠤⢐⡢⣀⡼⡾⠋⠀⠀⠀⠀<br />
                        ⠀⠀⢀⠔⣡⣞⠏⠀⠀⠀⠀⠀⠀⠀<br />
                        ⠀⠔⢡⠞⠁⡎⠀⠔⠒⡄⠀⠀⠀⠀<br />
                        ⡎⢰⠃⠀⠀⡗⠄⠁⣀⠆⠀⠀⠀⠀<br />
                        ⠀⠁⢀⠃⠀⠣⡀⠀⠀⠀⠀⣥⠀⠱<br />
                        ⠀⠀⡂⢧⡀⠐⢌⣀⠀⠀⢀⡠⢠⢀<br />
                        ⠀⠀⠂⠀⠁⠀⠀⢐⠩⣏⣋⡸⠗⠊<br />
                        ⠀⠀⠀⠀⠀⠈⠉⡆⢡⠀⠀⠀⠀⠀<br />
                        ⠀⠀⠀⠀⠑⠤⠔⠁⣸⠀⠀⠀⠀⠀
                    </p>

                </div>

                
            </article>

            <article className={ styles.fernanda }>

                <div className={ styles.conteudoFernanda }>

                    <div className={ styles.tituloFernanda}>
                        <h3 className={ styles.nome }>Fernanda</h3>
                        <div className={ styles.sub }>
                            <Chip texto='Banco de Dados' cor='var(--rosa)'/>
                            <h3 className={ styles.sobrenome }>Leal</h3>
                        </div>
                        <div className={ styles.estrelaFernanda } aria-hidden="true"/>
                    </div>

                    <div className={ styles.links }>
                        <LinkRede 
                            href='https://github.com/fernandaleals'
                            cor='var(--primaria-escura)'
                            icon={ TbBrandGithub }
                            texto='fernandaleals'
                        />
                        <LinkRede 
                            href='https://www.linkedin.com/'
                            cor='var(--primaria)'
                            icon={ TbBrandLinkedin }
                            texto='fernandaleal'
                        />
                        <LinkRede 
                            href='https://www.instagram.com/nandalealz/'
                            cor='var(--rosa)'
                            icon={ TbBrandInstagram }
                            texto='nandalealz'
                        />
                    </div>
                    <p>Me chamo Fernanda Clara e sou uma pessoa alegre, focada, que almeja grandes conquistas. Sonho em vivenciar diversas culturas, conhecer o mundo ao lado de pessoas importantes na minha vida, e me tornar uma profissional na área dos esportes que sempre foi minha paixão. Quero cursar Educação física, e continuar buscanddo me tornar uma atleta profissional. Espero ter a oportunidade de levar o esporte e as artes marciais para crianças e jovens, assim como fizeram comigo, acredito que seja importante manter o legado e compartilhar conhecimento e vivências.</p>
                </div>

                <div className={ styles.molduraFernanda }>
                    <img src={fefe} className={ styles.imgFernanda} alt='Foto de Fernanda Leal' />
                    <p className={ styles.asciiFernanda }>⠀⠀⠀⢈⣁⠆⡀⠀⠀⠀⠀⣄⠀⠀<br />
                        ⠀⠀⠀⢳⢹⠁⠀⠱⡀⠀⠀⢈⠆⠀<br />
                        ⠀⠀⠀⠠⢾⣆⠀⠞⠁⠀⣠⠮⡤⡀<br />
                        ⠀⠀⠀⠀⠐⠹⢦⡀⠀⠰⠁⡀⢰⡁<br />
                        ⠀⠀⠀⢔⠞⠛⠶⣟⣦⣀⠀⠀⠛⠀<br />
                        ⠀⠀⠀⠌⣤⡴⠀⠀⠀⠉⠳⡰⡡⠄<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⠹⡄⠀<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⡇⢄⠙⢀⢷⢁<br />
                        ⠀⠀⠀⠀⣀⣄⡀⠀⠑⠀⠀⠊⣸⢰<br />
                        ⠀⠀⠀⡔⠁⠠⠗⠀⠀⠀⠀⠀⡭⠄<br />
                        ⠀⠀⠀⢣⠀⠀⠲⣄⣀⣀⢤⡾⠁⠀<br />
                        ⠀⠀⠀⠀⠑⠢⠀⠀⢠⣴⣟⠍⠀⠀<br />
                        ⠐⠄⠄⠤⢐⡢⣀⡼⡾⠋⠀⠀⠀⠀<br />
                        ⠀⠀⢀⠔⣡⣞⠏⠀⠀⠀⠀⠀⠀⠀<br />
                        ⠀⠔⢡⠞⠁⡎⠀⠔⠒⡄⠀⠀⠀⠀<br />
                        ⡎⢰⠃⠀⠀⡗⠄⠁⣀⠆⠀⠀⠀⠀<br />
                        ⠀⠁⢀⠃⠀⠣⡀⠀⠀⠀⠀⣥⠀⠱<br />
                        ⠀⠀⡂⢧⡀⠐⢌⣀⠀⠀⢀⡠⢠⢀<br />
                        ⠀⠀⠂⠀⠁⠀⠀⢐⠩⣏⣋⡸⠗⠊<br />
                        ⠀⠀⠀⠀⠀⠈⠉⡆⢡⠀⠀⠀⠀⠀<br />
                        ⠀⠀⠀⠀⠑⠤⠔⠁⣸⠀⠀⠀⠀⠀
                    </p>

                </div>

                
            </article>

                        <article className={ styles.guilherme }>

                <div className={ styles.conteudoGuilherme }>

                    <div className={ styles.tituloGuilherme }>
                        <h3 className={ styles.nome }>Guilherme</h3>
                        <div className={ styles.sub }>
                            <Chip texto='Banco de Dados' cor='var(--rosa)'/>
                            <h3 className={ styles.sobrenome }>Martins</h3>
                        </div>
                        <div className={ styles.estrelaGuilherme } aria-hidden="true"/>
                    </div>

                    <div className={ styles.links }>
                        <LinkRede 
                            href='https://github.com/GuilhermeMartins2008'
                            cor='var(--primaria-escura)'
                            icon={ TbBrandGithub }
                            texto='GuilhermeMartins2008'
                        />
                        <LinkRede 
                            href='https://https://www.linkedin.com/in/'
                            cor='var(--primaria)'
                            icon={ TbBrandLinkedin }
                            texto='guilhermemartins'
                        />
                        <LinkRede 
                            href='https://www.instagram.com/mart1ns_gui/'
                            cor='var(--rosa)'
                            icon={ TbBrandInstagram }
                            texto='mart1ns_gui'
                        />
                    </div>
                    <p>Meu nome é Guilherme Martins, e sou um garoto espontâneo, instintivo e explorador. Uma das coisas que mais amo em minha vida é fazer os outros se divertirem e se sentirem bem. Minha expectativa para o futuro é viver em um mundo melhor, onde todos possam ser quem realmente são. Para contribuir com isso, pretendo cursas psicologia e ajudar todos que precisarem.</p>
                </div>

                <div className={ styles.molduraGuilherme }>
                    <img src={gui} className={ styles.imgGuilherme } alt='Foto de Guilherme Martins' />
                    <p className={ styles.asciiGuilherme }>⠀⠀⠀⢈⣁⠆⡀⠀⠀⠀⠀⣄⠀⠀<br />
                        ⠀⠀⠀⢳⢹⠁⠀⠱⡀⠀⠀⢈⠆⠀<br />
                        ⠀⠀⠀⠠⢾⣆⠀⠞⠁⠀⣠⠮⡤⡀<br />
                        ⠀⠀⠀⠀⠐⠹⢦⡀⠀⠰⠁⡀⢰⡁<br />
                        ⠀⠀⠀⢔⠞⠛⠶⣟⣦⣀⠀⠀⠛⠀<br />
                        ⠀⠀⠀⠌⣤⡴⠀⠀⠀⠉⠳⡰⡡⠄<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⠹⡄⠀<br />
                        ⠀⠀⠀⠀⠀⠀⠀⠀⡇⢄⠙⢀⢷⢁<br />
                        ⠀⠀⠀⠀⣀⣄⡀⠀⠑⠀⠀⠊⣸⢰<br />
                        ⠀⠀⠀⡔⠁⠠⠗⠀⠀⠀⠀⠀⡭⠄<br />
                        ⠀⠀⠀⢣⠀⠀⠲⣄⣀⣀⢤⡾⠁⠀<br />
                        ⠀⠀⠀⠀⠑⠢⠀⠀⢠⣴⣟⠍⠀⠀<br />
                        ⠐⠄⠄⠤⢐⡢⣀⡼⡾⠋⠀⠀⠀⠀<br />
                        ⠀⠀⢀⠔⣡⣞⠏⠀⠀⠀⠀⠀⠀⠀<br />
                        ⠀⠔⢡⠞⠁⡎⠀⠔⠒⡄⠀⠀⠀⠀<br />
                        ⡎⢰⠃⠀⠀⡗⠄⠁⣀⠆⠀⠀⠀⠀<br />
                        ⠀⠁⢀⠃⠀⠣⡀⠀⠀⠀⠀⣥⠀⠱<br />
                        ⠀⠀⡂⢧⡀⠐⢌⣀⠀⠀⢀⡠⢠⢀<br />
                        ⠀⠀⠂⠀⠁⠀⠀⢐⠩⣏⣋⡸⠗⠊<br />
                        ⠀⠀⠀⠀⠀⠈⠉⡆⢡⠀⠀⠀⠀⠀<br />
                        ⠀⠀⠀⠀⠑⠤⠔⠁⣸⠀⠀⠀⠀⠀
                    </p>

                </div>

                
            </article>
        </section>

        <FooterAnon/>
    </div>
    )
}