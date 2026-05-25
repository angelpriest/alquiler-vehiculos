import { useState } from "react";
import { listarVehiculos, crearOperacion } from "../api/client";
import useFetch from "../hooks/useFetch";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import "../styles/Formulario.css";

function FormularioAlquiler() {
  const { datos: vehiculos, cargando, error: errorCarga } = useFetch(
    () => listarVehiculos(),
    []
  );

  const estadoInicial = {
    vehiculo_id: "",
    cliente_nombre: "",
    cliente_documento: "",
    fecha_inicio: "",
    fecha_fin: "",
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
        vehiculo_id: parseInt(datos.vehiculo_id),
      };
      const creada = await crearOperacion(payload);
      setMensaje({
        tipo: "exito",
        texto: `Solicitud creada con ID ${creada.id}. Precio total: $${creada.precio_total}`,
      });
      setDatos(estadoInicial);
    } catch (err) {
      const detalle = err.response?.data?.detail || err.message;
      setMensaje({ tipo: "error", texto: detalle });
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <Loader mensaje="Cargando vehiculos..." />;
  if (errorCarga) return <ErrorMessage mensaje={errorCarga} />;

  const disponibles = vehiculos?.filter((v) => v.estado === "DISPONIBLE") || [];

  return (
    <form className="formulario" onSubmit={manejarSubmit}>
      <h2>Registrar solicitud de alquiler</h2>

      {disponibles.length === 0 && (
        <p className="aviso">No hay vehiculos disponibles para alquiler.</p>
      )}

      <div className="form-grid">
        <div className="form-campo form-campo-full">
          <label>Vehiculo *</label>
          <select
            name="vehiculo_id"
            value={datos.vehiculo_id}
            onChange={manejarCambio}
            required
            disabled={disponibles.length === 0}
          >
            <option value="">Selecciona un vehiculo</option>
            {disponibles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marca} {v.modelo} - {v.matricula} (${v.precio_por_dia}/dia)
              </option>
            ))}
          </select>
        </div>

        <div className="form-campo">
          <label>Nombre del cliente *</label>
          <input
            type="text"
            name="cliente_nombre"
            value={datos.cliente_nombre}
            onChange={manejarCambio}
            required
            placeholder="Ana Perez"
          />
        </div>

        <div className="form-campo">
          <label>Documento *</label>
          <input
            type="text"
            name="cliente_documento"
            value={datos.cliente_documento}
            onChange={manejarCambio}
            required
            placeholder="12345678A"
          />
        </div>

        <div className="form-campo">
          <label>Fecha de inicio *</label>
          <input
            type="date"
            name="fecha_inicio"
            value={datos.fecha_inicio}
            onChange={manejarCambio}
            required
          />
        </div>

        <div className="form-campo">
          <label>Fecha de fin *</label>
          <input
            type="date"
            name="fecha_fin"
            value={datos.fecha_fin}
            onChange={manejarCambio}
            required
          />
        </div>
      </div>

      {mensaje && (
        <div className={`mensaje mensaje-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <button
        type="submit"
        className="btn-submit"
        disabled={enviando || disponibles.length === 0}
      >
        {enviando ? "Enviando..." : "Solicitar alquiler"}
      </button>
    </form>
  );
}

export default FormularioAlquiler;