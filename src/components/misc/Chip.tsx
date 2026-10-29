import styles from './Chip.module.css'

interface ChipProps{
    texto: string;
    cor: string;
    className?: string;
}

export function Chip({ texto, cor, className }:ChipProps){
    return (
        <div 
        className={`${styles.chip} ${className ?? ''}`}
        style={{ backgroundColor: cor }}>
            <div className={ styles.estrela }/>
            <span
                className={ styles.texto }
            >
                {texto}
            </span>
            <div className={ styles.estrela }/>
        </div>
    );
}