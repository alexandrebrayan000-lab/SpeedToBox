from pydantic import BaseModel
from typing import List, Optional

class AlertaItem(BaseModel):
    id: str
    tipo: str
    prioridade: str
    titulo: str
    mensagem: str
    produto_id: Optional[str] = None
    lote_id: Optional[str] = None
    data_geracao: str

class DashboardMetricsResponse(BaseModel):
    total_produtos: int
    total_em_estoque: float
    total_estoque_baixo: int
    total_lotes_proximos_vencimento: int
    vendas_periodo_valor: float
    vendas_periodo_qtd: float
    ticket_medio: float
    alertas_ativos: List[AlertaItem]
