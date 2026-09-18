import styles from "./ModalConfirmacao.module.css"
import { TbAlertTriangle } from "react-icons/tb"

type ModalConfirmacaoProps = {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    confirmando?: boolean;
    confirmar: () => void;
    cancelar: () => void;
};

export function ModalConfirmacao({
    aberto,
    titulo,
    mensagem,
    textoConfirmar = 'Excluir',
    textoCancelar = 'Cancelar',
    confirmando = false,
    confirmar,
    cancelar,
}: ModalConfirmacaoProps) {

    if (!aberto) return null

    return (
        <div className={styles.modalOverlay} onClick={cancelar}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.icone}>
                    <TbAlertTriangle size={48} />
                </div>

                <h2>{titulo}</h2>
                <p>{mensagem}</p>

                <div className={styles.acoes}>
                    <button
                        className={styles.btnCancelar}
                        onClick={cancelar}
                        disabled={confirmando}
                    >
                        {textoCancelar}
                    </button>
                    <button
                        className={styles.btnConfirmar}
                        onClick={confirmar}
                        disabled={confirmando}
                    >
                        {confirmando ? 'Excluindo...' : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    )
}