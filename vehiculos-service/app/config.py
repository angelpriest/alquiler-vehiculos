from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    service_name: str = "vehiculos-service"
    service_host: str = "vehiculos-service"  # nombre del contenedor en compose
    service_port: int = 8081

    database_url: str = "postgresql+psycopg://admin:admin123@postgres-vehiculos:5432/vehiculosdb"

    consul_host: str = "consul"
    consul_port: int = 8500

    class Config:
        env_file = ".env"


settings = Settings()