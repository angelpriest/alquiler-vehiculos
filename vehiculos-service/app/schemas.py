from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models import EstadoVehiculo


class VehiculoBase(BaseModel):
    marca: str = Field(..., min_length=1, max_length=50, examples=["Toyota"])
    modelo: str = Field(..., min_length=1, max_length=50, examples=["Corolla"])
    matricula: str = Field(..., min_length=4, max_length=20, examples=["ABC-1234"])
    anio: int = Field(..., ge=1900, le=2030, examples=[2022])
    color: Optional[str] = Field(None, max_length=30, examples=["Blanco"])
    precio_por_dia: Decimal = Field(..., gt=0, examples=[120.50])
    kilometraje: int = Field(0, ge=0)


class VehiculoCreate(VehiculoBase):
    estado: EstadoVehiculo = EstadoVehiculo.DISPONIBLE


class VehiculoUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    matricula: Optional[str] = None
    anio: Optional[int] = None
    color: Optional[str] = None
    precio_por_dia: Optional[Decimal] = None
    estado: Optional[EstadoVehiculo] = None
    kilometraje: Optional[int] = None


class VehiculoResponse(VehiculoBase):
    id: int
    estado: EstadoVehiculo

    model_config = ConfigDict(from_attributes=True)


class CambiarEstadoRequest(BaseModel):
    estado: EstadoVehiculo