import enum
from sqlalchemy import Column, Integer, String, Numeric, Enum as SQLEnum
from app.database import Base


class EstadoVehiculo(str, enum.Enum):
    DISPONIBLE = "DISPONIBLE"
    NO_DISPONIBLE = "NO_DISPONIBLE"
    EN_MANTENIMIENTO = "EN_MANTENIMIENTO"


class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50), nullable=False, index=True)
    modelo = Column(String(50), nullable=False, index=True)
    matricula = Column(String(20), nullable=False, unique=True)
    anio = Column(Integer, nullable=False)
    color = Column(String(30))
    precio_por_dia = Column(Numeric(10, 2), nullable=False)
    estado = Column(
        SQLEnum(EstadoVehiculo),
        nullable=False,
        default=EstadoVehiculo.DISPONIBLE,
        index=True,
    )
    kilometraje = Column(Integer, default=0)