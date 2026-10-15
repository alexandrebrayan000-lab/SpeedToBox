# StockPro — Dashboard Cyberpunk Neon Animado

Sistema profissional e futurista de controle de estoque, gerenciamento de produtos, lotes (FIFO), movimentações operacionais, vendas analíticas, relatórios e alertas inteligentes.

---

## 🚀 Como Executar

1. **Via `start.bat`:**
   Dê dois cliques no arquivo `start.bat` na raiz do projeto. Ele iniciará o servidor local e abrirá automaticamente o navegador em `http://localhost:3000`.

2. **Via Servidor Node:**
   ```bash
   node server.js
   ```
   Acesse no navegador: `http://localhost:3000`

3. **Execução Direta:**
   Abra o arquivo `index.html` diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Brave).

---

## 🎨 Identidade Visual Cyberpunk Neon

- **Fundo Principal:** Preto azulado profundo `#050816` com Canvas 2D animado contínuo (circuitos digitais, nós luminosos, pulsos de luz e gradientes cósmicos orgânicos).
- **Fundo de Cartões & Superfícies:** `#0B1228` com glassmorphism, bordas sutis neon azul e reflexos dinâmicos.
- **Destaques & Ações:**
  - Azul Elétrico (`#168BFF`) e Ciano Luminoso (`#00D9FF`): Navegação, identificadores e métricas analíticas.
  - Roxo Neon (`#8B35FF`) e Rosa Neon (`#F32BFF`): Botões primários, seleções ativas e badges.
  - Verde Sucesso (`#00E6A0`), Amarelo Atenção (`#FFBF3F`) e Vermelho Perigo (`#FF3864`): Estados e indicadores contextuais com pulsos luminescentes.

---

## 🌟 Principais Recursos

- **Visão Geral Sem Banner:**
  - Remoção de qualquer hero section desnecessária, priorizando dados úteis no primeiro viewport.
  - 4 Indicadores principais com contadores animados (Total de Produtos, Em Estoque, Estoque Baixo, Vendas no Período).
  - Gráfico comparativo de Movimentações (Entradas vs Saídas) nos últimos 7 dias.
  - Gráfico de Rosca de Distribuição por Categorias.
  - Movimentações recentes e Alertas críticos de rápida ação.

- **Página de Vendas & Desempenho Analítico Completo:**
  - Faturamento total, unidades vendidas, total de pedidos, ticket médio e produto destaque.
  - **Gráfico 1 — Top Produtos Mais Vendidos:** Barras horizontais com quantidade, faturamento e % de participação.
  - **Gráfico 2 — Maiores Saídas do Estoque:** Diferenciação precisa entre Vendas, Perdas por vencimento e Avarias de transporte.
  - **Gráfico 3 — Faturamento ao Longo do Tempo:** Curva com área translúcida neon e pontos de dados iluminados.
  - **Gráfico 4 — Ranking de Faturamento por Produto:** Identificação rápida dos itens que mais geram receita líquida.
  - **Gráfico 5 — Rosca de Categorias:** Participação percentual de faturamento por departamento.
  - Tabela detalhada de transações comerciais.

- **Gestão de Produtos:**
  - Catálogo completo com SKU, categoria, saldo disponível, estoque mínimo, preço de custo/venda e status visual.
  - Modal de cadastro de novo produto com validação e inicialização de lote.
  - Ações rápidas de entrada (+) e saída (-) diretamente na linha da tabela.

- **Lotes e Validades (FIFO):**
  - Rastreabilidade de lotes com cálculo dinâmico de dias restantes.
  - Barras de proximidade coloridas (Normal > 60d, Atenção < 30d, Vencido).
  - Ações diretas para liquidação ou descarte de produtos vencidos.

- **Movimentações Operacionais:**
  - Extrato histórico completo com tipo (Entrada, Saída, Perda, Avaria), motivo, usuário responsável e nota fiscal de referência.
  - Modais dedicados com validação de saldo e integridade de estoque.

- **Central de Relatórios:**
  - Categorizados por Estoque, Vendas e Validade.
  - Modal de pré-visualização auditada com impressão e download direto em CSV.

- **Central de Alertas:**
  - Resumo de criticidade (Alta, Média, Baixa) com recomendações práticas para tomada de decisão.

- **Configurações & Acessibilidade:**
  - Ajuste de intensidade de efeitos do Canvas neon (Completo, Moderado ou Movimento Reduzido).
  - Preferências da empresa, perfil de operador e backup em JSON.

- **Atalhos Globais do Teclado:**
  - `Ctrl + N`: Nova Venda Rápida
  - `Ctrl + P`: Novo Produto
  - `Esc`: Fechar Janelas / Modais
