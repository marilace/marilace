import styles from './HeaderUser.module.css'
import logo from '../../assets/logo.svg'
import { TbSearch, TbUser, TbCaretDown } from "react-icons/tb";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { Dropdown } from '../modais/Dropdown';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import { usePesquisa } from '../../hooks/usePesquisa';

const ROTA_PESQUISA = '/forum/pesquisa'

export function HeaderUser(){

    const { usuario } = useAutenticacao()
    const navegacao = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()

    const [dropdownAberto, setDropdownAberto] = useState(false)

    // se já estamos na página de pesquisa, a barra fica preenchida com a pesquisa
    const [termo, setTermo] = useState(
        location.pathname === ROTA_PESQUISA ? params.get('q') ?? '' : ''
    )
    const [sugestoesAbertas, setSugestoesAbertas] = useState(false)

    const { usuarios, carregando, termoValido } = usePesquisa(sugestoesAbertas ? termo : '')

    const exibirDropdown = () => setDropdownAberto(true)
    const ocultarDropdown = () => setDropdownAberto(false)

    const pesquisa = (e: FormEvent) => {
        e.preventDefault()
        const termoLimpo = termo.trim()
        if (!termoLimpo) return

        setSugestoesAbertas(false)
        navegacao(`${ROTA_PESQUISA}?q=${encodeURIComponent(termoLimpo)}`)
    }

    const sugestoes = usuarios.slice(0, 4)

    return(
    <header className={ styles.container }>
        <Link to='/forum'>
            <img src={ logo } className={ styles.logo } />
        </Link>

        <div className={ styles.pesquisaContainer }>
            <form className={ styles.barraPesquisa } onSubmit={pesquisa} role="search">
                <input
                    type="search"
                    placeholder='Pesquisar...'
                    className={ styles.pesquisa }
                    value={termo}
                    onChange={(e) => {
                        setTermo(e.target.value)
                        setSugestoesAbertas(true)
                    }}
                    onFocus={() => setSugestoesAbertas(true)}
                    onKeyDown={(e) => e.key === 'Escape' && setSugestoesAbertas(false)}
                    onBlur={() => setSugestoesAbertas(false)}
                    aria-label="Pesquisar no MariLace"
                    autoComplete="off"
                />
                <button type="submit" className={ styles.btnPesquisa } aria-label="Pesquisar">
                    <TbSearch size={18} className={ styles.icon } />
                </button>
            </form>

            {sugestoesAbertas && termoValido && (
                // onMouseDown evita que o input perca o foco antes de clicar no link
                <div className={ styles.sugestoes } onMouseDown={(e) => e.preventDefault()}>
                    {carregando && <p className={ styles.sugestaoVazio }>Pesquisando...</p>}

                    {!carregando && sugestoes.length === 0 && (
                        <p className={ styles.sugestaoVazio }>Nenhuma pessoa encontrada.</p>
                    )}

                    {!carregando && sugestoes.map((sugestao) => (
                        <Link
                            key={sugestao.uid}
                            to={`/${sugestao.username}`}
                            className={ styles.sugestaoItem }
                            onClick={() => setSugestoesAbertas(false)}
                        >
                            {sugestao.photoURL ? (
                                <img src={sugestao.photoURL} className={ styles.sugestaoAvatar } alt="" />
                            ) : (
                                <span className={`${styles.sugestaoAvatar} ${styles.sugestaoAvatarPadrao}`}>
                                    <TbUser size={18} />
                                </span>
                            )}
                            <span className={ styles.sugestaoTexto }>
                                <span className={ styles.sugestaoNome }>{sugestao.nome}</span>
                                <span className={ styles.sugestaoUser }>@{sugestao.username}</span>
                            </span>
                        </Link>
                    ))}

                    {!carregando && (
                        <button
                            type="button"
                            className={ styles.sugestaoVerTodos }
                            onClick={pesquisa}
                        >
                            Ver todos os resultados para "{termo.trim()}"
                        </button>
                    )}
                </div>
            )}
        </div>

        <div className={ styles.dropdown }>
            <Link
            to={usuario ? `/${usuario.username}` : '/'}
            className={ styles.btnPerfil}
            >
                {usuario?.photoURL ? (
                    <img
                        src={usuario.photoURL}
                        className={ styles.avatarPerfil }
                        alt="Foto de perfil"
                    />
                ) : (
                    <TbUser size={18}/>
                )}
            </Link>
            <button
                className={styles.btnDropdown}
                onClick={exibirDropdown}
            >
                <TbCaretDown
                    size={18}
                    className={styles.icon}
                />
            </button>
            <Dropdown
                exibir={dropdownAberto}
                ocultar={ocultarDropdown}
            />
        </div>

    </header>
    )
}