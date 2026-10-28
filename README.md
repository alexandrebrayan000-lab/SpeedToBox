# 📦 SpeedToBox — Sistema Integrado de Gestão de Estoque & PDV

> **Projeto Integrador II**  
> **Autores:** Mylenna Gonçalves De Paula & Brayan Alexandre Ivo Garrido  
> **Tecnologias:** Next.js 16 (App Router) • TypeScript • Tailwind CSS v4 • Supabase (PostgreSQL) • Lucide Icons

---

## 🌟 Visão Geral

O **SpeedToBox** é uma solução web corporativa desenvolvida para pequenos varejos, conveniências e minimercados. O sistema integra o controle físico minucioso de mercadorias (lotes com data de validade sob a regra **FIFO** e alertas de estoque mínimo) ao fluxo comercial de vendas (PDV com baixa atômica e cálculo de faturamento).

Além da interface de alta performance com estética moderna em *Dark Glassmorphism*, o sistema conta com um **Chatbot Assistente Inteligente** para consultas operacionais em linguagem natural e persistência em banco relacional **PostgreSQL** hospedado na nuvem via **Supabase**.

---

## 🏗️ Arquitetura do Sistema

```
[ Frontend: Next.js 16 + TypeScript + Tailwind v4 ]
        │
        ├── StoreContext (Gerenciador de Estado Global & Regras de Negócio)
        │       ├── RN-01/RN-03: Baixa atômica de estoque em vendas
        │       ├── RN-07: Alertas dinâmicos de estoque mínimo
        │       ├── RN-08/RN-09: Monitoramento de validade de lotes (FIFO)
        │       └── RF-17: Chatbot inteligente de apoio à decisão
        │
        ├── Supabase Service Layer (src/services/supabaseService.ts)
        │       └── Mapeamento e sincronização bidirecional
        │
        ▼
[ Banco de Dados: Supabase / PostgreSQL ]
        ├── estabelecimentos
        ├── usuarios
        ├── produtos (código, sku, estoque, precos, status)
        ├── lotes (código, validade, quantidade)
        ├── movimentacoes (entradas, saídas, perdas, avarias)
        └── vendas & itens_venda (transações comerciais registradas)
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js** (versão 18.18+ ou 20+)
- **NPM** ou gerenciador de pacotes equivalente

### 2. Instalação das Dependências
Clone o repositório e instale os pacotes:
```bash
git clone https://github.com/alexandrebrayan000-lab/SpeedToBox.git
cd SpeedToBox
npm install
```

### 3. Configuração do Banco de Dados (.env.local)
Crie um arquivo `.env.local` na raiz do projeto (ou copie o `.env.example`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://foxycskhmabpxcklwmtd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rfllyPwxYTxIo8fWTA40cw_J-rNMGrS
```

*(Caso utilize outro banco Supabase, execute o script `supabase/schema.sql` no SQL Editor do painel para criar todas as tabelas e dados de teste).*

### 4. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```
Abra o navegador em: [http://localhost:3000](http://localhost:3000)

### 5. Validação de Build de Produção
```bash
npm run build
```

---

## 🖥️ Módulos e Funcionalidades

| Rota | Descrição | Regras Atendidas |
|---|---|---|
| `/` | **Visão Geral (Dashboard):** KPIs em tempo real (total em estoque, faturamento, ticket médio, produtos a repor), gráfico temporal e atalhos rápidos. | RF-12, RF-14, RF-15 |
| `/produtos` | **Catálogo de Produtos:** Consulta por SKU/código/nome, filtros de status (normal, baixo, esgotado), cadastro e edição. | RF-01, RF-02, RF-10 |
| `/lotes` | **Lotes & Validades:** Controle preventivo contra perdas por vencimento, visualização de lotes vencidos e próximos de vencer com suporte à regra FIFO. | RF-03, RF-04, RF-11 |
| `/movimentacoes` | **Histórico de Movimentações:** Rastreabilidade de entradas (compras), saídas de balcão, perdas por validade e avarias com custo e referência. | RF-05, RF-06, RF-09 |
| `/vendas` | **Vendas & PDV:** Registro de vendas com seleção de múltiplos produtos, validação de saldo, cálculo automático e baixa atômica no estoque. | RF-07, RF-08, RN-02, RN-03 |
| `/relatorios` | **Relatórios & Exportações:** Extração de dados consolidados em formato CSV para conferência contábil e auditoria. | RF-13, RF-21 |
| `/alertas` | **Central de Alertas:** Notificações de prioridade alta e média para reposição urgente e retirada sanitária de lotes vencidos. | RF-10, RF-11 |
| `/configuracoes` | **Configurações:** Dados cadastrais do estabelecimento, parâmetros de dias para alerta e identificação da equipe responsável. | RF-20 |

---

## 🤖 Chatbot Assistente Integrado (SpeedToBox IA)
Acessível a qualquer momento pelo botão **"Assistente IA"** na barra lateral ou widget no canto inferior direito:
- Consulta saldo de produtos e itens abaixo do mínimo (`"quais produtos estão acabando?"`).
- Rastreia validades e orienta saídas FIFO (`"o que está perto de vencer?"`).
- Apresenta resumo de faturamento comercial e métricas de desempenho.
- Orienta o operador nos passos para lançamentos de entradas e saídas.

---

## 📂 Estrutura de Pastas

```
SpeedToBox/
├── public/                 # Ícones e assets estáticos
├── src/
│   ├── app/                # Rotas do Next.js (App Router)
│   │   ├── alertas/        # Página de Alertas
│   │   ├── configuracoes/  # Parâmetros e equipe
│   │   ├── lotes/          # Gestão de Lotes & Validades
│   │   ├── movimentacoes/  # Histórico de Movimentações
│   │   ├── produtos/       # Catálogo de Produtos
│   │   ├── relatorios/     # Relatórios e exportação CSV
│   │   ├── vendas/         # PDV e transações comerciais
│   │   ├── layout.tsx      # Layout raiz com tema escuro e fontes
│   │   └── page.tsx        # Dashboard principal
│   ├── components/
│   │   ├── dashboard/      # Gráficos e cards de métricas
│   │   ├── layout/         # Sidebar, TopBar, ChatbotWidget e Shell
│   │   └── modals/         # Modais de Nova Venda, Entrada e Produto
│   ├── context/
│   │   └── StoreContext.tsx# Gerenciador de estado e sincronização com banco
│   ├── lib/
│   │   └── supabase.ts     # Instância do cliente Supabase
│   ├── services/
│   │   └── supabaseService.ts # Camada de acesso a dados (CRUD)
│   └── types/
│       └── index.ts        # Interfaces e modelos de domínio TypeScript
├── supabase/
│   └── schema.sql          # Script DDL do PostgreSQL + Seed completo
├── Docs.md                 # Documento de visão e regras de negócio original
├── package.json
└── README.md
```

---

## 🎓 Apresentação do Projeto Integrador II

### Roteiro Sugerido para Apresentação:
1. **Contextualização do Problema:** Apresentar a dificuldade de pequenos mercados em controlar validades e perdas financeiras (conforme `Docs.md`).
2. **Dashboard de Entrada:** Demonstrar os cards de métricas em tempo real e o gráfico de faturamento.
3. **Simulação de Venda no PDV:**
   - Clicar em **"+ Nova Venda"**;
   - Adicionar itens ao carrinho;
   - Concluir a venda e mostrar a **baixa automática instantânea** no saldo do produto e a gravação em **Movimentações** e no **Supabase**.
4. **Alerta de Validade (FIFO):** Acessar a aba **Lotes & Validades** e mostrar os badges de lotes com vencimento próximo.
5. **Chatbot IA:** Abrir o assistente e perguntar *"O que está perto de vencer?"* e *"Quais produtos estão acabando?"*.
6. **Exportação de Relatório:** Ir na aba **Relatórios** e baixar o extrato em CSV.
7. **Banco de Dados:** Mostrar o painel do **Supabase** com as tabelas relacionais populadas em tempo real.
