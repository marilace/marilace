import styles from './FirebaseConexao.module.css'
import { initializeApp, FirebaseError } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { TbAlertCircleFilled } from "react-icons/tb";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
}

// Inicializa o Firebase
const conexao = initializeApp(firebaseConfig)
// Habilita o serviço de Autenticação
const autenticacao = getAuth(conexao)
export const banco = getFirestore(conexao);
// Disponibiliza o serviço
export {autenticacao}


export function FirebaseConexao() {

    const [mensagemErro, setMensagemErro] = useState('Verificando conexão...');
    const [conectado, setConectado] = useState(false);

    const testarConexao = async () => {
    
        try {

            // Força uma tentativa de login com dados inválidos para gerar uma resposta do Firebase.
            await signInWithEmailAndPassword(autenticacao, 'email_invalido@email.com', '123456')

        } catch (error) {

            // Conversão para objeto de erro específico do Firebase
            if (error instanceof FirebaseError) {

                // O teste ocorre aqui:
                // Se o Firebase responder "auth/user-not-found" ou "auth/invalid-credential",
                // significa que a comunicação foi bem sucedida (o servidor respondeu que o usuário não existe).
                console.log(error.code)
                
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/invalid-credential':
                        setMensagemErro(`Conexão com o Firebase estabelecida com sucesso! ${error.code}`);
                        setConectado(true);            
                        break;

                    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
                        setMensagemErro('Chave de API do Firebase inválida!');
                        setConectado(false);            
                        break;

                    case 'auth/network-request-failed':
                        setMensagemErro('Falha de rede! Verifique sua internet');
                        setConectado(false);            
                        break;

                    case 'auth/too-many-requests':
                        setMensagemErro('IP bloqueado temporariamente por excesso de tentativas (Aguarde alguns minutos).');
                        setConectado(false);            
                        break;            
                }
            } else {
                    setMensagemErro(`Erro imprevisto! (${error})`)
                    setConectado(false)
            }
        }
    }

    useEffect(() => {
        testarConexao()
    }, []);

    if (conectado) {
        console.log(mensagemErro)
    } else {
        return (
        <div className={styles.container}>
            <TbAlertCircleFilled className={styles.icone} />
            <p className={styles.mensagem}>{mensagemErro}</p>
        </div>
        )
    }
}