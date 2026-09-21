import styles from './PerfilLayout.module.css'
import { HeaderUser } from '../headers/HeaderUser'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { CardSugestoes } from '../misc/CardSugestoes'
import { TbUser, TbLink, TbUserEdit, TbUserPlus } from 'react-icons/tb'
import { useAutenticacao } from '../../hooks/useAutenticacao'
import { useParams } from 'react-router-dom'
import { usePerfil } from '../../hooks/usePerfil'
import { ModalEditarPerfil } from '../modais/ModalEditarPerfil'
import { TelaCarregamento } from '../misc/TelaCarregamento'
import { NaoEncontrado } from '../misc/NaoEncontrado'
import { Emblemas } from '../misc/Emblemas'


export function PerfilLayout(){

    const { username } = useParams()
    const { usuario: usuarioLogado } = useAutenticacao()
    const { perfil, carregando, naoEncontrado } = usePerfil(username)

    const location = useLocation()

    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)

    if (carregando) return <TelaCarregamento/>
    if (naoEncontrado) return <NaoEncontrado/>
    if (!perfil) return null

    const meuPerfil = usuarioLogado?.uid === perfil.uid

    return(
        <div className={ styles.perfilLayout }>
            <HeaderUser/>
            
            <main className={ styles.mainPerfil }>
                <div className={ styles.headerPerfil }>
                    <img src="https://i.imgur.com/6vAOHB9.png" className={ styles.fundo } />

                    <div className={ styles.avatarSeguidores}>
                        {perfil.photoURL ? (
                            <img src={perfil.photoURL} className={ styles.avatar } />
                        ) : (
                            <TbUser size={ 96 } className={ styles.avatar }/>
                        )}

                        <div className={ styles.seguidores }>
                            <p><span>{perfil.followersCount}</span> seguidores</p>
                            <div className={ styles.separador }/>
                            <p><span>{perfil.followingCount}</span> seguindo</p>
                        </div>

                    </div>

                    <div className={ styles.infoPerfil }>

                        <div className={ styles.mainInfo}>
                            <div className={styles.nomeEmblemas}>
                                <h1>{perfil.nome}</h1>
                                <Emblemas ids={perfil.emblemas}/>
                            </div>

                            <h2>@{perfil.username}</h2>
                        </div>

                        <div className={ styles.bio }>
                            <p>{perfil.bio}</p>
                            <button className={ styles.btnLinks }>
                                <TbLink /> Ver links
                            </button>

                            {meuPerfil ? (
                                <button
                                    className={ styles.btnEditar }
                                    onClick={() => setModalEdicaoAberto(true)}
                                >
                                    <TbUserEdit size={22} className={ styles.iconEditar } /> Editar perfil
                                </button>
                            ) : (
                                <button className={ styles.btnSeguir }>
                                    <TbUserPlus size={22} className={ styles.iconEditar } /> Seguir
                                </button>
                            )}
                        </div>

                    </div>

                    <nav className={ styles.navPerfil }>
                        <Link 
                        to={`/${perfil.username}`}
                        className={ styles.item }
                        style={{
                        color: location.pathname === `/${perfil.username}`
                            ? 'var(--primaria-escura)'
                            : 'var(--primaria)'
                        }}>
                            Postagens
                        </Link>

                        <Link 
                        to='portfolio'
                        className={ styles.item }
                        style={{
                        color: location.pathname === `/${perfil.username}/portfolio`
                            ? 'var(--primaria-escura)'
                            : 'var(--primaria)'
                        }}>
                            Portfólio
                        </Link>

                        <Link 
                        to='sobre'
                        className={ styles.item }
                        style={{
                        color: location.pathname === `/${perfil.username}/sobre`
                            ? 'var(--primaria-escura)'
                            : 'var(--primaria)'
                        }}>
                            Sobre
                        </Link>
                    </nav>

                    <Outlet context={{ perfil, meuPerfil }}/>

                </div>
                <div className={ styles.sugestoes }>
                    <CardSugestoes/>
                </div>
            </main>
            <ModalEditarPerfil
                aberto={modalEdicaoAberto}
                fechar={() => setModalEdicaoAberto(false)}
            />
        </div>
    )
}