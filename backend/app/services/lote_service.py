import time
from datetime import datetime, date
from typing import List, Optional
from app.database import db
from app.schemas.lote import LoteCreate

class LoteService:
    @staticmethod
    def listar_todos() -> List[dict]:
        res = db.from_("lotes").select("*").order("data_validade").execute()
        return res.data or []

    @staticmethod
    def listar_por_produto(produto_id: str) -> List[dict]:
        res = db.from_("lotes").select("*").eq("produto_id", produto_id).order("data_validade").execute()
        return res.data or []

    @staticmethod
    def criar(dados: LoteCreate) -> dict:
        lote_id = dados.id or f"l_{int(time.time() * 1000)}"
        
        # RN-08 e RN-09: Verificação de validade
        hoje = date.today()
        val_date = datetime.strptime(dados.data_validade, "%Y-%m-%d").date()
        dias_ate_vencimento = (val_date - hoje).days

        status = "normal"
        if dias_ate_vencimento < 0:
            status = "vencido"
        elif dias_ate_vencimento <= 15:
            status = "proximo_vencimento"

        payload = {
            "id": lote_id,
            "produto_id": dados.produto_id,
            "codigo_lote": dados.codigo_lote,
            "quantidade": dados.quantidade,
            "quantidade_inicial": dados.quantidade_inicial,
            "data_entrada": dados.data_entrada,
            "data_validade": dados.data_validade,
            "status": status
        }

        res = db.from_("lotes").insert(payload).execute()
        return res.data[0] if res.data else payload
