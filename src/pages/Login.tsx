import styles from './Login.module.css'

import { HeaderAnon } from '../components/headers/HeaderAnon'
import { FooterAnon } from '../components/footers/FooterAnon'
import { type UsuarioTipo } from '../types/Usuario'
import { Link, useNavigate } from 'react-router-dom'
import { TbUserPlus, TbAlertCircle, TbEye, TbEyeClosed } from "react-icons/tb";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalMensagem } from '../components/modais/ModalMensagem'
import { useEffect, useState } from 'react'
import { useAutenticacao } from '../hooks/useAutenticacao'

import imgLogin from '../assets/img/colagem-cadastro.png'

type FormValues = {
    email: string
    senha: string
}

const userSchema =  z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres")
});

export function Login(){
    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)

    const exibirModal = () => {
        setModalMensagemVisivel(true)
    }

    const ocultarModal = () => setModalMensagemVisivel(false)

    const {
        register, 
        handleSubmit,
        formState: { errors }, 
    } = useForm<FormValues>({
        resolver: zodResolver(userSchema),}
    )

    const navegacao = useNavigate()
    const autenticacao = useAutenticacao()
    const { usuario, carregando } = autenticacao

    const dadosUsuario: UsuarioTipo = {
        uid: '',
        email: '',
        senha: ''
    }

useEffect(() => {
    if (!carregando && usuario) {
        navegacao('/forum')
    }
}, [usuario, carregando])


    const autenticarUsuario = async (data: FormValues) => {
        dadosUsuario.email = data.email
        dadosUsuario.senha = data.senha

        let retorno = await autenticacao.validarUsuario(data.email, data.senha)

        if(retorno == 'Sucesso!'){
            setModalMensagemTitulo("Bom te ver de novo!")
            setModalMensagemTexto(retorno)
            exibirModal()
        }
        else{
            setModalMensagemTitulo("Algo deu errado...")
            setModalMensagemTexto(retorno)
            exibirModal()
        }
    }

    return(
        <div className={ styles.login }>
            <HeaderAnon/>

            <div className={ styles.containerLogin}>
                <img src={ imgLogin } className={ styles.imgLogin } />

                <div className={ styles.conteudoLogin }>
                    <h2 className={ styles.tituloLogin }>Log-in</h2>

                    <form 
                        className={ styles.formLogin }
                        onSubmit={handleSubmit(autenticarUsuario)}
                    > 

                        <div className={ styles.inputContainer }>
                            
                            <label htmlFor="email">E-mail:</label>
                            <input type='email'
                                {...register("email")}
                            />
                            {errors.email && <p className={ styles.erro }>
                                <TbAlertCircle className={ styles.icon }/>{errors.email.message}
                            </p>}

                        </div>

                        <div className={ styles.inputContainer }>
                            
                            <label htmlFor="senha">Senha:</label>
                            <div className={ styles.inputSenha }>
                                <input 
                                    type={mostrarSenha ? 'text' : 'password'}
                                    {...register("senha")}
                                />
                                <button
                                    type="button"
                                    className={ styles.btnEye }
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    tabIndex={-1}
                                >
                                    {mostrarSenha ? <TbEyeClosed /> : <TbEye />}
                                </button>
                            </div>
                            {errors.senha && <p className={ styles.erro }>
                                <TbAlertCircle className={ styles.icon }/>{errors.senha.message}
                            </p>}

                        </div>

                        <button
                            className={ styles.btnForm }
                            type='submit'
                        >
                            Entrar
                        </button>

                    </form>
                    <Link to={'/register'}
                    className={ styles.linkRegistro }
                    >
                        Não tem uma conta? Registre-se 
                        <TbUserPlus className={ styles.icon } aria-hidden="true" />
                    </Link>

                    <div className={ styles.estrela1 } aria-hidden="true" />
                    <div className={ styles.estrela2 } aria-hidden="true" />

                </div>
            </div>
                <ModalMensagem
                    aberto={modalMensagemVisivel}
                    titulo={modalMensagemTitulo}
                    mensagem={modalMensagemTexto}
                    fechar={() => {
                        ocultarModal()
                    }}
                />
            <FooterAnon/>
        </div>
    )
}