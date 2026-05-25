import { useParams, Link, useNavigate } from "react-router-dom";
import { obtenerVehiculo } from "../api/client";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/DetalleVehiculo.css";

function DetalleVehiculo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { datos: vehiculo, cargando, error } = useFetch(
        () => obtenerVehiculo(id),
        [id]
    );

    if (cargando) {
        return (
            <div className="container">
                <Loader mensaje="Cargando vehiculo..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <ErrorMessage mensaje={error} />
                <button onClick={() => navigate("/vehiculos")} className="btn-volver">
                    ← Volver al catalogo
                </button>
            </div>
        );
    }

    if (!vehiculo) return null;

    const estadoClase = {
        DISPONIBLE: "estado-disponible",
        NO_DISPONIBLE: "estado-no-disponible",
        EN_MANTENIMIENTO: "estado-mantenimiento",
    }[vehiculo.estado] || "estado-disponible";

    return (
        <div className="container">
            <button onClick={() => navigate("/vehiculos")} className="btn-volver">
                ← Volver al catalogo
            </button>

            <div className="detalle-vehiculo">
                <div className="detalle-header">
                    <div>
                        <h1>{vehiculo.marca} {vehiculo.modelo}</h1>
                        <p className="matricula-grande">{vehiculo.matricula}</p>
                    </div>
                    <span className={`estado-badge-grande ${estadoClase}`}>
                        {vehiculo.estado.replace("_", " ")}
                    </span>
                </div>

                <div className="detalle-grid">
                    <div className="detalle-item">
                        <span className="detalle-label">Año</span>
                        <span className="detalle-valor">{vehiculo.anio}</span>
                    </div>
                    <div className="detalle-item">
                        <span className="detalle-label">Color</span>
                        <span className="detalle-valor">{vehiculo.color || "—"}</span>
                    </div>
                    <div className="detalle-item">
                        <span className="detalle-label">Kilometraje</span>
                        <span className="detalle-valor">
                            {vehiculo.kilometraje?.toLocaleString() || 0} km
                        </span>
                    </div>
                    <div className="detalle-item destacado">
                        <span className="detalle-label">Precio por dia</span>
                        <span className="detalle-valor precio-grande">
                            ${vehiculo.precio_por_dia}
                        </span>
                    </div>
                </div>

                {vehiculo.estado === "DISPONIBLE" && (
                    <div className="cta-alquilar">
                        <Link to={`/admin?alquilar=${vehiculo.id}`} className="btn-alquilar">
                            Solicitar alquiler
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetalleVehiculo;