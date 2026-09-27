import styles from './CardPerfil.module.css'
import { Link } from 'react-router-dom';
import { TbUser, TbUserPlus, TbUserCheck } from 'react-icons/tb'
import badgeVerificado from '../../assets/img/verificado.png';
import { Emblemas } from './Emblemas';
import { useSeguir } from '../../hooks/useSeguir';

interface CardPerfilProps{
    uid: string;
    avatarSrc?: string;
    nome: string
    username: string
    verificado?: boolean;
    emblemas?: string[];
}

export function CardPerfil({
    uid,
    avatarSrc,
    nome,
    username,
    verificado = false,
    emblemas,
}:CardPerfilProps){

    const { seguindo, alternarSeguir, atualizando, ehMeuProprioPerfil } = useSeguir(uid)

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

            {!ehMeuProprioPerfil && (
                <button
                className={`${styles.btnSeguir} ${seguindo ? styles.ativo : ''}`}
                onClick={alternarSeguir}
                disabled={atualizando}
                aria-label={seguindo ? 'Deixar de seguir' : 'Seguir'}>
                    {seguindo ? (
                        <TbUserCheck size={20} className={ styles.iconSeguir }/>
                    ) : (
                        <TbUserPlus size={20} className={ styles.iconSeguir }/>
                    )}
                </button>
            )}
        </div>
    )
}