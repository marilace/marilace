import styles from './CardPerfil.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { TbUser, TbUserPlus } from 'react-icons/tb'
import badgeVerificado from '../../assets/img/verificado.png';
import { Emblemas } from './Emblemas';

interface CardPerfilProps{
    avatarSrc?: string;
    nome: string
    username: string
    verificado?: boolean;
    emblemas?: string[];
}

export function CardPerfil({
    avatarSrc,
    nome,
    username,
    verificado = false,
    emblemas,
}:CardPerfilProps){

    const [seguindo, setSeguindo] = useState(false)

    return(
        <div className={ styles.container }>
            <main>
                <Link to={`/${username}`}>
                    {avatarSrc ? (
                        <img src={avatarSrc} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarDefault}>
                            <TbUser size={28} />
                        </div>
                    )}
                </Link>
                <div className={ styles.info }>
                    <div className={ styles.nomeLinha }>
                        <span className={ styles.nome }>{nome}</span>

                        {verificado && <img src={badgeVerificado} className={ styles.badgeVerificado }/>}
                        <Emblemas ids={emblemas} />
                    </div>
                    <span className={ styles.username }>@{username}</span>
                </div>
            </main>

            <button
            className={`${styles.btnSeguir} ${seguindo ? styles.ativo : ''}`}
            onClick={() => setSeguindo(!seguindo)}>
                <TbUserPlus size={20} className={ styles.iconSeguir }/>
            </button>
        </div>
    )
}