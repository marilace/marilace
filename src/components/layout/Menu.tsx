import styles from './Menu.module.css'
import { Link, useLocation } from 'react-router-dom'
import { TbHome, TbClipboardSmile, TbBookmark, TbNews } from "react-icons/tb";


// o propósito é o menu ficar sempre aberto mesmo

export function Menu(){

    const location = useLocation()

    return(
        <aside className={ styles.menu }>
            <nav className={ styles.itemContainer }>
                <Link
                    className={ styles.item }
                    style={{
                        color: location.pathname === '/forum'
                            ? 'var(--primaria-escura)'
                            : 'var(--preto)'
                    }}
                    to='/forum'
                >
                    <TbHome size={30} className={ styles.icon }/>
                    <span className={ styles.rotulo }>Início</span>
                </Link>
                <hr />
                <Link
                    className={ styles.item }
                    style={{
                        color: location.pathname === '/forum/oportunidades'
                            ? 'var(--primaria-escura)'
                            : 'var(--preto)'
                    }}
                    to='oportunidades'
                >
                    <TbClipboardSmile size={30} className={ styles.icon }/>
                    <span className={ styles.rotulo }>Oportunidades</span>
                </Link>
                <hr />
                <Link
                    className={ styles.item }
                    style={{
                        color: location.pathname === '/forum/blog'
                            ? 'var(--primaria-escura)'
                            : 'var(--preto)'
                    }}
                    to='blog'
                >
                    <TbNews size={30} className={ styles.icon }/>
                    <span className={ styles.rotulo }>Blog</span>
                </Link>
                <hr />
                <Link
                    className={ styles.item }
                    style={{
                        color: location.pathname === '/forum/salvos'
                            ? 'var(--primaria-escura)'
                            : 'var(--preto)'
                    }}
                    to='salvos'
                >
                    <TbBookmark size={30} className={ styles.icon }/>
                    <span className={ styles.rotulo }>Salvos</span>
                </Link>
            </nav>
        </aside>
    )
}