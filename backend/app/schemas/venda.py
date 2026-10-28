from pydantic import BaseModel, Field
from typing import List, Literal, Optional

FormaPagamento = Literal["PIX", "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Boleto"]

class ItemVendaInput(BaseModel):
    produto_id: str = Field(..., description="ID do produto vendido")
    quantidade: float = Field(..., gt=0, description="Quantidade comprada")
    preco_unitario: float = Field(..., ge=0, description="Preço unitário aplicado")

class ItemVendaResponse(ItemVendaInput):
    subtotal: float

class VendaCreate(BaseModel):
    itens: List[ItemVendaInput] = Field(..., min_length=1, description="Lista de itens da transação")
    forma_pagamento: FormaPagamento = Field(..., description="Método de pagamento")

class VendaResponse(BaseModel):
    id: str
    codigo: str
    data_hora: str
    valor_total: float
    forma_pagamento: FormaPagamento
    status: str
    itens: List[ItemVendaResponse]

    class Config:
        from_attributes = True
