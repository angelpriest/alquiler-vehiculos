import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Date, DateTime, Enum as SQLEnum
from app.database import Base


class EstadoOperacion(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    CONFIRMADA = "CONFIRMADA"
    CANCELADA = "CANCELADA"
    FINALIZADA = "FINALIZADA"


class Operacion(Base):
    __tablename__ = "operaciones"

    id = Column(Integer, primary_key=True, index=True)
    vehiculo_id = Column(Integer, nullable=False, index=True)
    cliente_nombre = Column(String(100), nullable=False)
    cliente_documento = Column(String(20), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    estado = Column(
        SQLEnum(EstadoOperacion),
        nullable=False,
        default=EstadoOperacion.PENDIENTE,
        index=True,
    )
    precio_total = Column(Numeric(10, 2), nullable=False)
    creado_en = Column(DateTime, default=datetime.utcnow)