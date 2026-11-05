# -*- coding: utf-8 -*-
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.config import get_settings
from app.routers import produtos, lotes, movimentacoes, vendas, dashboard

settings = get_settings()

app = FastAPI(
    title="SpeedToBox - API de Gestao de Estoque e PDV",
    description="""
## Sistema Integrado de Controle de Estoque, Lotes, Validades e Vendas

Esta API prove os servicos de negocio, persistencia relacional e transacoes para o SpeedToBox:
* **Produtos:** Gestao de catalogo, precificacao e alertas de estoque minimo.
* **Lotes & Validades:** Controle sanitario preventivo e ordenacao FIFO.
* **Movimentacoes:** Rastreamento completo de entradas, perdas, avarias e baixas.
* **Vendas & PDV:** Baixa atomica de saldo e registro comercial financeiro.
* **Dashboard:** Consolidacao de metricas em tempo real e indicadores operacionais.
    """,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuracao de CORS para permitir requisicoes do Frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de Rotas da API v1
app.include_router(produtos.router, prefix=settings.API_V1_STR)
app.include_router(lotes.router, prefix=settings.API_V1_STR)
app.include_router(movimentacoes.router, prefix=settings.API_V1_STR)
app.include_router(vendas.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
def root_redirect():
    """Redireciona para a documentacao interativa Swagger."""
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["Status"])
def health_check():
    """Endpoint de checagem de saude da API."""
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)