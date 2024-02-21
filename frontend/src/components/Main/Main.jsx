import {Routes, Route} from 'react-router-dom'

import IndexPage from '../../pages/IndexPage/IndexPage'
import ErrorPage from '../../pages/ErrorPage/ErrorPage'
import AuthPage from '../../pages/AuthPage/AuthPage'
import "./Main.css"
import CasesNewPage from '../../pages/CasesNewPage/CasesNewPage'
import CasesShowPage from '../../pages/CasesShowPage/CasesShowPage'
import UserShowPage from "../../pages/UserShowPage/UserShowPage"
import InstructionsPage from '../../pages/Instructions/InstructionsPage'

export default function Main({user, setUser}){


    return(
        <main className="main">
        {/* { user ? 
        <> */}
          <Routes>
            <Route path="/" element={<IndexPage user={user}/>} /> 
            <Route path="/instructions" element={<InstructionsPage />} /> 
            <Route path="/login" element={<AuthPage setUser={setUser}/>} /> 
            <Route path="/cases/new" element={<CasesNewPage user={user}/>} /> 
            <Route path="/cases/:caseId" element={<CasesShowPage user={user} setUser={setUser}/>} /> 
            <Route path="/user" element={<UserShowPage user={user} setUser={setUser}/>} /> 
            <Route path="/*" element={<ErrorPage />} />   
          </Routes>
        {/* </>
          :
          <AuthPage setUser={setUser} />
      } */}
        </main>
    )
}

