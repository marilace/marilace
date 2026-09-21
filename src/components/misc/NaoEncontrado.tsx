import styles from './NaoEncontrado.module.css'
import { HeaderUser } from '../headers/HeaderUser'
const fundo = 'https://i.imgur.com/0x40IR0.png'
import { BtnAnimado } from '../buttons/BtnAnimado'
export function NaoEncontrado(){
    return(
        <div className={ styles.naoEncontrado }>
            <HeaderUser/>

            <main className={ styles.container }>
                <img src={ fundo } className={ styles.fundo } />
                <div className={ styles.conteudo }>
                    <h1>404</h1>
                    <div className={ styles.desc }>
                        <h2>Página não encontrada.</h2>
                        <p>Poxa! Parece que essa página não existe...<br/>
                        Talvez o link esteja errado ou foi removido.</p>
                    </div>
                    <BtnAnimado
                        route = '/forum'
                        text = 'Voltar para o fórum'
                    />
                </div>
            </main>
        </div>

    )
}