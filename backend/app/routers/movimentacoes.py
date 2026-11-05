from fastapi import APIRouter, status
from typing import List
from app.database import db
from app.schemas.movimentacao import MovimentacaoCreate, MovimentacaoResponse
import time
from datetime import datetime

router = APIRouter(prefix="/movimentacoes", tags=["Movimentações de Estoque"])

@router.get("", response_model=List[MovimentacaoResponse], summary="Histórico rastreável de movimentações")
def listar_movimentacoes():
    res = db.from_("movimentacoes").select("*").order("created_at", desc=True).execute()
    return res.data or []

@router.post("", response_model=MovimentacaoResponse, status_code=status.HTTP_201_CREATED, summary="Registrar entrada, perda ou avaria")
def registrar_movimentacao(dados: MovimentacaoCreate):
    mov_id = dados.id or f"mov_{int(time.time() * 1000)}"
    data_hora = dados.data_hora or datetime.now().strftime("%Y-%m-%d %H:%M")

    payload = {
        "id": mov_id,
        "produto_id": dados.produto_id,
        "tipo": dados.tipo,
        "quantidade": dados.quantidade,
        "custo_unitario": dados.custo_unitario,
        "motivo": dados.motivo,
        "lote_id": dados.lote_id,
        "usuario": dados.usuario,
        "referencia": dados.referencia,
        "data_hora": data_hora
    }

    # Insere movimentação
    res = db.from_("movimentacoes").insert(payload).execute()

    # Atualiza saldo do produto (RN-01)
    prod_res = db.from_("produtos").select("estoque, estoque_minimo").eq("id", dados.produto_id).execute()
    if prod_res.data:
        saldo_atual = float(prod_res.data[0]["estoque"])
        minimo = float(prod_res.data[0]["estoque_minimo"])
        delta = dados.quantidade if dados.tipo == "entrada" else -dados.quantidade
        novo_saldo = max(0.0, saldo_atual + delta)
        novo_status = "esgotado" if novo_saldo <= 0 else "baixo" if novo_saldo <= minimo else "normal"
        db.from_("produtos").update({"estoque": novo_saldo, "status": novo_status}).eq("id", dados.produto_id).execute()

    return res.data[0] if res.data else payload
