import { useEffect, useState } from 'react'
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { type UsuarioTipo } from '../types/Usuario'

export function usePerfil(username: string | undefined) {
    const [perfil, setPerfil] = useState<UsuarioTipo | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [naoEncontrado, setNaoEncontrado] = useState(false)

    useEffect(() => {
        if (!username) return

        setCarregando(true)
        setNaoEncontrado(false)

        const q = query(
            collection(banco, 'users'),
            where('username', '==', username.toLowerCase()),
            limit(1)
        )

        const unsubscribe = onSnapshot(q, (snap) => {
            if (snap.empty) {
                setPerfil(null)
                setNaoEncontrado(true)
            } else {
                const docSnap = snap.docs[0]
                const dados = docSnap.data()
                setPerfil({
                    uid: docSnap.id,
                    username: dados.username,
                    email: dados.email ?? '',
                    nome: dados.displayName,
                    bio: dados.bio,
                    photoURL: dados.photoURL,
                    followersCount: dados.followersCount,
                    followingCount: dados.followingCount,
                    emblemas: dados.emblemas ?? [],
                })
            }
            setCarregando(false)
        })

        return () => unsubscribe()
    }, [username])

    return { perfil, carregando, naoEncontrado }
}