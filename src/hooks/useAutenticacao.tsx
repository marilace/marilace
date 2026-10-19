import { FirebaseError } from 'firebase/app'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    verifyPasswordResetCode, 
    confirmPasswordReset,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    collection, 
    query, 
    where, 
    getDocs, 
    writeBatch,
    runTransaction
} from 'firebase/firestore'
import { autenticacao, banco } from '../firebase/FirebaseConexao'
import { useContext } from 'react'
import { criarNotificacao } from '../services/Notificacoes'
import { AutenticacaoContexto } from '../contexts/AutenticacaoContexto'
import { enviarImagem, enviarFotoGoogle } from '../services/uploadImagem'
import type { LinksPerfil } from '../types/Usuario'

export function useAutenticacao(){
    const autenticacaoContexto = useContext(AutenticacaoContexto)

    if (autenticacaoContexto === undefined) {
        throw new Error('Falta o <AutenticacaoProvider> na aplicação!')
    }

    const { usuario, carregando } = autenticacaoContexto

    const criarAutenticacaoUsuario = async ( email: string, senha: string, username: string, nome: string ): Promise<string> => {
        let retorno = 'Sucesso!'
        const usernameFormatado = username.toLowerCase().trim()

        try {
            // verifica se o username já está em uso
            const usernameRef = doc(banco, 'usernames', usernameFormatado)
            const usernameSnap = await getDoc(usernameRef)

            if (usernameSnap.exists()) {
                return 'Esse nome de usuário já está em uso.'
            }

            // cria a autenticação do usuário
            const credenciais = await createUserWithEmailAndPassword(autenticacao, email, senha)
            const uid = credenciais.user.uid

            // cria o documento do usuário no Firestore
            await setDoc(doc(banco, 'users', uid), {
                username: usernameFormatado,
                displayName: nome,
                bio: '',
                pronomes: '',
                photoURL: '',
                followersCount: 0,
                followingCount: 0,
            })

            // reserva o username
            await setDoc(usernameRef, { uid })

            // notificação de boas-vindas
            await criarNotificacao({
                paraUid: uid,
                tipo: 'sistema',
                titulo: 'Boas-vindas ao MariLace!',
                mensagem: 'Estamos muito felizes de ver você aqui! Esperamos que tenha uma experiência incrível usando o MariLace :)',
            })

        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        retorno = `Esse endereço e-mail já está sendo usado por outra conta. ${error.code}`
                        break
                    case 'auth/user-not-found':
                        retorno = 'Esse usuário não existe.'
                        break
                    case 'auth/invalid-credential':
                        retorno = 'Credenciais incorretas! Verifique seu e-mail e senha novamente.'
                        break
                    case 'auth/wrong-password':
                        retorno = 'Senha incorreta! Tente novamente.'
                        break
                    default:
                        retorno = `Erro na criação da autenticação do usuário! (${error.code}: ${error.message})`
                        break
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }


    const validarUsuario = async (email: string, senha: string): Promise<string> => {
        let retorno = 'Sucesso!'
        try {
            await signInWithEmailAndPassword(autenticacao, email, senha)
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                default:
                    retorno = `Erro na autenticação do usuário! (${error.code}: ${error.message})`
                    break         
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }


const autenticarComGoogle = async (): Promise<string> => {
    try {
        const provedor = new GoogleAuthProvider()
        const resultado = await signInWithPopup(autenticacao, provedor)
        const usuarioGoogle = resultado.user

        const usuarioRef = doc(banco, 'users', usuarioGoogle.uid)
        const usuarioSnap = await getDoc(usuarioRef)

        // Se o perfil já existe, apenas faz login.
        if (usuarioSnap.exists()) {
            return 'Sucesso!'
        }

        const nomeBase = (
            usuarioGoogle.email?.split('@')[0] ||
            usuarioGoogle.displayName ||
            'usuario'
        )
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')
            .slice(0, 20) || 'usuario'

        // envia a foto pro cloudinary
        let photoURL = usuarioGoogle.photoURL || ''

        if (usuarioGoogle.photoURL) {
            try {
                photoURL = await enviarFotoGoogle(usuarioGoogle.photoURL)
            } catch (error) {
                console.error(
                    'Erro ao enviar foto para o Cloudinary:',
                    error
                )
                photoURL = usuarioGoogle.photoURL
            }
        }

        const novoCadastro = await runTransaction(
            banco,
            async (transacao) => {
                const usuarioAtual = await transacao.get(usuarioRef)

                if (usuarioAtual.exists()) {
                    return false
                }

                let username = nomeBase
                let contador = 1
                let usernameRef = doc(banco, 'usernames', username)
                let usernameSnap = await transacao.get(usernameRef)

                while (usernameSnap.exists()) {
                    username = `${nomeBase}${contador}`
                    contador++

                    usernameRef = doc(banco, 'usernames', username)
                    usernameSnap = await transacao.get(usernameRef)
                }

                transacao.set(usuarioRef, {
                    username,
                    displayName: usuarioGoogle.displayName || '',
                    email: usuarioGoogle.email || '',
                    bio: '',
                    pronomes: '',
                    photoURL,
                    followersCount: 0,
                    followingCount: 0,
                    emblemas: []
                })

                transacao.set(usernameRef, {
                    uid: usuarioGoogle.uid
                })

                return true
            }
        )

        // Cria a notificação somente para novos cadastros.
        if (novoCadastro) {
            try {
                await criarNotificacao({
                    paraUid: usuarioGoogle.uid,
                    tipo: 'sistema',
                    titulo: 'Boas-vindas ao MariLace!',
                    mensagem:
                        'Estamos muito felizes de ver você aqui! Esperamos que tenha uma experiência incrível usando o MariLace :)'
                })
            } catch (error) {
                console.error(
                    'Erro ao criar notificação de boas-vindas:',
                    error
                )
            }
        }

        return 'Sucesso!'
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    return 'A janela de login foi fechada antes da conclusão.'

                case 'auth/cancelled-popup-request':
                    return 'Já existe uma solicitação de login em andamento.'

                case 'auth/unauthorized-domain':
                    return 'Este domínio não está autorizado no Firebase.'

                case 'auth/account-exists-with-different-credential':
                    return 'Já existe uma conta com este e-mail usando outro método de login.'

                case 'permission-denied':
                    return 'Sem permissão para criar o perfil no banco de dados.'

                default:
                    return `Erro na autenticação com Google! (${error.code}: ${error.message})`
            }
        }

        return `Erro imprevisto na autenticação com Google! (${error})`
    }
}


    const deslogar = async (): Promise<string> => {
        let retorno = 'Sucesso!'
        try {
            await signOut(autenticacao)
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                default:
                    retorno = `Erro ao deslogar o usuário! (${error.code}: ${error.message})`
                    break         
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }

    const sincronizarDadosAutorNosPosts = async (
        dadosAtualizados: Partial<{
            authorUsername: string
            authorDisplayName: string
            authorPhotoURL: string
            authorEmblemas: string[]
        }>
    ) => {
        if (!usuario) return

        const postsRef = collection(banco, 'posts')
        const q = query(postsRef, where('authorId', '==', usuario.uid))
        const snap = await getDocs(q)

        if (snap.empty) return

        const tamanhoLote = 450
        const docs = snap.docs

        for (let i = 0; i < docs.length; i += tamanhoLote) {
            const lote = docs.slice(i, i + tamanhoLote)
            const batch = writeBatch(banco)

            lote.forEach((postSnap) => {
                batch.update(postSnap.ref, dadosAtualizados)
            })

            await batch.commit()
        }
    }

    const atualizarPerfil = async (dados: { displayName: string; bio: string; pronomes: string; emblemas: string[] }): Promise<string> => {
        let retorno = 'sucesso'
        try {
            if (!usuario) throw new Error('Usuário não autenticado.')
            await updateDoc(doc(banco, 'users', usuario.uid), dados)
            await sincronizarDadosAutorNosPosts({ 
                authorDisplayName: dados.displayName,
                authorEmblemas: dados.emblemas,
            })
        } catch (error) {
            retorno = `Erro ao atualizar perfil! (${error})`
        }
        return retorno
    }

    const atualizarFotoPerfil = async (arquivo: File): Promise<string> => {
        let retorno = 'sucesso'
        try {
            if (!usuario) throw new Error('Usuário não autenticado.')
            const photoURL = await enviarImagem(arquivo)
            await updateDoc(doc(banco, 'users', usuario.uid), { photoURL })
            await sincronizarDadosAutorNosPosts({ authorPhotoURL: photoURL })
        } catch (error) {
            retorno = `Erro ao atualizar foto de perfil! (${error})`
        }
        return retorno
    }

    const alterarUsername = async (novoUsername: string): Promise<string> => {
        let retorno = 'sucesso'
        try {
            if (!usuario) throw new Error('Usuário não autenticado.')
            if (!usuario.username) throw new Error('Usuário sem username definido.')

            const usernameAtual = usuario.username
            const novo = novoUsername.toLowerCase().trim()
            const novoRef = doc(banco, 'usernames', novo)

            const existe = await getDoc(novoRef)
            if (existe.exists()) return 'Esse nome de usuário já está em uso.'

            await setDoc(novoRef, { uid: usuario.uid })
            await deleteDoc(doc(banco, 'usernames', usernameAtual))
            await updateDoc(doc(banco, 'users', usuario.uid), { username: novo })
            await sincronizarDadosAutorNosPosts({ authorUsername: novo })

        } catch (error) {
            retorno = `Erro ao alterar username! (${error})`
        }
        return retorno
    }

    const atualizarLinks = async (links: LinksPerfil): Promise<string> => {
        let retorno = 'sucesso'
        try {
            if (!usuario) throw new Error('Usuário não autenticado.')
            await updateDoc(doc(banco, 'users', usuario.uid), { links })
        } catch (error) {
            retorno = `Erro ao atualizar links! (${error})`
        }
        return retorno
    }

    const recuperarSenha = async (email: string): Promise<string> => {
        let retorno = 'Sucesso!'
        try{
            await sendPasswordResetEmail(autenticacao, email)
        }catch (error) {
            if(error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        retorno = 'Essa conta não existe.'
                        break
                    case 'auth/invalid-email':
                        retorno = 'E-mail inválido.'
                        break
                    case 'auth/too-many-requests':
                        retorno = 'Muitas tentativas. Tente novamente mais tarde.'
                        break
                    default:
                        retorno = `Erro ao enviar e-mail de recuperação! (${error.code})`
                        break
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }
        const verificarCodigoRedefinicao = async (oobCode: string): Promise<string> => {
        let retorno = 'Sucesso!'
        try {
            await verifyPasswordResetCode(autenticacao, oobCode)
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/expired-action-code':
                        retorno = 'Esse link de redefinição expirou. Solicite um novo.'
                        break
                    case 'auth/invalid-action-code':
                        retorno = 'Esse link de redefinição é inválido ou já foi usado.'
                        break
                    case 'auth/user-disabled':
                        retorno = 'Essa conta foi desativada.'
                        break
                    case 'auth/user-not-found':
                        retorno = 'Essa conta não existe mais.'
                        break
                    default:
                        retorno = `Erro ao verificar o link de redefinição! (${error.code})`
                        break
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }

    const redefinirSenha = async (oobCode: string, novaSenha: string): Promise<string> => {
        let retorno = 'Sucesso!'
        try {
            await confirmPasswordReset(autenticacao, oobCode, novaSenha)
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/expired-action-code':
                        retorno = 'Esse link de redefinição expirou. Solicite um novo.'
                        break
                    case 'auth/invalid-action-code':
                        retorno = 'Esse link de redefinição é inválido ou já foi usado.'
                        break
                    case 'auth/weak-password':
                        retorno = 'Essa senha é muito fraca. Escolha uma senha mais forte.'
                        break
                    default:
                        retorno = `Erro ao redefinir a senha! (${error.code})`
                        break
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }

    return { 
        criarAutenticacaoUsuario, 
        validarUsuario, 
        autenticarComGoogle, 
        deslogar, 
        atualizarPerfil, 
        atualizarFotoPerfil, 
        alterarUsername, 
        atualizarLinks, 
        recuperarSenha, 
        verificarCodigoRedefinicao, 
        redefinirSenha, 
        usuario, 
        carregando 
    }
}