import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { LandingPage } from '../pages/LandingPage.tsx'
import { About } from '../pages/About.tsx'
import { Blog } from '../pages/Blog.tsx'

import { Login } from '../pages/Login.tsx'
import { Registro } from '../pages/Registro.tsx'

import { Principal } from '../components/layout/Principal.tsx'
import { Forum } from '../pages/Forum.tsx'
import { Chat } from '../pages/Chat.tsx'
import { Oportunidades } from '../pages/Oportunidades.tsx'
import { Salvos } from '../pages/Salvos.tsx'

import { Notificacoes } from '../pages/Notificacoes.tsx'

import { ConfigLayout } from '../components/layout/ConfigLayout.tsx'
import { ConfigAcessibilidade } from '../pages/ConfigAcessibilidade.tsx' 
import { ConfigConta } from '../pages/ConfigConta.tsx'
import { ConfigNotificacoes } from '../pages/ConfigNotificacoes.tsx'
import { ConfigPrivacidade } from '../pages/ConfigPrivacidade.tsx'
import { ConfigSobre } from '../pages/ConfigSobre.tsx'

import { PerfilLayout } from '../components/layout/PerfilLayout.tsx'
import { Profile } from '../pages/Profile.tsx'
import { Portfolio } from '../pages/Portfolio.tsx'
import { SobrePerfil } from '../pages/SobrePerfil.tsx'

import { RotaProtegida } from './RotaProtegida.tsx'


export function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <LandingPage/> } />
                <Route path='about' element={ <About/> }/>
                <Route path='blog' element={ <Blog/> }/>
                <Route path='login' element={ <Login/> }/>
                <Route path='register' element={ <Registro/> }/>
                <Route path='forum' element={ <RotaProtegida><Principal/></RotaProtegida> }>
                    <Route index element={ <RotaProtegida><Forum/></RotaProtegida> }/>
                    <Route path='chat' element={ <RotaProtegida><Chat/></RotaProtegida> }/>
                    <Route path='oportunidades' element={ <RotaProtegida><Oportunidades/></RotaProtegida> }/>
                    <Route path='salvos' element={ <RotaProtegida><Salvos/></RotaProtegida> }/>
                </Route>
                <Route path='/:username' element={ <RotaProtegida><PerfilLayout/></RotaProtegida> }>
                    <Route index element={ <RotaProtegida><Profile/></RotaProtegida> }/>
                    <Route path='portfolio' element={ <RotaProtegida><Portfolio/></RotaProtegida> }/>
                    <Route path='sobre' element={ <RotaProtegida><SobrePerfil/></RotaProtegida> }/>
                </Route>
                <Route path='notificacoes' element={ <RotaProtegida><Notificacoes/></RotaProtegida> }/>
                <Route path='configuracoes' element={ <RotaProtegida><ConfigLayout/></RotaProtegida> }>
                    <Route index element={ <Navigate to="acessibilidade" replace /> } />
                    <Route path='acessibilidade' element={ <RotaProtegida><ConfigAcessibilidade/></RotaProtegida> }/>
                    <Route path='conta' element={ <RotaProtegida><ConfigConta/></RotaProtegida> }/>
                    <Route path='notificacoes' element={ <RotaProtegida><ConfigNotificacoes/></RotaProtegida> }/>
                    <Route path='privacidade' element={ <RotaProtegida><ConfigPrivacidade/></RotaProtegida> }/>
                    <Route path='sobre-o-sistema' element={<RotaProtegida><ConfigSobre/></RotaProtegida>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}