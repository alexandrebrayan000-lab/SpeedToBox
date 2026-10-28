from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.config import get_settings
from app.routers import produtos, lotes, movimentacoes, vendas, dashboard

settings = get_settings()

app = FastAPI(
    title="SpeedToBox — API de Gestão de Estoque & PDV",
    description="""
## Sistema Integrado de Controle de Estoque, Lotes, Validades e Vendas
### Sistema de Gest�o Empresarial

Esta API provê os serviços de negócio, persistência relacional e transações para o SpeedToBox:
* **Produtos:** Gestão de catálogo, precificação e alertas de estoque mínimo.
* **Lotes & Validades:** Controle sanitário preventivo e ordenação FIFO.
* **Movimentações:** Rastreamento completo de entradas, perdas, avarias e baixas.
* **Vendas & PDV:** Baixa atômica de saldo e registro comercial financeiro.
* **Dashboard:** Consolidação de métricas em tempo real e indicadores operacionais.
    """,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração de CORS para permitir requisições do Frontend Next.js
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
    """Redireciona a raiz diretamente para a documentação interativa Swagger."""
    return RedirectResponse(url="/docs")

@app.get("/health", tags=["Status"])
def health_check():
    """Endpoint de checagem de saúde da API."""
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
