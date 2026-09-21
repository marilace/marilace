import { useEffect, useState } from 'react'
import { collection, query, limit, onSnapshot } from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { type UsuarioTipo } from '../types/Usuario'
import { useAutenticacao } from './useAutenticacao'

export function useSugestoes(quantidade = 4) {
    const { usuario } = useAutenticacao()
    const [sugestoes, setSugestoes] = useState<UsuarioTipo[]>([])

    useEffect(() => {
        const q = query(collection(banco, 'users'), limit(quantidade + 1))

        const unsubscribe = onSnapshot(q, (snap) => {
            const lista = snap.docs
                .map((d) => {
                    const dados = d.data()
                    return {
                        uid: d.id,
                        photoURL: dados.photoURL,
                        username: dados.username,
                        nome: dados.displayName,
                        emblemas: dados.emblemas ?? [],
                    } as UsuarioTipo
                })
                .filter((u) => u.uid !== usuario?.uid)
                .slice(0, quantidade)

            setSugestoes(lista)
        })

        return () => unsubscribe()
    }, [usuario?.uid, quantidade])

    return { sugestoes }
}