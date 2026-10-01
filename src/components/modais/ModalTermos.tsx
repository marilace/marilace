import { useState } from 'react'
import styles from './ModalTermos.module.css'
import { TbFileText, TbX } from 'react-icons/tb'

type ModalTermosProps = {
    aberto: boolean
    aceitar?: () => void
    fechar?: () => void
}

export function ModalTermos({ aberto, aceitar, fechar }: ModalTermosProps) {
    const [concordo, setConcordo] = useState(false)

    if (!aberto) return null

    const exigeAceite = Boolean(aceitar)

    return (
        <div
            className={styles.modalOverlay}
            onClick={exigeAceite ? undefined : fechar}
        >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-termos"
                onClick={(e) => e.stopPropagation()}
            >
                <header className={styles.cabecalho}>
                    <h2 id="titulo-termos">
                        <TbFileText size={24} className={styles.icone} />
                        Termos de uso e diretrizes
                    </h2>
                    {!exigeAceite && (
                        <button
                            className={styles.btnFechar}
                            onClick={fechar}
                            aria-label="Fechar"
                        >
                            <TbX size={22} />
                        </button>
                    )}
                </header>

                <div className={styles.conteudo}>
                    <p>
                        Ao realizar o cadastro e utilizar a comunidade MariLace, o usuário
                        declara estar ciente e de acordo com os presentes Termos de Uso.
                        Estas regras têm como objetivo garantir um ambiente seguro,
                        respeitoso e acolhedor para todas as pessoas que fazem parte da
                        plataforma.
                    </p>

                    <section> 
                        <h3>1. Respeito e convivência</h3> 
                        <p> 
                            Todos os usuários devem tratar os demais membros da comunidade com 
                            respeito, educação e cordialidade. Não serão permitidas manifestações 
                            que tenham como objetivo ofender, humilhar, intimidar, ameaçar ou 
                            constranger outras pessoas. 
                        </p>
                        <p>
                            É proibida qualquer forma de preconceito, discriminação ou discurso 
                            de ódio, incluindo manifestações relacionadas a raça, cor, etnia, 
                            nacionalidade, gênero, orientação sexual, identidade de gênero, religião, 
                            deficiência, condição social ou qualquer outra característica pessoal.
                        </p>
                    </section> 
                    <section> 
                        <h3>2. Conteúdos proibidos</h3> 
                        <p> 
                            Não é permitido publicar, compartilhar ou enviar conteúdos que contenham 
                            material sexual, pornográfico ou destinado ao público adulto (+18), nudez 
                            ou conteúdo sexualmente explícito.
                        </p>
                        <p> 
                            Também são proibidos conteúdos que promovam ou incentivem preconceito, 
                            discriminação, violência, ameaças, perseguição, assédio ou intimidação, 
                            assim como publicações destinadas a ofender, ridicularizar ou humilhar outros 
                            usuários.
                        </p>
                        <p> 
                            Não é permitido divulgar informações pessoais de terceiros sem autorização, 
                            realizar spam ou utilizar a plataforma para atividades que possam prejudicar 
                            outros usuários ou o funcionamento da comunidade.
                        </p>
                    </section>
                    <section> 
                        <h3>3. Comentários e publicações</h3> 
                        <p>
                            Os usuários são responsáveis pelos comentários, publicações e demais conteúdos 
                            produzidos dentro da comunidade. Discordâncias e debates são permitidos, desde 
                            que realizados de maneira respeitosa e sem ataques pessoais.
                        </p>
                        <p>
                            Comentários ou publicações que violem estas regras poderão ser denunciados por 
                            outros usuários e removidos pela administração da plataforma.
                        </p>
                    </section>
                    <section>
                        <h3>4. Denúncias</h3>
                        <p>
                            O MariLace disponibiliza mecanismos para que os usuários possam denunciar 
                            conteúdo ou comportamentos que estejam em desacordo com as regras da comunidade.
                        </p>
                        <p>
                            As denúncias poderão ser analisadas pela administração, que poderá remover o 
                            conteúdo denunciado e aplicar medidas à conta responsável, de acordo com a gravidade 
                            da ocorrência. O sistema de denúncias não deve ser utilizado de forma abusiva ou para 
                            realizar denúncias falsas com o objetivo de prejudicar outros membros. 
                        </p>
                    </section>
                    <section>
                        <h3>5. Medidas disciplinares</h3>
                        <p> 
                            O descumprimento dos presentes Termos de Uso poderá resultar na remoção do conteúdo, 
                            advertência, restrição temporária de funcionalidades, suspensão da conta ou banimento 
                            permanente do usuário.
                        </p>
                        <p>
                            Em casos graves ou reincidentes, a conta poderá ser permanentemente removida da 
                            comunidade. Situações que envolvam possíveis práticas ilegais poderão receber os 
                            encaminhamentos cabíveis.
                        </p>
                    </section>
                    <section>
                        <h3>6. Responsabilidade do usuário</h3>
                        <p>
                            Ao utilizar o MariLace, o usuário concorda em utilizar a plataforma de maneira responsável 
                            e respeitar os demais integrantes da comunidade. O usuário também é responsável pelo conteúdo 
                            publicado e pelas ações realizadas por meio de sua conta.
                        </p>
                        <p>
                            O MariLace poderá atualizar estes Termos de Uso e suas Diretrizes da Comunidade sempre que 
                            necessário, buscando manter um ambiente seguro e adequado para seus usuários.
                        </p>
                    </section>
                </div>

                {exigeAceite ? (
                    <footer className={styles.rodape}>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={concordo}
                                onChange={(e) => setConcordo(e.target.checked)}
                            />
                            Li e concordo com os Termos de Uso e as Diretrizes da Comunidade.
                        </label>
                        <button
                            className={styles.btnAceitar}
                            onClick={aceitar}
                            disabled={!concordo}
                        >
                            Aceitar e continuar
                        </button>
                    </footer>
                ) : (
                    <footer className={styles.rodape}>
                        <button className={styles.btnAceitar} onClick={fechar}>
                            Fechar
                        </button>
                    </footer>
                )}
            </div>
        </div>
    )
}