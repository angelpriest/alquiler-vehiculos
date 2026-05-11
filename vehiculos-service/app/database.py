from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Engine = conexión a la BD
engine = create_engine(settings.database_url)

# SessionLocal = fábrica de sesiones (cada request abrirá una)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = clase padre de la que heredan las entidades
Base = declarative_base()


def get_db():
    """Inyección de dependencia: FastAPI llama a esto en cada endpoint
    que necesite la BD. Equivale al @Autowired de Spring."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()