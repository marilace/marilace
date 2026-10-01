import styles from './Config.module.css'
import {
    TbBrandGithub,
    TbBrandInstagram,
    TbMail,
    TbFileText,
    TbSpeakerphone,
} from 'react-icons/tb'
import { LinkRede } from '../components/links/LinkRede'
import { VERSAO_ATUAL } from '../types/Versoes'
import { useState } from 'react'
import { ModalTermos } from '../components/modais/ModalTermos'

export function ConfigSobre(){

    const [modalTermosAberto, setModalTermosAberto] = useState(false)

    return (
        <section className={styles.secaoCard} aria-labelledby="titulo-sobre">

            <div className={ styles.logoContainer }>
                <div className={ styles.logo }/>
            </div>

            <h3 className={styles.sobreSubtitulo}>
                <div className={ styles.estrela }/>
                Informações do sistema
            </h3>

            <ul className={styles.listaInfo}>
                <li className={styles.linhaInfo}>
                    <span className={styles.linhaInfoLabel}>Desenvolvido por</span>
                    <span className={styles.linhaInfoValor}>Equipe MariLace</span>
                </li>
                <li className={styles.linhaInfo}>
                    <span className={styles.linhaInfoLabel}>Versão</span>
                    <span className={styles.linhaInfoValor}>{VERSAO_ATUAL.numero} "{VERSAO_ATUAL.codinome}"</span>
                </li>
                <li className={styles.linhaInfo}>
                    <span className={styles.linhaInfoLabel}>Última atualização</span>
                    <span className={styles.linhaInfoValor}>{VERSAO_ATUAL.data}</span>
                </li>
            </ul>

            <div className={styles.sobreBloco}>
                <h3 className={styles.sobreSubtitulo}>
                    <div className={ styles.estrela }/>
                    Redes sociais
                </h3>
                <div className={styles.sobreRedes}>
                    <LinkRede
                        href='https://github.com/emillysbrito/marilace'
                        icon= {TbBrandGithub}
                        texto='GitHub'
                        cor='var(--primaria)'
                    />
                    <LinkRede
                        href='https://www.instagram.com/projetomarilace/'
                        icon= {TbBrandInstagram}
                        texto='Instagram'
                        cor='var(--rosa)'
                    />
                    <LinkRede
                        href='mailto:projetomarilace@gmail.com'
                        icon= {TbMail}
                        texto='E-mail'
                        cor='var(--verde)'
                    />
                </div>
            </div>

            <div className={styles.sobreBloco}>
                <h3 className={styles.sobreSubtitulo}>
                    <div className={ styles.estrela }/>
                    Documentos
                </h3>
                <div className={styles.sobreLinksLegais}>
                    <button
                        type="button"
                        className={styles.linkLegal}
                        onClick={() => setModalTermosAberto(true)}
                    >
                        <TbFileText size={18}/> Termos de uso
                    </button>
                    <a href="#" className={styles.linkLegal}>
                        <TbSpeakerphone size={18}/> Notas de versão
                    </a>
                </div>
            </div>

            <p className={styles.copyright}>
                &copy; 2026 MariLace Team. Todos os direitos reservados.
            </p>
            <ModalTermos aberto={modalTermosAberto} fechar={() => setModalTermosAberto(false)} />
        </section>
    )
}