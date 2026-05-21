import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000
});

export const listarVehiculos = async () => {
    const response = await apiClient.get("/api/vehiculos");
    return response.data;
};

export const obtenerVehiculo = async (id) => {
    const response = await apiClient.get(`/api/vehiculos/${id}`);
    return response.data;
};

export const crearVehiculo = async (vehiculo) => {
    const response = await apiClient.post("/api/vehiculos", vehiculo);
    return response.data;
};

export const actualizarVehiculo = async (id, datos) => {
    const response = await apiClient.put(`/api/vehiculos/${id}`, datos);
    return response.data;
};

export const eliminarVehiculo = async (id) => {
    await apiClient.delete(`/api/vehiculos/${id}`);
};

export const cambiarEstadoVehiculo = async (id, estado) => {
    const response = await apiClient.patch(`/api/vehiculos/${id}/estado`,{
        estado,
    });
    return response.data;
};

export const buscarVehiculos = async ({ marca, modelo, estado }) => {
    const params = {};
    if (marca) params.marca = marca;
    if (modelo) params.modelo = modelo;
    if (estado) params.estado = estado;
    const response = await apiClient.get("/api/vehiculos/buscar/filtro", {
        params,
    });
    return response.data;
};

export const listarOperaciones = async () => {
    const response = await apiClient.get("/api/operaciones");
    return response.data;
};

export const obtenerOperacion = async (id) => {
    const response = await apiClient.get(`/api/operaciones/${id}`);
    return response.data;
};

export const crearOperacion = async (operacion) => {
    const response = await apiClient.post("/api/operaciones", operacion);
    return response.data;
};

export const confirmarOperacion = async (id) => {
    const response = await apiClient.put(`/api/operaciones/${id}/confirmar`);
    return response.data;
};

export const cancelarOperacion = async (id) => {
    const response = await apiClient.put(`/api/operaciones/${id}/cancelar`);
    return response.data;
};

export default apiClient;