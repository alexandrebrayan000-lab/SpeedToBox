# 📦 SpeedToBox — Sistema Integrado de Gestão de Estoque & PDV

> **Solução Corporativa de Controle de Estoque, Lotes & Vendas**  
> **Arquitetura:** Monorepo desacoplado com Frontend (Next.js 16) + Backend (FastAPI) + Banco Relacional (Supabase PostgreSQL)

---

## 🌟 Visão Geral

O **SpeedToBox** é uma solução corporativa completa de controle de estoque, lotes com validade (regra **FIFO**), alertas operacionais e frente de caixa (**PDV**) com baixa atômica de saldo e rastreabilidade total de movimentações.

O sistema foi arquitetado no padrão **Monorepo Profissional**, separando de maneira estrita a interface web e a API de regras de negócio, ambas conectadas ao mesmo banco de dados **PostgreSQL** hospedado na nuvem via **Supabase**.

---

## 🏗️ Estrutura do Monorepo

```
SpeedToBox/
├── backend/                  # API REST em Python / FastAPI
│   ├── app/
│   │   ├── routers/          # Endpoints: /produtos, /lotes, /movimentacoes, /vendas, /dashboard
│   │   ├── schemas/          # Modelos de validação Pydantic v2
│   │   ├── services/         # Regras de negócio (baixa atômica, FIFO, alertas)
│   │   ├── config.py         # Configurações e CORS
│   │   ├── database.py       # Conexão singleton com Supabase
│   │   └── main.py           # Aplicação FastAPI e documentação Swagger
│   ├── tests/                # Suíte de testes automatizados com Pytest
│   ├── requirements.txt      # Dependências Python
│   ├── .env.example          # Exemplo de variáveis de ambiente
│   └── README.md             # Documentação técnica do backend
│
├── frontend/                 # Aplicação Web em Next.js 16 + TypeScript
│   ├── src/
│   │   ├── app/              # Rotas do App Router (Dashboard, Produtos, PDV, Lotes, etc.)
│   │   ├── components/       # Componentes visuais em Glassmorphism & Dark Mode
│   │   ├── context/          # StoreContext (gerenciamento de estado e fallback)
│   │   └── services/         # Consumo da camada de dados
│   ├── public/               # Assets estáticos e ícones
│   ├── package.json          # Dependências do Next.js e Tailwind CSS v4
│   └── .env.example          # Credenciais públicas do Supabase para o cliente
│
├── supabase/
│   └── schema.sql            # Script SQL com tabelas, RLS, relacionamentos e dados iniciais
└── package.json              # Scripts de orquestração do monorepo
```

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/alexandrebrayan000-lab/SpeedToBox.git
cd SpeedToBox
```

---

### 2. Frontend (Next.js 16)
No terminal:
```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências (caso não tenha instalado)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
Acesse no navegador: **[http://localhost:3000](http://localhost:3000)**

---

### 3. Backend (FastAPI em Python)
Abra outro terminal:
```bash
# Entrar na pasta do backend
cd backend

# Criar e ativar o ambiente virtual
python -m venv venv
.\venv\Scripts\Activate.ps1   # No Windows PowerShell
# source venv/bin/activate    # No Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Iniciar a API com reload automático
uvicorn app.main:app --reload --port 8000
```
- API ativa em: **[http://localhost:8000](http://localhost:8000)**
- **Documentação Swagger Interativa:** **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### 4. Executar os Testes Automatizados do Backend
```bash
cd backend
python -m pytest tests/ -v
```

---

## 🛡️ Regras de Negócio Implementadas

| ID | Regra | Onde está implementada |
|---|---|---|
| **RN-01 / RN-03** | Baixa atômica de estoque em vendas e registro de movimentação simultânea | `backend/app/services/venda_service.py` & `frontend/src/context/StoreContext.tsx` |
| **RN-02** | Bloqueio de vendas se o saldo em estoque for insuficiente ou produto inativo | `backend/app/services/venda_service.py` |
| **RN-07** | Alerta dinâmico de estoque mínimo (`normal`, `baixo`, `esgotado`) | `backend/app/services/produto_service.py` |
| **RN-08 / RN-09** | Controle de lotes preventivo (FIFO) com badges de alerta | `backend/app/services/lote_service.py` |
| **RN-10 / RN-11** | Soft Delete: Desativação sem exclusão física para auditoria | `backend/app/routers/produtos.py` |
| **RF-17 / RNF-12** | Chatbot Assistente com respostas reais de estoque e faturamento | `frontend/src/components/layout/ChatbotWidget.tsx` |
