import { useState } from "react";
import Tabs from "../components/Tabs";
import FormularioVehiculo from "../components/FormularioVehiculo";
import GestionVehiculos from "../components/GestionVehiculos";
import FormularioAlquiler from "../components/FormularioAlquiler";
import GestionOperaciones from "../components/GestionOperaciones";

function Admin() {
  const [pestanaActiva, setPestanaActiva] = useState("crear");
  const [refrescarKey, setRefrescarKey] = useState(0);

  const pestanas = [
    { id: "crear", label: "Crear vehiculo" },
    { id: "gestionar", label: "Gestionar vehiculos" },
    { id: "alquilar", label: "Solicitar alquiler" },
    { id: "operaciones", label: "Gestionar alquileres" },
  ];

  const onVehiculoCreado = () => {
    setRefrescarKey((k) => k + 1);
  };

  return (
    <div className="container">
      <h1>Panel administrativo</h1>

      <Tabs pestanas={pestanas} activa={pestanaActiva} onCambiar={setPestanaActiva} />

      {pestanaActiva === "crear" && <FormularioVehiculo onCreado={onVehiculoCreado} />}
      {pestanaActiva === "gestionar" && <GestionVehiculos key={refrescarKey} />}
      {pestanaActiva === "alquilar" && <FormularioAlquiler />}
      {pestanaActiva === "operaciones" && <GestionOperaciones />}
    </div>
  );
}

export default Admin;