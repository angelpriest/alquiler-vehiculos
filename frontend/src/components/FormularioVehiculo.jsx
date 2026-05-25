import { useState } from "react";
import { crearVehiculo } from "../api/client";
import "../styles/Formulario.css";

function FormularioVehiculo({ onCreado }) {
    const estadoInicial = {
        marca: "",
        modelo: "",
        matricula: "",
        anio: new Date().getFullYear(),
        color: "",
        precio_por_dia: "",
        kilometraje: 0,
    };

    const [datos, setDatos] = useState(estadoInicial);
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatos({ ...datos, [name]: value });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setMensaje(null);
        try {
            const payload = {
                ...datos,
                anio: parseInt(datos.anio),
                kilometraje: parseInt(datos.kilometraje) || 0,
                precio_por_dia: parseFloat(datos.precio_por_dia),
            };
            const creado = await crearVehiculo(payload);
            setMensaje({ tipo: "exito", texto: `Vehiculo ${creado.marca} ${creado.modelo} creado con ID${creado.id}` });
            setDatos(estadoInicial);
            if (onCreado) onCreado();
        } catch (err) {
            const detalle = err.reponse?.data?.detail || err.message;
            setMensaje({ tipo: "error", texto: detalle });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form className="formulario" onSubmit={manejarSubmit}>
            <h2>Registrar nuevo vehiculo</h2>

            <div className="form-grid">
                <div className="form-campo">
                    <label>Marca *</label>
                    <input
                        type="text"
                        name="marca"
                        value={datos.marca}
                        onChange={manejarCambio}
                        required
                        placeholder="Toyota"
                    />
                </div>

                <div className="form-campo">
                    <label>Modelo *</label>
                    <input
                        type="text"
                        name="modelo"
                        value={datos.modelo}
                        onChange={manejarCambio}
                        required
                        placeholder="Corolla"
                    />
                </div>

                <div className="form-campo">
                    <label>Matricula *</label>
                    <input
                        type="text"
                        name="matricula"
                        value={datos.matricula}
                        onChange={manejarCambio}
                        required
                        placeholder="ABC-123"
                    />
                </div>

                <div className="form-campo">
                    <label>Año *</label>
                    <input
                        type="number"
                        name="anio"
                        value={datos.anio}
                        onChange={manejarCambio}
                        min="1900"
                        max="2030"
                        required
                    />
                </div>

                <div className="form-campo">
                    <label>Color</label>
                    <input
                        type="text"
                        name="color"
                        value={datos.color}
                        onChange={manejarCambio}
                        placeholder="Blanco"
                    />
                </div>

                <div className="form-campo">
                    <label>Precio por dia *</label>
                    <input
                        type="number"
                        step="0.01"
                        name="precio_por_dia"
                        value={datos.precio_por_dia}
                        onChange={manejarCambio}
                        min="0"
                        required
                        placeholder="120.50"
                    />
                </div>

                <div className="form-campo">
                    <label>Kilometraje</label>
                    <input
                        type="number"
                        name="kilometraje"
                        value={datos.kilometraje}
                        onChange={manejarCambio}
                        min="0"
                    />
                </div>
            </div>

            {mensaje && (
                <div className={`mensaje mensaje-${mensaje.tipo}`}>
                    {mensaje.texto}
                </div>
            )}

            <button type="submit" className="btn-submit" disabled={enviando}>
                {enviando ? "Creando..." : "Crear vehiculo"}
            </button>
        </form>
    );
}

export default FormularioVehiculo;