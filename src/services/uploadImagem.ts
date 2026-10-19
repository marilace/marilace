export async function enviarImagem(arquivo: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', arquivo)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    const resposta = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
    )

    if (!resposta.ok) {
        throw new Error('Falha ao enviar a imagem.')
    }

    const dados = await resposta.json()

    return dados.secure_url
}


export async function enviarFotoGoogle(photoURL: string): Promise<string> {
    const resposta = await fetch(photoURL)

    if (!resposta.ok) {
        throw new Error('Não foi possível obter a foto do Google.')
    }

    const imagem = await resposta.blob()
    const arquivo = new File([imagem], 'foto-google.jpg', {
        type: imagem.type || 'image/jpeg'
    })

    return await enviarImagem(arquivo)
}
