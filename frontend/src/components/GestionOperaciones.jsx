import { useState} from "react";
import {
    listarOperaciones,
    confirmarOperacion,
    cancelarOperacion,
} from "../api/client";
import useFetch from "../hooks/useFetch";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import "../styles/GestionOperaciones.css";

function GestionOperaciones() {
    const { datos: operaciones, cargando, error, refrescar } = useFetch(
        () => listarOperaciones(),
        []
    );

    const [accionando, setAccionando] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    const confirmar = async (id) => {
        setAccionando(id);
        setMensaje(null);
        try {
            await confirmarOperacion(id);
            setMensaje({ tipo: "exito", texto: `Operacion ${id} confirmada. El vehiculo quedo NO_DISPONIBLE`});
            refrescar();
        } catch (err) {
            const detalle = err.response?.data?.detail || err.message;
            setMensaje({ tipo: "error", texto: detalle});
        } finally {
            setAccionando(null);
        }
    };

    const cancelar = async (id) => {
        if (!confirm(`¿Cancelar la operacion ${id}`)) return;
        setAccionando(id);
        setMensaje(null);
        try {
            await cancelarOperacion(id);
            setMensaje({ tipo: "exito", texto: `Operacion ${id} cancelada.`});
            refrescar();
        } catch (err) {
            const detalle = err.response?.data?.detail || err.message;
            setMensaje({ tipo: "error", texto: detalle });
        } finally {
            setAccionando(null);
        }
    };

    if (cargando) return <Loader mensaje="Cargando operaciones..." />;
    if (error) return <ErrorMessage mensaje={error} />;

    const ordenadas = operaciones
        ? [...operaciones].sort((a, b) => b.id - a.id)
        : [];

    return (
        <div className="gestion-operaciones">
            <h2>Gestionar alquileres ({ordenadas.length})</h2>

            {mensaje && (
                <div className={`mensaje mensaje-${mensaje.tipo}`}>{mensaje.texto}</div>
            )}

            {ordenadas.length === 0 ? (
                <p className="sin-operaciones">No hay solicitudes de alquiler registradas.</p>
            ) : (
                <div className="lista-operaciones">
                    {ordenadas.map((op) => (
                        <div key={op.id} className={`operacion-card op-${op.estado.toLowerCase()}`}>
                            <div className="op-header">
                                <div>
                                    <h3>Operacion #{op.id}</h3>
                                    <p className="op-cliente">
                                        {op.cliente_nombre} ({op.cliente_documento})
                                    </p>
                                </div>
                                <span className={`op-estado op-estado-${op.estado.toLowerCase()}`}>
                                    {op.estado}
                                </span>
                            </div>

                            <div className="op-detalles">
                                <div>
                                    <span className="op-label">Vehiculo ID:</span>
                                    <span>{op.vehiculo_id}</span>
                                </div>
                                <div>
                                    <span className="op-label">Inicio:</span>
                                    <span>{op.fecha_inicio}</span>
                                </div>
                                <div>
                                    <span className="op-label">Fin:</span>
                                    <span>{op.fecha_fin}</span>
                                </div>
                                <div>
                                    <span className="op-label">Total:</span>
                                    <span className="op-precio">${op.precio_total}</span>
                                </div>
                            </div>

                            <div className="op-acciones">
                                {op.estado === "PENDIENTE" && (
                                    <>
                                        <button
                                            className="btn-confirmar"
                                            onClick={() => confirmar(op.id)}
                                            disabled={accionando === op.id}
                                        >
                                            {accionando === op.id ? "Procesando..." : "Confirmar"}
                                        </button>
                                        <button
                                            className="btn-cancelar"
                                            onClick={() => cancelar(op.id)}
                                            disabled={accionando === op.id}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                )}
                                {op.estado === "CONFIRMADA" && (
                                    <button
                                        className="btn-cancelar"
                                        onClick={() => cancelar(op.id)}
                                        disabled={accionando === op.id}
                                    >
                                        {accionando === op.id ? "Procesando..." : "Cancelar alquiler"}
                                    </button>
                                )}
                                {(op.estado === "CANCELADA" || op.estado === "FINALIZADA") && (
                                    <span className="op-final">Sin acciones disponibles</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GestionOperaciones;
