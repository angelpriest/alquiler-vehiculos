import { useState } from "react";
import { listarVehiculos, cambiarEstadoVehiculo, eliminarVehiculo } from "../api/client";
import useFetch from "../hooks/useFetch";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import "../styles/GestionVehiculos.css";

function GestionVehiculos() {
    const { datos: vehiculos, cargando, error, refrescar } = useFetch(
        () => listarVehiculos(),
        []
    );
    const [accionando, setAccionando] = useState(null);

    const cambiarEstado = async (id, nuevoEstado) => {
        setAccionando(id);
        try {
            await cambiarEstadoVehiculo(id, nuevoEstado);
            refrescar();
        } catch (err) {
            alert(`Error: ${err.response?.data?.detail || err.message}`);
        } finally {
            setAccionando(null);
        }
    };

    const eliminar = async (id, descripcion) => {
        if (!confirm(`¿Eliminar ${descripcion}? Esta accion no se puede deshacer.`)) return;
        setAccionando(id);
        try {
            await eliminarVehiculo(id);
            refrescar();
        } catch (err) {
            alert(`Error: ${err.response?.data?.detail || err.message}`);
        } finally {
            setAccionando(null);
        }
    };

    if (cargando) return <Loader mensaje="Cargando vehiculos..." />;
    if (error) return <ErrorMessage mensaje={error} />;
    if (!vehiculos || vehiculos.length === 0) {
        return <p className="sin-vehiculos">No hay vehiculos registrados.</p>;
    }

    return (
        <div className="gestion-vehiculos">
            <h2>Gestionar vehiculos ({vehiculos.length})</h2>

            <div className="tabla-wrapper">
                <table className="tabla-vehiculos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Marca / Modelo</th>
                            <th>matricula</th>
                            <th>Estado</th>
                            <th>Precio/dia</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculos.map((v) => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.marca} {v.modelo}</td>
                                <td className="matricula-cell">{v.matricula}</td>
                                <td>
                                    <span className={`mini-badge mini-${v.estado.toLowerCase().replace("_","-")}`}>
                                        {v.estado.replace("_", " ")}
                                    </span>
                                </td>
                                <td>${v.precio_por_dia}</td>
                                <td className="acciones">
                                    <select
                                        value={v.estado}
                                        onChange={(e) => cambiarEstado(v.id, e.target.value)}
                                        disabled={accionando === v.id}
                                    >
                                        <option value="DISPONIBLE">Disponible</option>
                                        <option value="NO_DISPONIBLE">No disponible</option>
                                        <option value="EN_MANTENIMIENTO">En mantenimiento</option>
                                    </select>
                                    <button
                                        className="btn-eliminar"
                                        onClick={() => eliminar(v.id, `${v.marca} ${v.modelo}`)}
                                        disabled={accionando === v.id}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestionVehiculos;