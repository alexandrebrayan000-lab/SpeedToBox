from datetime import datetime, date
from typing import List, Dict, Any
from app.database import db

class DashboardService:
    @staticmethod
    def obter_metricas() -> Dict[str, Any]:
        # Busca produtos
        prods_res = db.from_("produtos").select("*").execute()
        produtos = prods_res.data or []

        # Busca lotes
        lotes_res = db.from_("lotes").select("*").execute()
        lotes = lotes_res.data or []

        # Busca vendas
        vendas_res = db.from_("vendas").select("*, itens_venda(*)").execute()
        vendas = vendas_res.data or []

        total_produtos = len(produtos)
        total_em_estoque = sum(float(p["estoque"]) for p in produtos)
        total_estoque_baixo = sum(1 for p in produtos if float(p["estoque"]) <= float(p["estoque_minimo"]))

        hoje = date.today()
        alertas = []
        lotes_risco = 0

        # Alertas de Estoque
        for p in produtos:
            saldo = float(p["estoque"])
            minimo = float(p["estoque_minimo"])
            if saldo <= 0:
                alertas.append({
                    "id": f"alt-zero-{p['id']}",
                    "tipo": "estoque_zerado",
                    "prioridade": "alta",
                    "titulo": f"Estoque Esgotado: {p['nome']}",
                    "mensagem": f"O produto atingiu 0 {p['unidade']}. Vendas bloqueadas até reposição.",
                    "produto_id": p["id"],
                    "data_geracao": "Hoje"
                })
            elif saldo <= minimo:
                alertas.append({
                    "id": f"alt-baixo-{p['id']}",
                    "tipo": "estoque_baixo",
                    "prioridade": "media",
                    "titulo": f"Estoque Baixo: {p['nome']}",
                    "mensagem": f"Saldo atual de {saldo} {p['unidade']} está abaixo do mínimo configurado ({minimo} {p['unidade']}).",
                    "produto_id": p["id"],
                    "data_geracao": "Hoje"
                })

        # Alertas de Validade (RN-08 e RN-09)
        for l in lotes:
            try:
                val_date = datetime.strptime(l["data_validade"], "%Y-%m-%d").date()
                dias = (val_date - hoje).days
                prod = next((p for p in produtos if p["id"] == l["produto_id"]), None)
                nome_p = prod["nome"] if prod else l["codigo_lote"]

                if dias < 0 or l.get("status") == "vencido":
                    lotes_risco += 1
                    alertas.append({
                        "id": f"alt-venc-{l['id']}",
                        "tipo": "lote_vencido",
                        "prioridade": "alta",
                        "titulo": f"Lote Vencido: {l['codigo_lote']}",
                        "mensagem": f"{nome_p} venceu em {l['data_validade']}. Recolher imediatamente.",
                        "produto_id": l["produto_id"],
                        "lote_id": l["id"],
                        "data_geracao": "Recente"
                    })
                elif dias <= 15 or l.get("status") == "proximo_vencimento":
                    lotes_risco += 1
                    alertas.append({
                        "id": f"alt-prox-{l['id']}",
                        "tipo": "lote_proximo_vencimento",
                        "prioridade": "media",
                        "titulo": f"Vencimento Próximo: {l['codigo_lote']}",
                        "mensagem": f"{nome_p} vence em {l['data_validade']}. Priorizar saída (regra FIFO).",
                        "produto_id": l["produto_id"],
                        "lote_id": l["id"],
                        "data_geracao": "Hoje"
                    })
            except Exception:
                continue

        # Métricas de Vendas (RN-12)
        vendas_concluidas = [v for v in vendas if v.get("status") == "concluida"]
        vendas_periodo_valor = sum(float(v["valor_total"]) for v in vendas_concluidas)
        vendas_periodo_qtd = sum(
            sum(float(i["quantidade"]) for i in v.get("itens_venda", []))
            for v in vendas_concluidas
        )
        ticket_medio = round(vendas_periodo_valor / len(vendas_concluidas), 2) if vendas_concluidas else 0.0

        return {
            "total_produtos": total_produtos,
            "total_em_estoque": total_em_estoque,
            "total_estoque_baixo": total_estoque_baixo,
            "total_lotes_proximos_vencimento": lotes_risco,
            "vendas_periodo_valor": round(vendas_periodo_valor, 2),
            "vendas_periodo_qtd": vendas_periodo_qtd,
            "ticket_medio": ticket_medio,
            "alertas_ativos": alertas
        }
