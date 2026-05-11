from decimal import Decimal
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app import models, schemas
from app.config import settings
from app.vehiculos_client import vehiculos_client

from contextlib import asynccontextmanager
from app.consul_registry import registry

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Al arrancar
    registry.register()
    yield
    # Al apagar
    registry.deregister()


app = FastAPI(
    title="Microservicio Vehículos",
    description="Gestión de vehículos para alquiler",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "UP", "service": settings.service_name}


@app.post(
    "/api/operaciones",
    response_model=schemas.OperacionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Operaciones"],
)
def crear_operacion(payload: schemas.OperacionCreate, db: Session = Depends(get_db)):
    """Registra una solicitud de alquiler.
    Consulta a vehículos para validar disponibilidad y calcular el precio."""

    # 1. Pedir info del vehículo al otro microservicio
    vehiculo = vehiculos_client.obtener_vehiculo(payload.vehiculo_id)

    # 2. Validar que esté disponible
    if vehiculo.estado != "DISPONIBLE":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El vehículo está en estado {vehiculo.estado}",
        )

    # 3. Calcular precio total
    dias = (payload.fecha_fin - payload.fecha_inicio).days
    precio_total = vehiculo.precio_por_dia * Decimal(dias)

    # 4. Crear la operación en estado PENDIENTE
    operacion = models.Operacion(
        vehiculo_id=payload.vehiculo_id,
        cliente_nombre=payload.cliente_nombre,
        cliente_documento=payload.cliente_documento,
        fecha_inicio=payload.fecha_inicio,
        fecha_fin=payload.fecha_fin,
        precio_total=precio_total,
        estado=models.EstadoOperacion.PENDIENTE,
    )
    db.add(operacion)
    db.commit()
    db.refresh(operacion)
    return operacion


@app.get(
    "/api/operaciones",
    response_model=list[schemas.OperacionResponse],
    tags=["Operaciones"],
)
def listar_operaciones(db: Session = Depends(get_db)):
    return db.query(models.Operacion).all()


@app.get(
    "/api/operaciones/{id}",
    response_model=schemas.OperacionResponse,
    tags=["Operaciones"],
)
def obtener_operacion(id: int, db: Session = Depends(get_db)):
    op = db.query(models.Operacion).filter(models.Operacion.id == id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Operación no encontrada")
    return op


@app.put(
    "/api/operaciones/{id}/confirmar",
    response_model=schemas.OperacionResponse,
    tags=["Operaciones"],
)
def confirmar_operacion(id: int, db: Session = Depends(get_db)):
    """Confirma el alquiler y marca el vehículo como NO_DISPONIBLE."""
    op = db.query(models.Operacion).filter(models.Operacion.id == id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Operación no encontrada")
    if op.estado != models.EstadoOperacion.PENDIENTE:
        raise HTTPException(
            status_code=409,
            detail=f"Solo se pueden confirmar operaciones PENDIENTES (actual: {op.estado})",
        )

    # Cambiar el estado del vehículo via HTTP al otro servicio
    vehiculos_client.cambiar_estado(op.vehiculo_id, "NO_DISPONIBLE")

    op.estado = models.EstadoOperacion.CONFIRMADA
    db.commit()
    db.refresh(op)
    return op


@app.put(
    "/api/operaciones/{id}/cancelar",
    response_model=schemas.OperacionResponse,
    tags=["Operaciones"],
)
def cancelar_operacion(id: int, db: Session = Depends(get_db)):
    """Cancela el alquiler. Si estaba confirmada, libera el vehículo."""
    op = db.query(models.Operacion).filter(models.Operacion.id == id).first()
    if not op:
        raise HTTPException(status_code=404, detail="Operación no encontrada")
    if op.estado in (models.EstadoOperacion.CANCELADA, models.EstadoOperacion.FINALIZADA):
        raise HTTPException(status_code=409, detail=f"Operación ya {op.estado}")

    # Si estaba confirmada, hay que liberar el vehículo
    if op.estado == models.EstadoOperacion.CONFIRMADA:
        vehiculos_client.cambiar_estado(op.vehiculo_id, "DISPONIBLE")

    op.estado = models.EstadoOperacion.CANCELADA
    db.commit()
    db.refresh(op)
    return op