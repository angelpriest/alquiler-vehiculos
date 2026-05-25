import { Link } from "react-router-dom";
import "../styles/VehiculoCard.css";

function VehiculoCard({ vehiculo }) {
    const estadoClase ={
        DISPONIBLE: "estado-disponible",
        NO_DISPONIBLE: "estado-no-disponible",
        EN_MANTENIMIENTO: "estado-mantenimiento",
    }[vehiculo.estado] || "estado-disponible";

    return (
        <div className="vehiculo-card">
            <div className="vehiculo-card-header">
                <h3>{vehiculo.marca} {vehiculo.modelo}</h3>
                <span className={`estado-badge ${estadoClase}`}>
                    {vehiculo.estado.replace("_", " ")}
                </span>
            </div>

            <div className="vehiculo-card-body">
                <p><strong>Matricula:</strong> {vehiculo.matricula}</p>
                <p><strong>Año:</strong> {vehiculo.anio}</p>
                {vehiculo.color && <p><strong>Color:</strong> {vehiculo.color}</p>}
                <p className="precio">${vehiculo.precio_por_dia} <span>/dia</span></p>
            </div>

            <div className="vehiculo-card-footer">
                <Link to={`/vehiculos/${vehiculo.id}`} className="btn-detalle">
                    Ver detalle
                </Link>
            </div>
        </div>
    );
}

export default VehiculoCard;