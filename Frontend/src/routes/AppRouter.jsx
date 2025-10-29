import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Equipos from '../pages/Equipos';
import Estadisticas from '../pages/Estadisticas';
import Jugadores from '../pages/Jugadores';
import Partidos from '../pages/Partidos';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/partidos" element={<Partidos />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;