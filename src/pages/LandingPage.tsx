import styles from './LandingPage.module.css'

import { HeaderAnon } from '../components/headers/HeaderAnon'
import { FooterAnon } from '../components/footers/FooterAnon'
import { Chip } from '../components/misc/Chip'

const fundoLanding = 'https://i.imgur.com/0x40IR0.png'
const imgAda = 'https://i.imgur.com/Q0N78bZ.png'
const imgMarie = 'https://i.imgur.com/626nzKl.png'
const pontilhado = 'https://i.imgur.com/CDM2OxK.png'

export function LandingPage(){
    return(
        <div className={ styles.landingPage }>
            <HeaderAnon/>

            <main className={ styles.hero }>
                <img
                    src={ fundoLanding }
                    className={ styles.fundoHero }
                    alt=""
                    aria-hidden="true"
                />

                <div className={ styles.conteudoHero }>
                    <div className={ styles.etiqueta }>
                        <Chip texto='Grandes ideias' cor='var(--verde)' />
                    </div>

                    <h1 className={ styles.tituloHero }>Também tem voz</h1>
                    <img src={pontilhado} className={ styles.pontilhado } />
                    <h1 className={ styles.tituloFeminina }>feminina</h1>

                    <p className={ styles.descHero }>
                        Conheça uma comunidade feita para apoiar mulheres<br/>
                        em cada etapa da sua jornada em STEM.
                    </p>

                    <button className={ styles.btnHero }>
                        <span className={ styles.estrelaBtn } aria-hidden="true" />
                        <span>Quero fazer parte!</span>
                        <span className={ styles.estrelaBtn } aria-hidden="true" />
                    </button>
                </div>

                <img
                    className={ styles.imgAda }
                    src={ imgAda }
                    alt="Ilustração estilizada em tom roxo de Ada Lovelace, com vestido de época"
                />
                <img
                    className={ styles.imgMarie }
                    src={ imgMarie }
                    alt="Ilustração estilizada em tom roxo de Marie Curie, usando óculos escuros em estilo pixel art"
                />
            </main>

            <div className={ styles.marquee } aria-hidden="true">
                <div className={ styles.marqueeTrack }>
                    {Array.from({ length: 2 }).map((_, grupo) => (
                        <div className={ styles.marqueeGrupo } key={ grupo }>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <span className={ styles.marqueeItem } key={ i }>
                                    marilace
                                    <span className={ styles.marqueeEstrela } />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <FooterAnon />
        </div>
    )
}