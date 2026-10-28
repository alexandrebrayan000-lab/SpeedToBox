from fastapi import APIRouter
from app.schemas.dashboard import DashboardMetricsResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Alertas"])

@router.get("/metrics", response_model=DashboardMetricsResponse, summary="Obter indicadores consolidados e alertas ativos")
def obter_metricas():
    return DashboardService.obter_metricas()
