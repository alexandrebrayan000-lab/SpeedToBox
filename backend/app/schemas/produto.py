from pydantic import BaseModel, Field
from typing import Optional, Literal

StatusProduto = Literal["normal", "baixo", "esgotado"]
UnidadeMedida = Literal["UN", "KG", "L", "CX", "PCT"]

class ProdutoBase(BaseModel):
    codigo: str = Field(..., description="Código interno do produto")
    sku: str = Field(..., description="Identificador único SKU")
    nome: str = Field(..., min_length=2, description="Nome comercial da mercadoria")
    categoria: str = Field(..., description="Categoria de estoque")
    estoque: float = Field(0.0, ge=0, description="Saldo físico atual em estoque")
    estoque_minimo: float = Field(0.0, ge=0, description="Limite mínimo para emissão de alertas")
    preco_custo: float = Field(0.0, ge=0, description="Custo unitário de aquisição")
    preco_venda: float = Field(0.0, ge=0, description="Preço de venda praticado")
    unidade: UnidadeMedida = Field("UN", description="Unidade de medida")
    status: StatusProduto = Field("normal", description="Status de abastecimento")
    ativo: bool = Field(True, description="Indicador se produto está ativo para vendas")

class ProdutoCreate(ProdutoBase):
    id: Optional[str] = None

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    categoria: Optional[str] = None
    estoque: Optional[float] = None
    estoque_minimo: Optional[float] = None
    preco_custo: Optional[float] = None
    preco_venda: Optional[float] = None
    unidade: Optional[UnidadeMedida] = None
    status: Optional[StatusProduto] = None
    ativo: Optional[bool] = None

class ProdutoResponse(ProdutoBase):
    id: str

    class Config:
        from_attributes = True
