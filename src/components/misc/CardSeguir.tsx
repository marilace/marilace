import styles from './CardSeguir.module.css'
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
    bio?: string;
}

export function CardSeguir({
    uid,
    avatarSrc,
    nome,
    username,
    verificado = false,
    emblemas,
    bio
}:CardPerfilProps){

    const { seguindo, alternarSeguir, atualizando, ehMeuProprioPerfil } = useSeguir(uid)

    return(
        <>
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
                        <Link className={ styles.nome } to={`/${username}`}>
                            {nome}
                        </Link>

                        {verificado && <img src={badgeVerificado} className={ styles.badgeVerificado }/>}
                        <Emblemas ids={emblemas} />
                    </div>
                    <span className={ styles.username }>@{username}</span>
                    {bio && <p className={ styles.bio }>{bio}</p>}
                </div>
            </main>

            {!ehMeuProprioPerfil && (
                <button
                className={`${styles.btnSeguir} ${seguindo ? styles.ativo : ''}`}
                onClick={alternarSeguir}
                disabled={atualizando}
                aria-label={seguindo ? 'Deixar de seguir' : 'Seguir'}>
                    {seguindo ? (
                        <div className={styles.conteudoBtnSeguir}>
                            <TbUserCheck size={20} className={ styles.iconSeguir }/>
                            <span className={ styles.textoSeguir }>Seguindo</span>
                        </div>
                    ) : (
                        <div className={styles.conteudoBtnSeguir}>
                            <TbUserPlus size={20} className={ styles.iconSeguir }/>
                            <span className={ styles.textoSeguir }>Seguir</span>
                        </div>
                    )}
                </button>
            )}
        </div>
        <hr className={styles.divisor}/>
        </>
    )
}