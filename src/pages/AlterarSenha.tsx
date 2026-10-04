import styles from './AlterarSenha.module.css'
import { HeaderAnon } from '../components/headers/HeaderAnon'
import { TbChevronLeft, TbEyeClosed, TbEye, TbLock } from "react-icons/tb";
import { useEffect, useState } from 'react';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAutenticacao } from '../hooks/useAutenticacao';

const fundo = 'https://i.imgur.com/0x40IR0.png'

const alterarSenhaSchema = z.object({
    senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    confirmarSenha: z.string(),
}).refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
})

type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>

export function AlterarSenha(){

    const { verificarCodigoRedefinicao, redefinirSenha } = useAutenticacao()
    const [searchParams] = useSearchParams()
    const navegacao = useNavigate()
    const oobCode = searchParams.get('oobCode')
    const modo = searchParams.get('mode')

    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
    const [statusLink, setStatusLink] = useState<'verificando' | 'valido' | 'invalido'>('verificando')
    const [erroLink, setErroLink] = useState('')
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<AlterarSenhaFormData>({
        resolver: zodResolver(alterarSenhaSchema)
    })

    useEffect(() => {
        const verificar = async () => {
            if (!oobCode || modo !== 'resetPassword') {
                setErroLink('Esse link de redefinição é inválido. Solicite um novo pelo "Esqueci minha senha".')
                setStatusLink('invalido')
                return
            }

            const resultado = await verificarCodigoRedefinicao(oobCode)

            if (resultado === 'Sucesso!') {
                setStatusLink('valido')
            } else {
                setErroLink(resultado)
                setStatusLink('invalido')
            }
        }

        verificar()

    }, [oobCode, modo, verificarCodigoRedefinicao])

    const handleRedefinirSenha = async (dados: AlterarSenhaFormData) => {
        if (!oobCode || statusLink !== 'valido') { return }

        setMensagem(null)
        const resultado = await redefinirSenha(oobCode, dados.senha)

        if (resultado === 'Sucesso!') {
            setMensagem({
                tipo: 'sucesso',
                texto: 'Senha redefinida com sucesso! Redirecionando para o login...'
            })
            setTimeout(() => navegacao('/login'), 2500)
        } else {
            setMensagem({
                tipo: 'erro',
                texto: resultado
            })
        }
    }

    return(
        <div className={ styles.page }>
            <HeaderAnon/>
            <div className={ styles.container } >
                <img src={ fundo } className={ styles.fundo } />
                <main className={ styles.containerForm }>
                    <div className={ styles.texto }>
                        <TbLock className={ styles.iconTexto } size={56}/>
                        <h1>Redefinir senha</h1>
                    </div>

                    {statusLink === 'verificando' && (
                        <p className={ styles.textoCarregando }>
                            Verificando seu link de redefinição...
                        </p>
                    )}

                    {statusLink === 'invalido' && (
                        <>
                            <p className={ styles.msgErro }>{erroLink}</p>
                            <Link to='/esqueci-senha' className={ styles.voltar }>
                                <TbChevronLeft className={ styles.icon } size={20}/>
                                Solicitar novo link
                            </Link>
                        </>
                    )}

                    {statusLink === 'valido' && (
                        <form
                            className={ styles.form }
                            onSubmit={ handleSubmit(handleRedefinirSenha) }
                        >
                            <div className={ styles.inputContainer }>
                                <label htmlFor="senha">Nova senha:</label>
                                <div className={ styles.inputSenha}>
                                    <input
                                        id='senha'
                                        type={mostrarSenha ? "text" : "password"}
                                        {...register('senha')}
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
                                {errors.senha && <span className={styles.erro}>{errors.senha.message}</span>}
                            </div>

                            <div className={ styles.inputContainer }>
                                <label htmlFor="confirmarSenha">Confirme sua senha:</label>
                                <div className={ styles.inputSenha }>
                                    <input
                                        id='confirmarSenha'
                                        type={mostrarConfirmarSenha ? "text" : "password"}
                                        {...register('confirmarSenha')}
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
                                {errors.confirmarSenha && <span className={styles.erro}>{errors.confirmarSenha.message}</span>}
                            </div>

                            {mensagem && (
                                <p className={mensagem.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>
                                    {mensagem.texto}
                                </p>
                            )}

                            <button
                                className={ styles.btnForm }
                                type='submit'
                                disabled={isSubmitting || mensagem?.tipo === 'sucesso'}
                            >
                                {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
                            </button>

                            <Link to='/login' className={ styles.voltar }>
                                <TbChevronLeft className={ styles.icon } size={20}/>
                                Voltar para o login
                            </Link>
                        </form>
                    )}
                </main>
            </div>
        </div>
    )
}