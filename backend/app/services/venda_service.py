import time
import random
from datetime import datetime
from typing import List, Tuple
from fastapi import HTTPException
from app.database import db
from app.schemas.venda import VendaCreate, ItemVendaResponse

class VendaService:
    @staticmethod
    def listar_todas() -> List[dict]:
        res = db.from_("vendas").select("*, itens_venda(*)").order("created_at", desc=True).execute()
        return res.data or []

    @staticmethod
    def registrar_venda(dados: VendaCreate) -> dict:
        # 1. RN-02: Validação prévia de estoque para TODOS os itens antes de qualquer baixa
        itens_processados = []
        produtos_atualizar = []

        for item in dados.itens:
            prod_res = db.from_("produtos").select("*").eq("id", item.produto_id).execute()
            if not prod_res.data:
                raise HTTPException(status_code=404, detail=f"Produto com ID '{item.produto_id}' não foi encontrado.")
            
            produto = prod_res.data[0]
            saldo_atual = float(produto["estoque"])

            if not produto.get("ativo", True):
                # RN-10: Produtos desativados não podem ser oferecidos em novas vendas
                raise HTTPException(status_code=400, detail=f"O produto '{produto['nome']}' está inativo para vendas.")

            if saldo_atual < item.quantidade:
                # RN-02: Bloqueia a venda se o saldo for insuficiente
                raise HTTPException(
                    status_code=400,
                    detail=f"Saldo insuficiente para '{produto['nome']}'. Disponível: {saldo_atual} {produto['unidade']}, solicitado: {item.quantidade}."
                )

            subtotal = round(item.quantidade * item.preco_unitario, 2)
            itens_processados.append({
                "produto_id": item.produto_id,
                "quantidade": item.quantidade,
                "preco_unitario": item.preco_unitario,
                "subtotal": subtotal,
                "nome_produto": produto["nome"],
                "unidade": produto["unidade"],
                "saldo_atual": saldo_atual,
                "estoque_minimo": float(produto["estoque_minimo"])
            })

            novo_saldo = max(0.0, saldo_atual - item.quantidade)
            novo_status = "esgotado" if novo_saldo <= 0 else "baixo" if novo_saldo <= float(produto["estoque_minimo"]) else "normal"
            produtos_atualizar.append((item.produto_id, novo_saldo, novo_status))

        # 2. RN-18: Cálculo do Total Consolidado
        valor_total = round(sum(i["subtotal"] for i in itens_processados), 2)
        venda_id = f"v_{int(time.time() * 1000)}"
        codigo_venda = f"VND-{random.randint(1000, 9999)}"
        agora_str = datetime.now().strftime("%Y-%m-%d %H:%M")

        # 3. RN-03: Baixa atômica e gravação conjunta
        # Insere a Venda
        db.from_("vendas").insert({
            "id": venda_id,
            "codigo": codigo_venda,
            "data_hora": agora_str,
            "valor_total": valor_total,
            "forma_pagamento": dados.forma_pagamento,
            "status": "concluida"
        }).execute()

        # Insere os Itens da Venda
        itens_payload = [
            {
                "venda_id": venda_id,
                "produto_id": i["produto_id"],
                "quantidade": i["quantidade"],
                "preco_unitario": i["preco_unitario"],
                "subtotal": i["subtotal"]
            }
            for i in itens_processados
        ]
        db.from_("itens_venda").insert(itens_payload).execute()

        # Atualiza o saldo dos produtos e gera movimentações de saída rastreáveis (RN-05 e RN-06)
        for prod_id, novo_saldo, novo_status in produtos_atualizar:
            db.from_("produtos").update({"estoque": novo_saldo, "status": novo_status}).eq("id", prod_id).execute()

        for item_info in itens_processados:
            db.from_("movimentacoes").insert({
                "id": f"mov_{int(time.time() * 1000)}_{random.randint(100, 999)}",
                "produto_id": item_info["produto_id"],
                "tipo": "saida",
                "quantidade": item_info["quantidade"],
                "motivo": f"Venda PDV {codigo_venda}",
                "usuario": "Operador do Sistema",
                "referencia": f"Cupom {codigo_venda}",
                "data_hora": agora_str
            }).execute()

        return {
            "id": venda_id,
            "codigo": codigo_venda,
            "data_hora": agora_str,
            "valor_total": valor_total,
            "forma_pagamento": dados.forma_pagamento,
            "status": "concluida",
            "itens": [
                {
                    "produto_id": i["produto_id"],
                    "quantidade": i["quantidade"],
                    "preco_unitario": i["preco_unitario"],
                    "subtotal": i["subtotal"]
                }
                for i in itens_processados
            ]
        }
