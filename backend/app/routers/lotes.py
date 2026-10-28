from fastapi import APIRouter, status
from typing import List, Optional
from app.schemas.lote import LoteCreate, LoteResponse
from app.services.lote_service import LoteService

router = APIRouter(prefix="/lotes", tags=["Lotes & Validades"])

@router.get("", response_model=List[LoteResponse], summary="Listar lotes com ordenação FIFO por validade")
def listar_lotes(produto_id: Optional[str] = None):
    if produto_id:
        return LoteService.listar_por_produto(produto_id)
    return LoteService.listar_todos()

@router.post("", response_model=LoteResponse, status_code=status.HTTP_201_CREATED, summary="Registrar novo lote")
def registrar_lote(dados: LoteCreate):
    return LoteService.criar(dados)
