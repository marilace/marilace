/**
 * envia uma imagem para o Cloudinary usando um upload sem assinatura no back-end
 *
 * OBJETIVO:
 * fazer o upload de um arquivo de imagem escolhido pelo usuário diretamente do 
 * front-end para o Cloudinary, sem precisar passar pelo nosso Firebase, já que seu
 * serviço de armazenamento de imagens é pago. O Cloudinary armazena a imagem e 
 * devolve uma URL pública que pode vai ser salva no Firestore junto com o restante 
 * dos dados do usuário e da postagem.
 *
 * COMO FUNCIONA:
 * 1. monta um `FormData`, formato exigido pela API do Cloudinary para receber os arquivos.
 * 2. faz um POST para `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`.
 *    - o {cloud_name} identifica a conta do Cloudinary que vai receber o arquivo
 *    - o /image/upload é específico para uploads de imagem (existe também o `/video/upload`,
 *      `/raw/upload`, etc., para outros tipos de arquivo)
 * 3. como não enviamos uma assinatura gerada no back-end, o upload só funciona porque o
 * `upload_preset` está configurado no painel do Cloudinary como "unsigned"
 * 4. o Cloudinary retorna uma URL da imagem
 *
 * @param arquivo imagem escolhida pelo usuário.
 * @returns promise com a URL da imagem salva no Cloudinary
 * @throws error caso o envio da imagem falhe
 */


export async function enviarImagem(arquivo: File): Promise<string> {

    // cria o FormData que será usado para enviar a imagem, precisamos dele porque estamos
    // enviando um arquivo binario
    const formData = new FormData()
    formData.append('file', arquivo) // campo obrigatório da API, aqui é um arquivo binario
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) // nome do preset de upload que configuramos no painel do Cloudinary

    // envia a imagem para o Cloudinary
    const resposta = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
    )

    // devolve um erro caso o enivo não tenha dado certo
    if (!resposta.ok) {
        throw new Error('Falha ao enviar a imagem.')
    }

    // a resposta da API do Cloudinary é um JSON com vários dados do
    // arquivo. Alguns dos campos mais comuns retornados (além de `secure_url`, 
    // que é o campo que usamos aqui) são:
    //   - public_id: identificador do arquivo dentro do Cloudinary, usado para 
    //   referenciar, transformar ou excluir o arquivo depois
    //   - url: URL de acesso HTTP
    //   - secure_url: URL de acesso HTTPS
    //   - format: formato detectado do arquivo (jpg, png, webp, etc.)
    //   - width / height: altura e largura da imagem
    //   - bytes: tamanho do arquivo
    //   - resource_type: tipo do arquivo (image, video, raw)
    //   - created_at: horário de quando o upload foi feito
    //   - original_filename: nome original do arquivo
    const dados = await resposta.json()

    // retornamos apenas o secure_url, que é o dado precisa que o Firestore precisa (campo photoURL)
    return dados.secure_url
}