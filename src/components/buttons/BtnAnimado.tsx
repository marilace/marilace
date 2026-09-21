import styles from './BtnAnimado.module.css'
import { Link } from 'react-router-dom'

interface BtnAnimadoProps {
    route: string
    text: string
    className?: string
}

export function BtnAnimado({ route, text, className }: BtnAnimadoProps) {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            <Link to={route} className={styles.btnHero}>
                <span className={styles.estrelaBtn} aria-hidden="true" />
                <span>{text}</span>
                <span className={styles.estrelaBtn} aria-hidden="true" />
            </Link>
        </div>
    )
}