import { useState } from "react";
import { listarVehiculos, buscarVehiculos } from "../api/client";
import useFetch from "../hooks/useFetch";
import VehiculoCard from "../components/VehiculoCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import BarraBusqueda from "../components/BarraBusqueda";
import "../styles/ListaVehiculos.css";

function ListaVehiculos() {
    const [filtros, setFiltros] = useState(null);

    const { datos: vehiculos, cargando, error } = useFetch(
        () => {
            const tieneAlgunFiltro =
                filtros && (filtros.marca || filtros.modelo || filtros.estado);
            return tieneAlgunFiltro ? buscarVehiculos(filtros) : listarVehiculos();
        },
        [filtros]
    );

    const manejarBusqueda = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    return (
        <div className="container">
            <h1>Catalogo de vehiculos</h1>
            <p className="subtitulo">
                Explora nuesta flota disponinle para alquilar
            </p>

            <BarraBusqueda onBuscar={manejarBusqueda} />

            {cargando && <Loader mensaje="Buscando vehiculos..." />}

            {error && <ErrorMessage mensaje={error} />}

            {!cargando && !error && vehiculos && vehiculos.length === 0 && (
                <div className="sin-resultados">
                    <p>No se encontraron vehiculos con esos criterios.</p>
                </div>
            )}

            {!cargando && !error && vehiculos && vehiculos.length > 0 && (
                <div className="grid-vehiculos">
                    {vehiculos.map((v) => (
                        <VehiculoCard key={v.id} vehiculo={v} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListaVehiculos;