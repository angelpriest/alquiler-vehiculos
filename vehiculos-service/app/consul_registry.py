import socket
import uuid
import consul
from app.config import settings


class ConsulRegistry:
    """Registra y desregistra el servicio en Consul.
    Equivalente conceptual a @EnableDiscoveryClient de Spring."""

    def __init__(self):
        self.client = consul.Consul(host=settings.consul_host, port=settings.consul_port)
        self.service_id = f"{settings.service_name}-{uuid.uuid4().hex[:8]}"

    def register(self):
        # Healthcheck: Consul llamará a /health cada 10 segundos
        check = consul.Check.http(
            url=f"http://{settings.service_host}:{settings.service_port}/health",
            interval="10s",
            timeout="3s",
            deregister="1m",  # se desregistra si está caído 1 minuto
        )
        self.client.agent.service.register(
            name=settings.service_name,
            service_id=self.service_id,
            address=settings.service_host,
            port=settings.service_port,
            check=check,
        )
        print(f"✓ Registrado en Consul como {self.service_id}")

    def deregister(self):
        try:
            self.client.agent.service.deregister(self.service_id)
            print(f"✓ Desregistrado de Consul: {self.service_id}")
        except Exception as e:
            print(f"⚠ Error al desregistrar: {e}")


registry = ConsulRegistry()