import httpx
import consul
from fastapi import HTTPException
from app.config import settings
from app.schemas import VehiculoInfo


class VehiculosClient:
    """Cliente para hablar con el microservicio de vehículos.
    Resuelve la dirección consultando a Consul en cada llamada."""

    def __init__(self):
        self.consul_client = consul.Consul(
            host=settings.consul_host, port=settings.consul_port
        )

    def _resolver_url(self) -> str:
        """Pregunta a Consul dónde está vehiculos-service y devuelve su URL."""
        _, services = self.consul_client.health.service("vehiculos-service", passing=True)
        if not services:
            raise HTTPException(
                status_code=503,
                detail="Servicio de vehículos no disponible en Consul",
            )
        # Tomamos la primera instancia sana (en producción haríamos load balancing)
        instancia = services[0]
        address = instancia["Service"]["Address"]
        port = instancia["Service"]["Port"]
        return f"http://{address}:{port}"

    def obtener_vehiculo(self, vehiculo_id: int) -> VehiculoInfo:
        base_url = self._resolver_url()
        try:
            r = httpx.get(f"{base_url}/api/vehiculos/{vehiculo_id}", timeout=5.0)
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Error de red: {e}")

        if r.status_code == 404:
            raise HTTPException(status_code=404, detail="Vehículo no encontrado")
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Error: {r.status_code}")
        return VehiculoInfo(**r.json())

    def cambiar_estado(self, vehiculo_id: int, nuevo_estado: str) -> None:
        base_url = self._resolver_url()
        try:
            r = httpx.patch(
                f"{base_url}/api/vehiculos/{vehiculo_id}/estado",
                json={"estado": nuevo_estado},
                timeout=5.0,
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Error de red: {e}")

        if r.status_code != 200:
            raise HTTPException(
                status_code=502, detail=f"No se pudo cambiar el estado: {r.status_code}"
            )


vehiculos_client = VehiculosClient()