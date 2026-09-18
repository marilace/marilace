import styles from './Registro.module.css'

import { HeaderAnon } from '../components/headers/HeaderAnon'
import { FooterAnon } from '../components/footers/FooterAnon'
import { ModalMensagem } from '../components/modais/ModalMensagem'
import imgRegistro from '../assets/img/colagem-cadastro.png'
import { useAutenticacao } from '../hooks/useAutenticacao';
import { type UsuarioTipo } from '../types/Usuario';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { TbLogin2, TbAlertCircle, TbX, TbCheck, TbEye, TbEyeClosed } from "react-icons/tb";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const userSchema = z.object({
        username: z.string().min(3, "Informe um nome de usuário"),
        nome: z.string().min(3, "Informe seu nome"),
        email: z.string().email("Email inválido"),
        senha: z.string()
            .min(8, "A senha deve ter no mínimo 8 caracteres")
            .max(64, "A senha deve ter no máximo 64 caracteres")
            .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
            .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
            .regex(/[0-9]/, "A senha deve conter ao menos um número")
            .regex(/[^A-Za-z0-9]/, "A senha deve conter ao menos um caractere especial (ex: !@#$%)"),

        confirmarSenha: z.string(),
    })
        .refine((data) => data.senha === data.confirmarSenha, {
            message: "As senhas não coincidem",
            path: ["confirmarSenha"],
        });

    type FormValues = z.infer<typeof userSchema>;

const regrasSenha = [
    { label: "Mínimo de 8 caracteres", teste: (v: string) => v.length >= 8 },
    { label: "Ao menos uma letra minúscula", teste: (v: string) => /[a-z]/.test(v) },
    { label: "Ao menos uma letra maiúscula", teste: (v: string) => /[A-Z]/.test(v) },
    { label: "Ao menos um número", teste: (v: string) => /[0-9]/.test(v) },
    { label: "Ao menos um caractere especial (ex: !@#$%)", teste: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function Registro(){

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
    const [cadastroSucesso, setCadastroSucesso] = useState(false)

    const{
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({ 
        resolver: zodResolver (userSchema),
        mode: "onChange",
    });

    const senhaAtual = watch("senha", "");

    const navegacao = useNavigate();


    const dadosUsuario: UsuarioTipo = {
        uid: '',
        email: '',
        senha: '',
        username: '',
        nome: '',
    }

    const {criarAutenticacaoUsuario, deslogar} = useAutenticacao()

    const adicionarUsuario = async (data: FormValues) => {
        dadosUsuario.email = data.email
        dadosUsuario.senha = data.senha
        dadosUsuario.username = data.username
        dadosUsuario.nome = data.nome

        let retorno = await criarAutenticacaoUsuario(data.email, data.senha, data.username, data.nome)

        if (retorno == 'Sucesso!') {
            setModalMensagemTexto(`Seja bem-vindo ${dadosUsuario.nome}!`)
            setCadastroSucesso(true)
        }else {
            setModalMensagemTexto(retorno)
            setCadastroSucesso(false)
        }

        exibirModal()
    }

    const exibirModal = () => {
        setModalMensagemTitulo('Novo usuário')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = async () => {
        setModalMensagemVisivel(false)
        if (cadastroSucesso) {
            navegacao('/forum')
        }
        else {
            await deslogar()
        }
    }

    return(
        <div className={styles.registro}>
            <HeaderAnon/>

            <div className={ styles.containerRegistro }>
                <img
                    src={ imgRegistro }
                    className={ styles.imgRegistro }
                    alt="Colagem ilustrada de uma pessoa apoiada sobre um teclado, com elementos gráficos de um relógio e um caderno com coração, sobre fundo rosa"
                />


                <div className={ styles.conteudoRegistro }>
                    <h2 className={ styles.tituloRegistro }>Registre-se</h2>

                    <form className={ styles.formRegistro }
                        onSubmit = {handleSubmit(adicionarUsuario)}
                        >

                        <div className={ styles.inputContainer }>
                            <label htmlFor="nome">Seu nome:</label>
                            <input 
                                id='nome' 
                                type="text" 
                                {...register("nome")}
                            />
                            {errors.nome && <p className={ styles.erro } role='alert'>
                                <TbAlertCircle className={ styles.icon } aria-hidden="true" />
                                {errors.nome.message}
                            </p>}
                        </div>

                        <div className={ styles.inputContainer }>
                            <label htmlFor="username">Nome de usuário:</label>
                            <input 
                                id='username' 
                                type="text" 
                                {...register("username")}
                            />
                            {errors.username && <p className={ styles.erro } role='alert'>
                                <TbAlertCircle className={ styles.icon } aria-hidden="true" />
                                {errors.username.message}
                            </p>}
                        </div>
                            
                        <div className={ styles.inputContainer }>
                            <label htmlFor="email">Seu e-mail:</label>
                            <input 
                                id='email' 
                                type="email" 
                                {...register("email")}
                            />
                            {errors.email && <p className={ styles.erro } role='alert'>
                                <TbAlertCircle className={ styles.icon } aria-hidden="true" />
                                {errors.email.message}
                            </p>}
                        </div>

                        <div className={ styles.inputContainer }>
                            <label htmlFor="senha">Senha:</label>
                            <div className={ styles.inputSenha }>
                                <input 
                                    id='senha'
                                    type={mostrarSenha ? "text" : "password"} 
                                    {...register("senha")}
                                    aria-describedby="senha-requisitos"
                                />
                                <button
                                    type="button"
                                    className={ styles.btnEye }
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    tabIndex={-1}
                                >
                                    {mostrarSenha ? <TbEyeClosed/> : <TbEye />}
                                </button>
                            </div>

                            {senhaAtual.length > 0 && (
                                <>
                                    <ul id="senha-requisitos" className={ styles.checklistSenha }>
                                        {regrasSenha.map((regra, index) => {
                                            const atendida = regra.teste(senhaAtual);
                                            return (
                                                <li
                                                    key={index}
                                                    className={`${styles.requisitoItem} ${atendida ? styles.requisitoOk : styles.requisitoPendente}`}
                                                >
                                                    <TbX className={ styles.icon } aria-hidden="true" />
                                                    {regra.label}
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {regrasSenha.every((regra) => regra.teste(senhaAtual)) && (
                                        <p className={ styles.senhaForte } role="status">
                                            <TbCheck className={ styles.icon } aria-hidden="true" />
                                            Senha forte!
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className={ styles.inputContainer }>
                            <label htmlFor="confirmarSenha">Confirme sua senha:</label>
                            <div className={ styles.inputSenha }>
                                <input 
                                    id='confirmarSenha' 
                                    type={mostrarConfirmarSenha ? "text" : "password"} 
                                    {...register("confirmarSenha")}
                                />
                                <button
                                    type="button"
                                    className={ styles.btnEye }
                                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                    tabIndex={-1}
                                >
                                    {mostrarConfirmarSenha ? <TbEyeClosed /> : <TbEye />}
                                </button>
                            </div>
                            {errors.confirmarSenha && <p className={ styles.erro } role='alert'>
                                <TbAlertCircle className={ styles.icon } aria-hidden="true" />
                                {errors.confirmarSenha.message}
                            </p>}
                        </div>

                        <button
                            className={ styles.btnForm }
                            type='submit'
                        >
                            Registrar
                        </button>
                    </form>
                    <Link to={'/login'}
                    className={ styles.linkLogin }
                    >
                        Já tem uma conta? Faça log-in 
                        <TbLogin2 className={ styles.icon } size={18} aria-hidden="true" />
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