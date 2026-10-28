from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse
from app.services.produto_service import ProdutoService

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("", response_model=List[ProdutoResponse], summary="Listar catálogo de produtos")
def listar_produtos():
    return ProdutoService.listar_todos()

@router.get("/{produto_id}", response_model=ProdutoResponse, summary="Obter detalhes de um produto")
def obter_produto(produto_id: str):
    prod = ProdutoService.buscar_por_id(produto_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return prod

@router.post("", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED, summary="Cadastrar novo produto")
def cadastrar_produto(dados: ProdutoCreate):
    return ProdutoService.criar(dados)

@router.put("/{produto_id}", response_model=ProdutoResponse, summary="Atualizar produto existente")
def atualizar_produto(produto_id: str, dados: ProdutoUpdate):
    prod = ProdutoService.atualizar(produto_id, dados)
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return prod

@router.delete("/{produto_id}", status_code=status.HTTP_200_OK, summary="Desativar produto (Soft Delete - RN-10)")
def desativar_produto(produto_id: str):
    sucesso = ProdutoService.desativar(produto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"mensagem": f"Produto '{produto_id}' desativado com sucesso. Histórico mantido para auditoria."}
