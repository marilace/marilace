import styles from './AdminLayout.module.css'
import { HeaderUser } from '../headers/HeaderUser'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
    TbLayoutDashboard, 
    TbNews, 
    TbUsers,
    TbFlag,
    TbExternalLink } from 'react-icons/tb'

export function AdminLayout(){

    const location = useLocation()

    return (
        <div className={ styles.page }>
            <HeaderUser/>

            <main className={ styles.main }>
                <div className={ styles.layout }>
                    <nav
                        className={ styles.navLateral }
                        aria-label="Seções de configurações"
                    >
                        <div className={ styles.mainNav }>
                            <div className={styles.cabecalho}>
                                <div className={styles.logo}/>
                                <h1>Painel adm<span>.</span></h1>
                            </div>
                            <Link
                                className={`${styles.navItem} ${
                                    location.pathname === '/admin'
                                        ? styles.navItemAtivo
                                        : ''
                                }`}
                                to='/admin'
                                aria-current={
                                    location.pathname === '/admin'
                                        ? 'page'
                                        : undefined
                                }
                            >
                                <TbLayoutDashboard size={26}/>
                                <span>Visão Geral</span>
                            </Link>

                            <Link
                                className={`${styles.navItem} ${
                                    location.pathname === '/admin/artigos'
                                        ? styles.navItemAtivo
                                        : ''
                                }`}
                                to='artigos'
                                aria-current={
                                    location.pathname === '/admin/artigos'
                                        ? 'page'
                                        : undefined
                                }
                            >
                                <TbNews size={26}/>
                                <span>Artigos</span>
                            </Link>

                            <Link
                                className={`${styles.navItem} ${styles.itemIndisponivel}`}
                                to='/admin'
                            >
                                <TbUsers size={26}/>
                                Usuários
                                <span className={styles.tagEmBreve}>Em breve</span>
                            </Link>

                            <Link
                                className={`${styles.navItem} ${styles.itemIndisponivel}`}
                                to='/admin'
                            >
                                <TbFlag size={26}/>
                                Denúncias
                                <span className={styles.tagEmBreve}>Em breve</span>
                            </Link>
                        </div>
                        <Link
                            className={styles.navItem}
                            to='/forum'
                        >
                            <TbExternalLink size={26}/>
                            <span>Voltar para o site</span>
                        </Link>
                    </nav>

                    <div className={ styles.conteudo }>
                        <Outlet/>
                    </div>
                </div>
            </main>
        </div>
    )
}