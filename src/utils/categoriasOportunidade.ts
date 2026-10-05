import { TbBriefcase, TbSchool, TbAward, TbUsers, TbCalendarEvent } from 'react-icons/tb'
import { type OportunidadeTipo } from '../types/Oportunidade'

export const ICONE_CATEGORIA: Record<OportunidadeTipo['categoria'], typeof TbBriefcase> = {
    'Vaga': TbBriefcase,
    'Estágio': TbSchool,
    'Bolsa': TbAward,
    'Mentoria': TbUsers,
    'Evento': TbCalendarEvent,
}

export const COR_CATEGORIA: Record<OportunidadeTipo['categoria'], string> = {
    'Vaga': 'var(--primaria)',
    'Estágio': 'var(--verde)',
    'Bolsa': 'var(--rosa)',
    'Mentoria': 'var(--primaria-escura)',
    'Evento': 'var(--cinza)',
}