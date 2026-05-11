import httpx
import consul
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import os

RUTAS = {
    "/api/vehiculos": "vehiculos-service",
    "/api/operaciones": "operaciones-service",
}

CONSUL_HOST = os.getenv("CONSUL_HOST", "consul")
CONSUL_PORT = int(os.getenv("CONSUL_PORT", "8500"))

app = FastAPI(title="API Gateway", description="Punto único de entrada", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

consul_client = consul.Consul(host=CONSUL_HOST, port=CONSUL_PORT)


def resolver_servicio(nombre: str) -> str:
    _, services = consul_client.health.service(nombre, passing=True)
    if not services:
        raise HTTPException(status_code=503, detail=f"Servicio {nombre} no disponible")
    instancia = services[0]
    address = instancia["Service"]["Address"]
    port = instancia["Service"]["Port"]
    return f"http://{address}:{port}"


@app.get("/health")
def health():
    return {"status": "UP", "service": "gateway"}


@app.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
)
async def proxy(path: str, request: Request):
    ruta_completa = f"/{path}"

    servicio = None
    for prefijo, nombre_servicio in RUTAS.items():
        if ruta_completa.startswith(prefijo):
            servicio = nombre_servicio
            break

    if not servicio:
        raise HTTPException(status_code=404, detail="Ruta no encontrada en el Gateway")

    base_url = resolver_servicio(servicio)
    url_destino = f"{base_url}{ruta_completa}"
    if request.url.query:
        url_destino = f"{url_destino}?{request.url.query}"

    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() != "host"}

    async with httpx.AsyncClient() as client:
        r = await client.request(
            method=request.method,
            url=url_destino,
            content=body,
            headers=headers,
            timeout=15.0,
        )

    return Response(
        content=r.content,
        status_code=r.status_code,
        headers={k: v for k, v in r.headers.items() if k.lower() not in ("content-encoding", "transfer-encoding", "content-length")},
        media_type=r.headers.get("content-type"),
    )