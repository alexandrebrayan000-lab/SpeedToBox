from pydantic import BaseModel, Field
from typing import Optional, Literal

StatusLote = Literal["normal", "proximo_vencimento", "vencido", "esgotado"]

class LoteBase(BaseModel):
    produto_id: str = Field(..., description="ID do produto associado")
    codigo_lote: str = Field(..., description="Código identificador do lote/partida")
    quantidade: float = Field(..., ge=0, description="Saldo disponível no lote")
    quantidade_inicial: float = Field(..., ge=0, description="Quantidade original de entrada")
    data_entrada: str = Field(..., description="Data de recebimento (YYYY-MM-DD)")
    data_validade: str = Field(..., description="Data de expiração sanitária (YYYY-MM-DD)")
    status: StatusLote = Field("normal", description="Classificação de vencimento")

class LoteCreate(LoteBase):
    id: Optional[str] = None

class LoteResponse(LoteBase):
    id: str

    class Config:
        from_attributes = True
