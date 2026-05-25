import { useState, useEffect, useCallback } from "react";

function useFetch(functionFetch, dependencias = []) {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] =useState(true);
    const [error, setError] = useState(null);

    const ejecutar =useCallback(() => {
        setCargando(true);
        setError(null);
        functionFetch()
            .then((respuesta) => setDatos(respuesta))
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    setError("Recurso no encontrado");
                } else if (err.response && err.response.data && err.response.data.detail) {
                    setError(err.response.data.detail);
                } else {
                    setError(err.message || "Error desconocido");
                }
            })
            .finally(() => setCargando(false));
    }, dependencias);

    useEffect(() => {
        ejecutar();
    }, [ejecutar]);

    return { datos, cargando, error, refrescar: ejecutar };
}

export default useFetch;