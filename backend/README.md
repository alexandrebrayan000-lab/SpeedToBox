# 🚀 SpeedToBox — Backend API (FastAPI + Supabase)

> **API REST de Regras de Negócio, Transações e Persistência**  
> **Tecnologias:** Python 3.10+ • FastAPI • Pydantic v2 • Supabase (PostgreSQL) • Uvicorn

---

## 🌟 Visão Geral

O backend do **SpeedToBox** centraliza as regras de negócio críticas e a integridade de dados do sistema, atendendo diretamente aos requisitos do **Docs.md**:
- **RN-01 / RN-03:** Baixa atômica de saldo e registro síncrono de itens e movimentações de saída no PDV.
- **RN-02:** Bloqueio estrito de vendas sem saldo disponível ou com produtos inativos.
- **RN-07 / RN-08 / RN-09:** Regras automáticas de status de produto (baixo, esgotado) e lote (vencido, próximo do vencimento via FIFO).
- **RN-10 / RN-11:** Soft delete de produtos desativados para preservar histórico e auditoria.

---

## 🛠️ Como Executar Localmente

### 1. Criar e Ativar o Ambiente Virtual
No terminal, dentro da pasta `backend/`:

**Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar as Dependências
```bash
pip install -r requirements.txt
```

### 3. Configurar as Variáveis de Ambiente
Verifique se o arquivo `.env` possui as credenciais do Supabase:
```env
SUPABASE_URL=https://foxycskhmabpxcklwmtd.supabase.co
SUPABASE_KEY=sb_publishable_rfllyPwxYTxIo8fWTA40cw_J-rNMGrS
PORT=8000
HOST=0.0.0.0
```

### 4. Iniciar o Servidor FastAPI
```bash
uvicorn app.main:app --reload --port 8000
```

O servidor iniciará em: [http://localhost:8000](http://localhost:8000)

---

## 📖 Documentação Interativa (Swagger & ReDoc)

Com o servidor rodando, acesse:
- **Swagger UI (Interativo):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc (Documentação Técnica):** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 Principais Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Checagem de disponibilidade da API |
| `GET` | `/api/v1/produtos` | Lista catálogo de produtos cadastrados |
| `POST` | `/api/v1/produtos` | Cadastra novo produto com cálculo de status |
| `PUT` | `/api/v1/produtos/{id}` | Atualiza atributos de um produto |
| `DELETE` | `/api/v1/produtos/{id}` | Desativa produto mantendo histórico (RN-10) |
| `GET` | `/api/v1/lotes` | Lista lotes com ordenação por validade (FIFO) |
| `POST` | `/api/v1/lotes` | Registra novo lote com verificação de dias até vencimento |
| `GET` | `/api/v1/movimentacoes` | Extrato de compras, saídas, perdas e avarias |
| `POST` | `/api/v1/movimentacoes` | Registra movimentação avulsa e atualiza saldo |
| `GET` | `/api/v1/vendas` | Histórico analítico de vendas e itens |
| `POST` | `/api/v1/vendas` | Conclui venda com validação de saldo e baixa atômica |
| `GET` | `/api/v1/dashboard/metrics`| Métricas consolidadas (faturamento, estoque, alertas) |
