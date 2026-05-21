import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio";
import ListaVehiculos from "./pages/ListaVehiculos";
import DetalleVehiculo from "./pages/DetalleVehiculo";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/vehiculos" element={<ListaVehiculos />} />
        <Route path="/vehiculos/:id" element={<DetalleVehiculo />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;