import styles from './EsqueciSenha.module.css'
import { HeaderAnon } from '../components/headers/HeaderAnon'
import { TbMoodPuzzled, TbChevronLeft, TbMail } from "react-icons/tb";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAutenticacao } from '../hooks/useAutenticacao';
import { useState } from 'react';

const fundo = 'https://i.imgur.com/0x40IR0.png'

const esqueciSenhaSchema = z.object({
    email: z.string().email('Insira um e-mail válido.'),
})

type EsqueciSenhaFormData = z.infer<typeof esqueciSenhaSchema>

export function EsqueciSenha(){
    const { recuperarSenha } = useAutenticacao()
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<EsqueciSenhaFormData>({
        resolver: zodResolver(esqueciSenhaSchema)
    })

    const handleRecuperarSenha = async (data: EsqueciSenhaFormData) => {
        setMensagem(null)
        const resultado = await recuperarSenha(data.email)

        if (resultado === 'Sucesso!') {
            setMensagem({
                tipo: 'sucesso',
                texto: 'Pronto! O link já foi enviado para você. ;)'
            })
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
                        <TbMoodPuzzled className={ styles.iconTexto } size={56}/>
                        <h1>Esqueceu a senha?</h1>
                        <p>Tá tudo bem! É só digitar seu e-mail e enviaremos um link de recuperação para você! :)</p>
                    </div>
                    <form 
                        className={ styles.form }
                        onSubmit={handleSubmit(handleRecuperarSenha)}
                    >
                        <div className={ styles.inputContainer }>
                            <label htmlFor="email">Email:</label>
                            <div className={ styles.inputEmail}>
                                <TbMail className={ styles.iconInput } size={24}/>
                                <input 
                                    id="email"
                                    type='email'
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && <span className={styles.erro}>{errors.email.message}</span>}
                        </div>

                        {mensagem && (
                            <p className={mensagem.tipo === 'sucesso' ? styles.msgSucesso : styles.msgErro}>
                                {mensagem.texto}
                            </p>
                        )}

                        <button
                            className={ styles.btnForm }
                            type='submit'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar link'}
                        </button>
                        <Link to='/login' className={ styles.voltar }>
                            <TbChevronLeft className={ styles.icon } size={20}/>
                            Voltar para o login
                        </Link>
                    </form>
                </main>
            </div>
        </div>
    )
}