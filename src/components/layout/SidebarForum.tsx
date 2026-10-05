import styles from './SidebarForum.module.css'
import { CardSugestoes } from '../misc/CardSugestoes'
import { CardOportunidadesMini } from '../misc/CardOportunidadesMini'

export function SidebarForum(){
    return (
        <aside className={ styles.sidebar } aria-label="Sugestões e oportunidades">
            <CardSugestoes />
            <CardOportunidadesMini />
        </aside>
    )
}