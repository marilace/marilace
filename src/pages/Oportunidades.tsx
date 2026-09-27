import styles from './Oportunidades.module.css'
import { useState } from 'react'
import { TbBriefcase } from "react-icons/tb";
import { ChipClicavel } from '../components/misc/ChipClicavel'
import { CardOportunidade } from '../components/misc/CardOportunidade'
import { oportunidadesExemplo } from '../utils/oportunidadesExemplo'
import { type CategoriaOportunidade } from '../types/Oportunidade'

type Filtro = 'Todos' | CategoriaOportunidade

const CATEGORIAS: Filtro[] = ['Todos', 'Vaga', 'Estágio', 'Bolsa', 'Mentoria', 'Evento']

export function Oportunidades(){
    const [filtro, setFiltro] = useState<Filtro>('Todos')

    // Por enquanto a lista vem de dados estáticos de exemplo (veja
    // src/utils/oportunidadesExemplo.ts), só para ilustrar como a página
    // vai se comportar quando houver oportunidades reais cadastradas.
    const oportunidades = oportunidadesExemplo
    const oportunidadesFiltradas = oportunidades.filter(
        (oportunidade) => filtro === 'Todos' || oportunidade.categoria === filtro
    )

    return (
        <main className={ styles.oportunidades }>
            <div className={ styles.cabecalho }>
                <h1 className={ styles.titulo }>Oportunidades</h1>
                <p className={ styles.subtitulo }>
                    Vagas, bolsas, mentorias e eventos para impulsionar sua carreira nas exatas.
                </p>
            </div>

            <div className={ styles.filtros }>
                {CATEGORIAS.map((categoria) => (
                    <ChipClicavel
                        key={ categoria }
                        texto={ categoria }
                        cor="var(--primaria)"
                        selecionado={ filtro === categoria }
                        onClick={() => setFiltro(categoria)}
                    />
                ))}
            </div>

            {oportunidadesFiltradas.length === 0 ? (
                <div className={ styles.vazio }>
                    <TbBriefcase className={ styles.iconeVazio } />
                    <p>Nenhuma oportunidade por aqui ainda...</p>
                    <span>Tente outra categoria ou volte mais tarde.</span>
                </div>
            ) : (
                <div className={ styles.grid }>
                    {oportunidadesFiltradas.map((oportunidade) => (
                        <CardOportunidade key={ oportunidade.id } oportunidade={ oportunidade } />
                    ))}
                </div>
            )}
        </main>
    )
}