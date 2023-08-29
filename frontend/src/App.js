import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import Login from "./pages/Login";
import Buscar from "./pages/Buscar";
import Historico from "./pages/Historico";
import Artista from "./pages/Artista";
import Cancion from "./pages/Cancion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/inicio' element={<PaginaPrincipal />} />
        <Route path='/buscar' element={<Buscar />} />
        <Route path='/historico' element={<Historico />} />
        <Route path='/artista' element={<Artista />} />
        <Route path='/cancion' element={<Cancion />} />
      </Routes>
    </Router>
  );
}

export default App;