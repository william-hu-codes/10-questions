// stylesheets
import './App.css';

// fonts
import "../fonts/quadraat.ttf"

import { useState } from 'react'

import { getUser } from '../utilities/users-service';
import Main from '../components/Main/Main';
import Footer from '../components/Footer/Footer';
import NavBar from "../components/NavBar/NavBar"
import Banner from '../components/Banner/Banner';


export default function App() {

const [user, setUser] = useState(getUser())

  return (
    <div className="App">
      <Banner />
      <NavBar user={user} setUser={setUser} />
      <Main user={user} setUser={setUser}/>
      <Footer />
    </div>
  );
}
