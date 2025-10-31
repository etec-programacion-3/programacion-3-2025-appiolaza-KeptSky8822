import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Equipos from './pages/Equipos';
import Jugadores from './pages/Jugadores';
import Partidos from './pages/Partidos';
import Estadisticas from './pages/Estadisticas';
import Champions from './pages/Champions';
import PremierLeague from './pages/PremierLeague';
import LaLiga from './pages/LaLiga';
import SerieA from './pages/SerieA';
import Bundesliga from './pages/Bundesliga';
import Ligue1 from './pages/Ligue1';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/jugadores" element={<Jugadores />} />
            <Route path="/partidos" element={<Partidos />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="/premier-league" element={<PremierLeague />} />
            <Route path="/laliga" element={<LaLiga />} />
            <Route path="/serie-a" element={<SerieA />} />
            <Route path="/bundesliga" element={<Bundesliga />} />
            <Route path="/ligue-1" element={<Ligue1 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
