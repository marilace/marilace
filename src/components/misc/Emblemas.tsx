import styles from './Emblemas.module.css'
import { EMBLEMAS_DISPONIVEIS } from '../../types/Emblemas'

interface EmblemasProps {
    ids?: string[]
}

export function Emblemas({ ids }: EmblemasProps) {
    if (!ids || ids.length === 0) return null

    return (
        <span className={ styles.emblemas }>
            {EMBLEMAS_DISPONIVEIS
                .filter((emblema) => ids.includes(emblema.id))
                .map((emblema) => (
                    <span
                        key={emblema.id}
                        className={ styles.emblema }
                        style={{ color: emblema.cor }}
                        title={emblema.texto}
                    >
                        {emblema.letra}
                    </span>
                ))}
        </span>
    )
}