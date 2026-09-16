import styles from './FooterAnon.module.css';

import { Link } from 'react-router-dom'
import { LinkCompacto } from '../links/LinkCompacto'

import logo from '../../assets/logo.svg';
import estrela from '../../assets/estrela.svg';

import { TbBrandGithub, TbBrandTwitter, TbBrandInstagram, TbMail } from "react-icons/tb";

export function FooterAnon(){
    return(
        <div className={ styles.footer }>
            <div className={ styles.conteudoFooter}>
                <div className={ styles.mainContainer }>
                    <main className={styles.logoDesc}>
                        <div className={ styles.logo }>
                            <img src={ estrela } />
                            <img src={ logo } />
                        </div>
                        <p className={ styles.desc }>
                            Uma plataforma colaborativa para mulheres STEM.
                        </p>
                    </main>
                    <div className={ styles.links }>
                        <LinkCompacto href="https://github.com/emillysbrito/marilace" icon={TbBrandGithub}/>
                        <LinkCompacto href="https://twitter.com" icon={TbBrandTwitter}/>
                        <LinkCompacto href="https://instagram.com" icon={TbBrandInstagram}/>
                        <LinkCompacto href="mailto:marilace@proton.me" icon={TbMail}/>
                    </div>
                </div>
                <div className={ styles.pages }>
                    <div className={ styles.page }>
                        <h5>INÍCIO</h5>
                        <Link to="/">Conheça o MariLace</Link>
                        <Link to="#registro">Registre-se</Link>
                    </div>
                    <div className={ styles.page }>
                        <h5>SOBRE</h5>
                        <Link to="/about">Como surgiu o MariLace?</Link>
                        <Link to="/about">Nossos objetivos</Link>
                        <Link to="/about">Nossa Equipe</Link>
                    </div>
                    <div className={ styles.page }>
                        <h5>BLOG</h5>
                        <Link to="/blog">Destaques da semana</Link>
                        <Link to="/blog">Ciência</Link>
                        <Link to="/blog">Tecnologia</Link>
                        <Link to="/blog">Engenharia</Link>
                        <Link to="/blog">Matemática</Link>
                    </div>
                </div>
            </div>
            <hr />
            <h6 className={ styles.copyright }>
                &copy; 2026 MariLace Team. Todos os direitos reservados.
            </h6>
        </div>
    )
}