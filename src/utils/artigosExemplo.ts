import { type ArtigoTipo } from '../types/Artigo'

// Artigos estáticos de exemplo, exibidos apenas quando a coleção "artigos"
// do Firestore ainda está vazia (ex.: ambiente de desenvolvimento sem dados
// cadastrados). Servem para demonstrar o layout do blog no TCC. Assim que
// existirem artigos reais no banco, useArtigos() passa a retorná-los e essa
// lista deixa de ser usada automaticamente.
export const artigosExemplo: ArtigoTipo[] = [
    {
        id: 'exemplo-1',
        titulo: 'Como a matemática mudou a exploração espacial',
        descricao: 'Relembrando o papel de calculadoras humanas como Katherine Johnson nas primeiras missões da NASA.',
        imagemURL: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=900&q=80',
        categorias: ['Ciência', 'Matemática'],
        destaque: true,
        createdAt: null,
    },
    {
        id: 'exemplo-2',
        titulo: 'Meninas na programação: um caminho em construção',
        descricao: 'Dados recentes mostram avanços e desafios da presença feminina nos cursos de tecnologia do país.',
        imagemURL: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
        categorias: ['Tecnologia', 'Questões de Gênero'],
        destaque: true,
        createdAt: null,
    },
    {
        id: 'exemplo-3',
        titulo: 'Pontes, prédios e a engenharia por trás deles',
        descricao: 'Um panorama sobre como a engenharia civil pensa segurança, estética e sustentabilidade ao mesmo tempo.',
        imagemURL: 'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=900&q=80',
        categorias: ['Engenharia'],
        destaque: true,
        createdAt: null,
    },
    {
        id: 'exemplo-4',
        titulo: 'Marie Curie e a coragem de errar em nome da ciência',
        descricao: 'A trajetória da primeira pessoa a ganhar dois prêmios Nobel em áreas científicas diferentes.',
        imagemURL: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=80',
        categorias: ['Ciência'],
        destaque: false,
        createdAt: null,
    },
    {
        id: 'exemplo-5',
        titulo: 'Inteligência artificial explicada sem jargões',
        descricao: 'Entenda de forma simples o que é IA, machine learning e por que esses termos estão em toda parte.',
        imagemURL: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80',
        categorias: ['Tecnologia'],
        destaque: false,
        createdAt: null,
    },
    {
        id: 'exemplo-6',
        titulo: 'Por que tão poucas mulheres estão nas exatas?',
        descricao: 'Um olhar sobre estereótipos de gênero na educação e como eles afastam meninas das ciências exatas.',
        imagemURL: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80',
        categorias: ['Questões de Gênero', 'Matemática'],
        destaque: false,
        createdAt: null,
    },
]