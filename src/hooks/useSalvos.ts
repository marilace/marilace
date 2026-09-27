import { useEffect, useState } from 'react'
import {
    doc,
    setDoc,
    deleteDoc,
    getDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { useAutenticacao } from './useAutenticacao'
import { type TipoSalvo, type ItemSalvo } from '../types/Salvo'
import { type PublicacaoTipo } from '../types/Publicacao'
import { type ArtigoTipo } from '../types/Artigo'

// Observa e alterna se um post ou artigo específico está salvo pela usuária logada.
// Cada item salvo vira um documento em users/{uid}/salvos/{itemId}.
export function useSalvo(itemId: string, tipo: TipoSalvo) {
    const { usuario } = useAutenticacao()
    const [salvo, setSalvo] = useState(false)
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        if (!usuario) {
            setSalvo(false)
            return
        }

        const salvoRef = doc(banco, 'users', usuario.uid, 'salvos', itemId)
        const unsubscribe = onSnapshot(
            salvoRef,
            (snap) => {
                setSalvo(snap.exists())
            },
            (erro) => {
                console.error('Erro ao observar item salvo:', erro)
            }
        )

        return () => unsubscribe()
    }, [itemId, usuario])

    const alternarSalvo = async () => {
        if (!usuario) {
            console.warn('Tentativa de salvar sem usuária autenticada.')
            return
        }

        setSalvando(true)
        try {
            const salvoRef = doc(banco, 'users', usuario.uid, 'salvos', itemId)
            const snap = await getDoc(salvoRef)

            if (snap.exists()) {
                await deleteDoc(salvoRef)
            } else {
                await setDoc(salvoRef, { tipo, criadoEm: serverTimestamp() })
            }
        } catch (erro) {
            console.error('Erro ao salvar/remover item:', erro)
        } finally {
            setSalvando(false)
        }
    }

    return { salvo, alternarSalvo, salvando }
}

// Busca todos os posts e artigos que a usuária logada salvou, já com os
// dados completos de cada item, do mais recente ao mais antigo.
export function useItensSalvos() {
    const { usuario } = useAutenticacao()
    const [itens, setItens] = useState<ItemSalvo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        if (!usuario) {
            setItens([])
            setCarregando(false)
            return
        }

        setCarregando(true)

        const q = query(
            collection(banco, 'users', usuario.uid, 'salvos'),
            orderBy('criadoEm', 'desc')
        )

        const unsubscribe = onSnapshot(
            q,
            async (snap) => {
                const resultados = await Promise.all(
                    snap.docs.map(async (salvoDoc) => {
                        const { tipo } = salvoDoc.data() as { tipo: TipoSalvo }
                        const colecao = tipo === 'artigo' ? 'artigos' : 'posts'

                        try {
                            const itemSnap = await getDoc(doc(banco, colecao, salvoDoc.id))
                            if (!itemSnap.exists()) return null

                            if (tipo === 'artigo') {
                                return {
                                    tipo,
                                    dados: { id: itemSnap.id, ...itemSnap.data() } as ArtigoTipo
                                } satisfies ItemSalvo
                            }

                            return {
                                tipo,
                                dados: { id: itemSnap.id, ...itemSnap.data() } as PublicacaoTipo
                            } satisfies ItemSalvo
                        } catch (erro) {
                            console.error('Erro ao buscar item salvo:', erro)
                            return null
                        }
                    })
                )

                setItens(resultados.filter((item): item is ItemSalvo => item !== null))
                setCarregando(false)
            },
            (erro) => {
                console.error('Erro ao buscar itens salvos:', erro)
                setCarregando(false)
            }
        )

        return () => unsubscribe()
    }, [usuario])

    return { itens, carregando }
}