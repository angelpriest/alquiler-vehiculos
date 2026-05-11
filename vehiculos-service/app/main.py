from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import engine, get_db, Base
from app import models, schemas
from app.config import settings

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
    "/api/vehiculos",
    response_model=schemas.VehiculoResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Vehículos"],
)
def crear_vehiculo(payload: schemas.VehiculoCreate, db: Session = Depends(get_db)):
    vehiculo = models.Vehiculo(**payload.model_dump())
    db.add(vehiculo)
    try:
        db.commit()
        db.refresh(vehiculo)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un vehículo con esa matrícula",
        )
    return vehiculo


@app.get("/api/vehiculos", response_model=list[schemas.VehiculoResponse], tags=["Vehículos"])
def listar_vehiculos(db: Session = Depends(get_db)):
    return db.query(models.Vehiculo).all()


@app.get("/api/vehiculos/{id}", response_model=schemas.VehiculoResponse, tags=["Vehículos"])
def obtener_vehiculo(id: int, db: Session = Depends(get_db)):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return vehiculo


@app.put("/api/vehiculos/{id}", response_model=schemas.VehiculoResponse, tags=["Vehículos"])
def actualizar_vehiculo(
    id: int, payload: schemas.VehiculoUpdate, db: Session = Depends(get_db)
):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")

    # Solo actualiza los campos que vinieron en el body
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(vehiculo, campo, valor)

    db.commit()
    db.refresh(vehiculo)
    return vehiculo


@app.delete("/api/vehiculos/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Vehículos"])
def eliminar_vehiculo(id: int, db: Session = Depends(get_db)):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    db.delete(vehiculo)
    db.commit()


@app.get(
    "/api/vehiculos/buscar/filtro",
    response_model=list[schemas.VehiculoResponse],
    tags=["Búsqueda"],
)
def buscar_vehiculos(
    marca: Optional[str] = Query(None, description="Filtrar por marca"),
    modelo: Optional[str] = Query(None, description="Filtrar por modelo"),
    estado: Optional[models.EstadoVehiculo] = Query(None, description="Filtrar por estado"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Vehiculo)
    if marca:
        query = query.filter(models.Vehiculo.marca.ilike(f"%{marca}%"))
    if modelo:
        query = query.filter(models.Vehiculo.modelo.ilike(f"%{modelo}%"))
    if estado:
        query = query.filter(models.Vehiculo.estado == estado)
    return query.all()


@app.patch("/api/vehiculos/{id}/estado", response_model=schemas.VehiculoResponse, tags=["Vehículos"])
def cambiar_estado(
    id: int, payload: schemas.CambiarEstadoRequest, db: Session = Depends(get_db)
):
    vehiculo = db.query(models.Vehiculo).filter(models.Vehiculo.id == id).first()
    if not vehiculo:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    vehiculo.estado = payload.estado
    db.commit()
    db.refresh(vehiculo)
    return vehiculo