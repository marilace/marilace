import styles from './ModalAcoesPostagem.module.css'
import { TbPencil, TbAlertCircle, TbArchive } from "react-icons/tb";

type ModalAcoesPostagemProps = {
    aberto: boolean
    fechar: () => void
}

export function ModalAcaoPostagem({ aberto, fechar }: ModalAcoesPostagemProps) {
    if (!aberto) return null;

    return (
        <>
            <div className={styles.overlay} onClick={fechar} />

            <div 
                className={styles.container}
                onClick={(e) => e.stopPropagation()}
            >
                <ul className={styles.lista}>
                    <li className={styles.item}>
                        <TbPencil size={18} className={styles.icon} />
                        Editar
                    </li>
                    <li className={styles.item}>
                        <TbArchive size={18} className={styles.icon} />
                        Arquivar
                    </li>
                    <li className={styles.item}>
                        <TbAlertCircle size={18} className={styles.icon} />
                        Denunciar
                    </li>
                </ul>
            </div>
        </>
    );
}