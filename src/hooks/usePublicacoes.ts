import { useEffect, useState } from 'react'
import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    orderBy,
    limit,
    where,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'
import { banco } from '../firebase/FirebaseConexao'
import { enviarImagem } from '../services/uploadImagem'
import { type PublicacaoTipo } from '../types/Publicacao'
import { useAutenticacao } from './useAutenticacao'

export function usePublicacoes() {
  const { usuario } = useAutenticacao()

  const criarPublicacao = async (texto: string, arquivoImagem?: File): Promise<string> => {
    if (!usuario) throw new Error('Usuário não autenticado.')

    let imageURL: string | null = null
    if (arquivoImagem) {
      imageURL = await enviarImagem(arquivoImagem)
    }

    const publicacaoRef = await addDoc(collection(banco, 'posts'), {
      authorId: usuario.uid,
      authorUsername: usuario.username,
      authorDisplayName: usuario.nome,
      authorPhotoURL: usuario.photoURL,
      authorEmblemas: usuario.emblemas ?? [],
      text: texto,
      imageURL,
      likesCount: 0,
      commentsCount: 0,
      createdAt: serverTimestamp()
    })

    return publicacaoRef.id
  }

  const editarPublicacao = async (postId: string, novoTexto: string): Promise<void> => {
    if (!usuario) throw new Error('Usuário não autenticado.')

    await updateDoc(doc(banco, 'posts', postId), {
      text: novoTexto,
      editedAt: serverTimestamp()
    })
  }

  const excluirPublicacao = async (postId: string): Promise<void> => {
    if (!usuario) throw new Error('Usuário não autenticado.')

    await deleteDoc(doc(banco, 'posts', postId))
  }

  return { criarPublicacao, editarPublicacao, excluirPublicacao }
}

export function useFeed() {
    const [publicacoes, setPublicacoes] = useState<PublicacaoTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const q = query(
            collection(banco, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(20)
        )

        const unsubscribe = onSnapshot(q, (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PublicacaoTipo)
            setPublicacoes(lista)
            setCarregando(false)
        })

        return () => unsubscribe()
    }, [])

    return { publicacoes, carregando }
    }

export function usePublicacoesDoUsuario(uid: string | undefined) {
  const [publicacoes, setPublicacoes] = useState<PublicacaoTipo[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!uid) {
      setCarregando(false)
      return
    }

    setCarregando(true)

    const q = query(
      collection(banco, 'posts'),
      where('authorId', '==', uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PublicacaoTipo)
        setPublicacoes(lista)
        setCarregando(false)
      },
      (erro) => {
        console.error('Erro ao buscar publicações:', erro)
        setCarregando(false)
      }
    )

    return () => unsubscribe()
  }, [uid])

  return { publicacoes, carregando }
}