from fastapi import APIRouter, status
from typing import List
from app.schemas.venda import VendaCreate, VendaResponse
from app.services.venda_service import VendaService

router = APIRouter(prefix="/vendas", tags=["Vendas & PDV"])

@router.get("", response_model=List[VendaResponse], summary="Listar vendas realizadas")
def listar_vendas():
    return VendaService.listar_todas()

@router.post("", response_model=VendaResponse, status_code=status.HTTP_201_CREATED, summary="Registrar venda com baixa atômica (RN-02 e RN-03)")
def realizar_venda(dados: VendaCreate):
    return VendaService.registrar_venda(dados)
