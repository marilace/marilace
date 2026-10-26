import styles from './Seguir.module.css';
import { TbUserPlus } from 'react-icons/tb';
import { CardSeguir } from '../components/misc/CardSeguir';
import { useSugestoes } from '../hooks/useSugestoes';

export function Seguir() {
    const { sugestoes } = useSugestoes();

    return (
        <main className={styles.seguir}>
            <div className={ styles.cabecalho }>
                <h1 className={ styles.titulo }>
                    <TbUserPlus size={32} />
                    Seguir
                </h1>
                <p className={ styles.subtitulo }>
                    Encontre mais pessoas incríveis no MariLace!
                </p>
            </div>
            <div className={ styles.containerCards }>
                {sugestoes.map((sugestao) => (
                    <CardSeguir
                        key={sugestao.uid}
                        uid={sugestao.uid}
                        avatarSrc={sugestao.photoURL}
                        nome={sugestao.nome ?? ''}
                        username={sugestao.username ?? ''}
                        emblemas={sugestao.emblemas}
                        bio={sugestao.bio ?? ''}
                    />
                ))}
            </div>
        </main>
    );
}