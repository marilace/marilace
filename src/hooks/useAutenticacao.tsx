import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { autenticacao, banco } from '../firebase/FirebaseConexao'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore'
import { useContext } from 'react'
import { AutenticacaoContexto } from '../contexts/AutenticacaoContexto'
import { enviarImagem } from '../services/uploadImagem'

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
                photoURL: '',
                followersCount: 0,
                followingCount: 0,
            })

            // reserva o username
            await setDoc(usernameRef, { uid })

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

    const atualizarPerfil = async (dados: { displayName: string; bio: string; emblemas: string[] }): Promise<string> => {
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

    return { criarAutenticacaoUsuario, validarUsuario, deslogar, atualizarPerfil, atualizarFotoPerfil, alterarUsername, usuario, carregando }
}

