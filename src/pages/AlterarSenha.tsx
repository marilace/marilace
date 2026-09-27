import styles from './AlterarSenha.module.css'
import { HeaderAnon } from '../components/headers/HeaderAnon'
import { TbChevronLeft, TbEyeClosed, TbEye, TbLock } from "react-icons/tb";
import { useState } from 'react';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

const fundo = 'https://i.imgur.com/0x40IR0.png'

export function AlterarSenha(){

    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

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
                    <form className={ styles.form }>
                        <div className={ styles.inputContainer }>
                            <label htmlFor="senha">Nova senha:</label>
                            <div className={ styles.inputSenha}>
                                <input
                                    id='senha'
                                    type={mostrarSenha ? "text" : "password"}
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
                        </div>

                        <div className={ styles.inputContainer }>
                            <label htmlFor="senha">Confirme sua senha:</label>
                            <div className={ styles.inputSenha }>
                                <input
                                    id='confirmarSenha' 
                                    type={mostrarConfirmarSenha ? "text" : "password"} 
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
                        </div>

                        <button
                            className={ styles.btnForm }
                            type='submit'
                        >
                            Entrar
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