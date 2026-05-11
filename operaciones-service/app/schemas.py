from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, model_validator
from app.models import EstadoOperacion


class OperacionCreate(BaseModel):
    vehiculo_id: int = Field(..., examples=[1])
    cliente_nombre: str = Field(..., min_length=1, max_length=100, examples=["Ana Pérez"])
    cliente_documento: str = Field(..., min_length=4, max_length=20, examples=["12345678A"])
    fecha_inicio: date = Field(..., examples=["2026-05-15"])
    fecha_fin: date = Field(..., examples=["2026-05-20"])

    @model_validator(mode="after")
    def validar_fechas(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValueError("fecha_fin debe ser posterior a fecha_inicio")
        return self


class OperacionResponse(BaseModel):
    id: int
    vehiculo_id: int
    cliente_nombre: str
    cliente_documento: str
    fecha_inicio: date
    fecha_fin: date
    estado: EstadoOperacion
    precio_total: Decimal
    creado_en: datetime

    model_config = ConfigDict(from_attributes=True)


class VehiculoInfo(BaseModel):
    """Lo que esperamos recibir cuando consultemos al servicio de vehículos.
    No necesitamos todos los campos, solo lo que vamos a usar."""
    id: int
    marca: str
    modelo: str
    matricula: str
    estado: str
    precio_por_dia: Decimal