from pydantic import BaseModel, Field
from typing import Optional, Literal

TipoMovimentacao = Literal["entrada", "saida", "perda", "avaria"]

class MovimentacaoBase(BaseModel):
    produto_id: str = Field(..., description="ID do produto movimentado")
    tipo: TipoMovimentacao = Field(..., description="Tipo de movimentação")
    quantidade: float = Field(..., gt=0, description="Quantidade movimentada")
    custo_unitario: Optional[float] = Field(None, ge=0, description="Custo unitário se aplicável")
    motivo: str = Field(..., description="Justificativa ou classificação do evento")
    lote_id: Optional[str] = Field(None, description="Lote relacionado se houver")
    usuario: str = Field("Operador", description="Nome do operador que efetuou a ação")
    referencia: Optional[str] = Field(None, description="NF, Cupom ou Laudo de origem")
    data_hora: Optional[str] = None

class MovimentacaoCreate(MovimentacaoBase):
    id: Optional[str] = None

class MovimentacaoResponse(MovimentacaoBase):
    id: str

    class Config:
        from_attributes = True
