from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "SpeedToBox" in data["service"]

def test_swagger_redirect():
    response = client.get("/", follow_redirects=False)
    assert response.status_code in (307, 302)
    assert response.headers["location"] == "/docs"

def test_listar_produtos():
    response = client.get("/api/v1/produtos")
    assert response.status_code == 200
    produtos = response.json()
    assert isinstance(produtos, list)
    assert len(produtos) > 0
    # Valida estrutura do primeiro produto retornado do Supabase
    p = produtos[0]
    assert "id" in p
    assert "nome" in p
    assert "preco_venda" in p

def test_dashboard_metrics():
    response = client.get("/api/v1/dashboard/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_produtos" in data
    assert "total_em_estoque" in data
    assert "ticket_medio" in data
    assert "alertas_ativos" in data
