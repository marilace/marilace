import { createContext, useEffect, useState } from "react";
import { type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { autenticacao, banco } from "../firebase/FirebaseConexao";
import { type UsuarioTipo } from "../types/Usuario";

type AutenticacaoContextoTipo = {
    usuario: UsuarioTipo | null
    carregando: boolean
}

interface AutenticacaoProviderProps {
    children: ReactNode
}

export const AutenticacaoContexto = createContext<AutenticacaoContextoTipo | undefined>(undefined)

export function AutenticacaoProvider({ children }: AutenticacaoProviderProps) {

    const [uidAtual, setUidAtual] = useState<string | null>(null)
    const [usuario, setUsuario] = useState<UsuarioTipo | null>(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(autenticacao, (usuarioFirebase) => {
            if (usuarioFirebase) {
                setUidAtual(usuarioFirebase.uid)
            } else {
                setUidAtual(null)
                setUsuario(null)
                setCarregando(false)
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (!uidAtual) return

        const usuarioRef = doc(banco, 'users', uidAtual)
        const unsubscribe = onSnapshot(usuarioRef, (snap) => {
            if (snap.exists()) {
                const dados = snap.data()
                setUsuario({
                    uid: uidAtual,
                    username: dados.username,
                    email: dados.email ?? autenticacao.currentUser?.email ?? '',
                    nome: dados.displayName,
                    bio: dados.bio,
                    photoURL: dados.photoURL,
                    followersCount: dados.followersCount,
                    followingCount: dados.followingCount,
                    emblemas: dados.emblemas ?? [],
                })
            } else {
                setUsuario(null)
            }
            setCarregando(false)
        })

        return () => unsubscribe()
    }, [uidAtual])

    return (
        <AutenticacaoContexto.Provider value={{ usuario, carregando }}>
            {children}
        </AutenticacaoContexto.Provider>
    )
}