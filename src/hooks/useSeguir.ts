import { useEffect, useState } from 'react'
import {
    doc,
    onSnapshot,
    increment,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { useAutenticacao } from './useAutenticacao'
import { criarNotificacao } from '../services/Notificacoes'

// Estrutura no Firestore:
// users/{uid}/seguindo/{outroUid}   -> pessoas que {uid} segue
// users/{uid}/seguidores/{outroUid} -> pessoas que seguem {uid}
export function useSeguir(perfilUid: string | undefined) {
    const { usuario } = useAutenticacao()
    const [seguindo, setSeguindo] = useState(false)
    const [carregando, setCarregando] = useState(true)
    const [atualizando, setAtualizando] = useState(false)

    const ehMeuProprioPerfil = !!usuario && usuario.uid === perfilUid

    // Observa se o usuário logado já segue esse perfil específico
    useEffect(() => {
        if (!usuario || !perfilUid || ehMeuProprioPerfil) {
            setCarregando(false)
            return
        }

        const seguindoRef = doc(banco, 'users', usuario.uid, 'seguindo', perfilUid)
        const unsubscribe = onSnapshot(seguindoRef, (snap) => {
            setSeguindo(snap.exists())
            setCarregando(false)
        })

        return () => unsubscribe()
    }, [usuario, perfilUid, ehMeuProprioPerfil])

    const alternarSeguir = async () => {
        if (!usuario || !perfilUid || ehMeuProprioPerfil || atualizando) return

        const seguindoRef = doc(banco, 'users', usuario.uid, 'seguindo', perfilUid)
        const seguidorRef = doc(banco, 'users', perfilUid, 'seguidores', usuario.uid)
        const meuUsuarioRef = doc(banco, 'users', usuario.uid)
        const perfilRef = doc(banco, 'users', perfilUid)

        setAtualizando(true)

        try {
            const batch = writeBatch(banco)

            if (seguindo) {
                batch.delete(seguindoRef)
                batch.delete(seguidorRef)
                batch.update(meuUsuarioRef, { followingCount: increment(-1) })
                batch.update(perfilRef, { followersCount: increment(-1) })

                await batch.commit()
            } else {
                batch.set(seguindoRef, { createdAt: serverTimestamp() })
                batch.set(seguidorRef, { createdAt: serverTimestamp() })
                batch.update(meuUsuarioRef, { followingCount: increment(1) })
                batch.update(perfilRef, { followersCount: increment(1) })

                await batch.commit()

                await criarNotificacao({
                    paraUid: perfilUid,
                    tipo: 'seguidor',
                    titulo: 'Novo seguidor',
                    mensagem: `${usuario.nome ?? usuario.username ?? 'Alguém'} começou a seguir você.`,
                    deQuemId: usuario.uid,
                    deQuemUsername: usuario.username,
                    deQuemNome: usuario.nome,
                    deQuemPhotoURL: usuario.photoURL,
                })
            }
        } finally {
            setAtualizando(false)
        }
    }

    return { seguindo, alternarSeguir, carregando, atualizando, ehMeuProprioPerfil }
}