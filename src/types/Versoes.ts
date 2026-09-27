// registro de versões do MariLace. Cada versão MINOR (0.1, 0.2, 0.3...)
// recebe o apelido de uma mulher importante para a ciência e a tecnologia,
// em ordem alfabética.
export interface VersaoInfo {
    numero: string
    codinome: string
    data: string
}

export const VERSAO_ATUAL: VersaoInfo = {
    numero: '0.2.0-alpha',
    codinome: 'Barbara',
    data: '27 de setembro de 2026',
}

export const HISTORICO_VERSOES: VersaoInfo[] = [
    VERSAO_ATUAL,
    {
        numero: '0.1.0-alpha',
        codinome: 'Ada',
        data: '13 de setembro de 2026',
    },
]