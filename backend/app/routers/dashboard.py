from fastapi import APIRouter
from app.schemas.dashboard import DashboardMetricsResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Alertas"])

@router.get("/metrics", response_model=DashboardMetricsResponse, summary="Obter indicadores consolidados e alertas ativos")
def obter_metricas():
    return DashboardService.obter_metricas()

# Alias raiz para compatibilidade com clientes que chamam /dashboard sem sufixo
@router.get("", response_model=DashboardMetricsResponse, summary="Alias: obter indicadores consolidados")
def obter_metricas_alias():
    return DashboardService.obter_metricas()
