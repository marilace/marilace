// formatação p/ pesquisa
export function formatarTexto(texto: string): string {
    return texto
        .normalize('NFD') //separa o acento da letra
        .replace(/[\u0300-\u036f]/g, '') //remove os acentos
        .toLowerCase() //deixa tudo minusculo
        .trim() //tira os espaços no começo e no final
        .replace(/^@/, '') //remove o @ do começo
}