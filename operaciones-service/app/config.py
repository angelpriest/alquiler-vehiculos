from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    service_name: str = "operaciones-service"
    service_host: str = "operaciones-service"
    service_port: int = 8082

    database_url: str = "postgresql+psycopg://admin:admin123@postgres-operaciones:5432/operacionesdb"

    vehiculos_service_url: str = "http://vehiculos-service:8081"

    consul_host: str = "consul"
    consul_port: int = 8500

    class Config:
        env_file = ".env"


settings = Settings()