import { type OportunidadeTipo } from '../types/Oportunidade'

// Dados estáticos de exemplo, usados enquanto ainda não existe uma coleção
// "oportunidades" no Firestore. Servem para demonstrar o layout da página
// no TCC. Quando houver um backend real, basta criar um hook (ex.:
// useOportunidades, no mesmo molde de useArtigos) e substituir esta lista
// pelos dados vindos do banco.
export const oportunidadesExemplo: OportunidadeTipo[] = [
    {
        id: 'exemplo-1',
        titulo: 'Estágio em Desenvolvimento Front-end',
        instituicao: 'Instituto Avança Tech',
        categoria: 'Estágio',
        modalidade: 'Remoto',
        descricao: 'Vaga voltada a estudantes de tecnologia a partir do 3º semestre, com bolsa e horário flexível para conciliar com a faculdade.',
        tags: ['Tecnologia', 'React'],
        prazo: 'Inscrições até 15/11',
        link: '#',
    },
    {
        id: 'exemplo-2',
        titulo: 'Bolsa de Iniciação Científica em Engenharia',
        instituicao: 'Universidade Federal de Exemplolândia',
        categoria: 'Bolsa',
        modalidade: 'Presencial',
        local: 'Campinas, SP',
        descricao: 'Bolsa para pesquisa em materiais sustentáveis, com orientação de uma professora do departamento de Engenharia Civil.',
        tags: ['Engenharia', 'Ciência'],
        prazo: 'Inscrições até 30/11',
        link: '#',
    },
    {
        id: 'exemplo-3',
        titulo: 'Mentoria: Mulheres na Computação',
        instituicao: 'Grupo Marilace de Mentoria',
        categoria: 'Mentoria',
        modalidade: 'Remoto',
        descricao: 'Encontros quinzenais com profissionais da área de exatas para apoiar estudantes na transição para o mercado de trabalho.',
        tags: ['Tecnologia', 'Carreira'],
        prazo: 'Turmas abertas o ano todo',
        link: '#',
    },
    {
        id: 'exemplo-4',
        titulo: 'Vaga Júnior de Análise de Dados',
        instituicao: 'Coletivo Dados & Elas',
        categoria: 'Vaga',
        modalidade: 'Híbrido',
        local: 'São Paulo, SP',
        descricao: 'Primeira oportunidade formal em análise de dados, com programa de acolhimento para quem está entrando no mercado.',
        tags: ['Tecnologia', 'Matemática'],
        prazo: 'Inscrições até 05/12',
        link: '#',
    },
    {
        id: 'exemplo-5',
        titulo: 'Semana de Meninas na Ciência',
        instituicao: 'Instituto Ada',
        categoria: 'Evento',
        modalidade: 'Presencial',
        local: 'Belo Horizonte, MG',
        descricao: 'Oficinas e rodas de conversa gratuitas sobre carreiras em ciência e engenharia, com direito a certificado.',
        tags: ['Ciência', 'Questões de Gênero'],
        prazo: '10 a 14/11',
        link: '#',
    },
    {
        id: 'exemplo-6',
        titulo: 'Bolsa de Intercâmbio em Robótica',
        instituicao: 'Rede Meninas Digitais',
        categoria: 'Bolsa',
        modalidade: 'Presencial',
        local: 'Curitiba, PR',
        descricao: 'Programa de duas semanas em um laboratório parceiro, com bolsa integral para estudantes de engenharia e computação.',
        tags: ['Engenharia', 'Tecnologia'],
        prazo: 'Inscrições até 20/12',
        link: '#',
    },
]