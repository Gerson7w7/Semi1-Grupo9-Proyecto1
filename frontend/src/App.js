import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/inicio' element={<PaginaPrincipal />} />
      </Routes>
    </Router>
  );
}

export default App;