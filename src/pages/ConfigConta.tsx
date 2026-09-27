import styles from './Config.module.css';
import { ItemConfiguracao } from '../components/misc/ItemConfiguracao'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { useNavigate } from 'react-router-dom'
import { TbUserCog, TbMail, TbLock, TbLogout, TbTrash } from 'react-icons/tb'

export function ConfigConta(){

    const { usuario, deslogar, solicitarRedefinicaoSenha } = useAutenticacao()
    const navegacao = useNavigate()

    const sair = async () => {
        await deslogar()
        navegacao('/')
    }

    const alterarSenha = async () => {
        if (!usuario?.email) return
        await solicitarRedefinicaoSenha(usuario.email)
    }

    return (
        <section className={styles.secaoCard} aria-labelledby="titulo-conta">
            <div className={styles.tituloSecao}>
                <TbUserCog size={28} />
                <div>
                    <h2 id="titulo-conta">Conta</h2>
                    <p>Gerencie os dados de acesso da sua conta.</p>
                </div>
            </div>

            <ItemConfiguracao icon={TbMail} titulo="E-mail" descricao={usuario?.email || 'Não informado'}>
                <button className={styles.btnSecundario}>Alterar</button>
            </ItemConfiguracao>

            <ItemConfiguracao icon={TbLock} titulo="Senha" descricao="Mantenha uma senha forte e exclusiva.">
                <button className={styles.btnSecundario} onClick={alterarSenha}>Alterar</button>
            </ItemConfiguracao>

            <div className={styles.acoesConta}>
                <button className={styles.btnSair} onClick={sair}>
                    <TbLogout size={18} className={styles.icon} /> Sair da conta
                </button>
                <button className={styles.btnExcluir}>
                    <TbTrash size={18} className={styles.icon} /> Excluir conta
                </button>
            </div>
        </section>
    )
}