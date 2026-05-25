import { useState } from "react";
import "../styles/BarraBusqueda.css";

function BarraBusqueda ({ onBuscar }) {
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [estado, setEstado] = useState("");

    const manejarBuscar = (e) => {
        e.preventDefault();
        onBuscar({ marca, modelo, estado });
    };

    const limpiar = () => {
        setMarca("");
        setModelo("");
        setEstado("");
        onBuscar({});
    };

    return (
        <form className="barra-busqueda" onSubmit={manejarBuscar}>
            <div className="campo">
                <label>Marca</label>
                <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Toyota, Honda..."
                />
            </div>

            <div className="campo">
                <label>Modelo</label>
                <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Corolla, Civic..."
                />
            </div>

            <div className="campo">
                <label>Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="NO_DISPONIBLE">No disponible</option>
                    <option value="EN_MANTENIMIENTO">En mantenimiento</option>
                </select>
            </div>

            <div className="campo-botones">
                <button type="submit" className="btn-buscar">Buscar</button>
                <button type="button" className="btn-limpiar" onClick={limpiar}>
                    Limpiar
                </button>
            </div>
        </form>
    );
}

export default BarraBusqueda;