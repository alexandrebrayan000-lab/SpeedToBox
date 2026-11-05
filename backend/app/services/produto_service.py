import time
from typing import List, Optional
from app.database import db
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse

class ProdutoService:
    @staticmethod
    def listar_todos() -> List[dict]:
        res = db.from_("produtos").select("*").order("nome").execute()
        return res.data or []

    @staticmethod
    def buscar_por_id(produto_id: str) -> Optional[dict]:
        res = db.from_("produtos").select("*").eq("id", produto_id).execute()
        return res.data[0] if res.data else None

    @staticmethod
    def criar(dados: ProdutoCreate) -> dict:
        prod_id = dados.id or f"p_{int(time.time() * 1000)}"
        
        # RN-07: Cálculo automático de status
        status = "normal"
        if dados.estoque <= 0:
            status = "esgotado"
        elif dados.estoque <= dados.estoque_minimo:
            status = "baixo"

        payload = {
            "id": prod_id,
            "codigo": dados.codigo,
            "sku": dados.sku,
            "nome": dados.nome,
            "categoria": dados.categoria,
            "estoque": dados.estoque,
            "estoque_minimo": dados.estoque_minimo,
            "preco_custo": dados.preco_custo,
            "preco_venda": dados.preco_venda,
            "unidade": dados.unidade,
            "status": status,
            "ativo": dados.ativo
        }

        res = db.from_("produtos").insert(payload).execute()
        return res.data[0] if res.data else payload

    @staticmethod
    def atualizar(produto_id: str, dados: ProdutoUpdate) -> Optional[dict]:
        atual = ProdutoService.buscar_por_id(produto_id)
        if not atual:
            return None

        payload = {k: v for k, v in dados.model_dump(exclude_unset=True).items()}
        
        # Se alterou estoque ou estoque_minimo, recalcula status
        novo_estoque = payload.get("estoque", atual["estoque"])
        novo_minimo = payload.get("estoque_minimo", atual["estoque_minimo"])
        if novo_estoque <= 0:
            payload["status"] = "esgotado"
        elif novo_estoque <= novo_minimo:
            payload["status"] = "baixo"
        else:
            payload["status"] = "normal"

        res = db.from_("produtos").update(payload).eq("id", produto_id).execute()
        return res.data[0] if res.data else None

    @staticmethod
    def desativar(produto_id: str) -> bool:
        # RN-10 e RN-11: Não remove fisicamente, desativa para manter histórico
        res = db.from_("produtos").update({"ativo": False}).eq("id", produto_id).execute()
        return bool(res.data)
