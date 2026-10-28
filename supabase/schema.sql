-- ==============================================================================
-- SpeedToBox — Esquema do Banco de Dados PostgreSQL / Supabase
-- Baseado nas especificações oficiais do Docs.md (Projeto Integrador II)
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA: ESTABELECIMENTOS
CREATE TABLE IF NOT EXISTS estabelecimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    gestores VARCHAR(255),
    janela_alerta_validade_dias INT DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA: USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id UUID REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA: PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
    id VARCHAR(64) PRIMARY KEY,
    estabelecimento_id UUID REFERENCES estabelecimentos(id) ON DELETE SET NULL,
    codigo VARCHAR(50) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    estoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    estoque_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,
    preco_custo DECIMAL(10,2) NOT NULL DEFAULT 0,
    preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidade VARCHAR(10) NOT NULL DEFAULT 'UN',
    status VARCHAR(20) NOT NULL DEFAULT 'normal', -- normal, baixo, esgotado
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA: LOTES
CREATE TABLE IF NOT EXISTS lotes (
    id VARCHAR(64) PRIMARY KEY,
    produto_id VARCHAR(64) REFERENCES produtos(id) ON DELETE CASCADE,
    codigo_lote VARCHAR(100) NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
    quantidade_inicial DECIMAL(10,2) NOT NULL DEFAULT 0,
    data_entrada DATE NOT NULL,
    data_validade DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'normal', -- normal, proximo_vencimento, vencido, esgotado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA: MOVIMENTAÇÕES DE ESTOQUE
CREATE TABLE IF NOT EXISTS movimentacoes (
    id VARCHAR(64) PRIMARY KEY,
    produto_id VARCHAR(64) REFERENCES produtos(id) ON DELETE RESTRICT,
    tipo VARCHAR(20) NOT NULL, -- entrada, saida, perda, avaria
    quantidade DECIMAL(10,2) NOT NULL,
    custo_unitario DECIMAL(10,2),
    motivo VARCHAR(255) NOT NULL,
    lote_id VARCHAR(64) REFERENCES lotes(id) ON DELETE SET NULL,
    usuario VARCHAR(255) NOT NULL,
    referencia VARCHAR(255),
    data_hora VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA: VENDAS
CREATE TABLE IF NOT EXISTS vendas (
    id VARCHAR(64) PRIMARY KEY,
    estabelecimento_id UUID REFERENCES estabelecimentos(id) ON DELETE SET NULL,
    codigo VARCHAR(50) NOT NULL,
    data_hora VARCHAR(50) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    forma_pagamento VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'concluida',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA: ITENS DA VENDA
CREATE TABLE IF NOT EXISTS itens_venda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venda_id VARCHAR(64) REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id VARCHAR(64) REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade DECIMAL(10,2) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- POLÍTICAS DE ACESSO (Row Level Security - RLS)
-- Permite leitura e escrita pelo cliente Next.js com anon key
-- ==============================================================================
ALTER TABLE estabelecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_venda ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Anon Acesso Total Estabelecimentos" ON estabelecimentos;
    CREATE POLICY "Public Anon Acesso Total Estabelecimentos" ON estabelecimentos FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Anon Acesso Total Usuarios" ON usuarios;
    CREATE POLICY "Public Anon Acesso Total Usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Anon Acesso Total Produtos" ON produtos;
    CREATE POLICY "Public Anon Acesso Total Produtos" ON produtos FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Anon Acesso Total Lotes" ON lotes;
    CREATE POLICY "Public Anon Acesso Total Lotes" ON lotes FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Anon Acesso Total Movimentacoes" ON movimentacoes;
    CREATE POLICY "Public Anon Acesso Total Movimentacoes" ON movimentacoes FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Anon Acesso Total Vendas" ON vendas;
    CREATE POLICY "Public Anon Acesso Total Vendas" ON vendas FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Anon Acesso Total ItensVenda" ON itens_venda;
    CREATE POLICY "Public Anon Acesso Total ItensVenda" ON itens_venda FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- SEED DE DADOS INICIAIS (Fidedigno ao Docs.md / Briefing SpeedToBox)
-- ==============================================================================

-- Inserir Estabelecimento Inicial
INSERT INTO estabelecimentos (id, nome, cnpj, email, cidade, uf, gestores, janela_alerta_validade_dias)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'SpeedToBox — Minimercado & Conveniência',
    '45.892.103/0001-92',
    'contato@speedtobox.com.br',
    'São Paulo',
    'SP',
    'Gestão Integrada',
    15
) ON CONFLICT (id) DO NOTHING;

-- Inserir Usuário Inicial
INSERT INTO usuarios (id, estabelecimento_id, nome, cargo, email)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Operador do Sistema',
    'Gestor de Estoque',
    'operador@speedtobox.com.br'
) ON CONFLICT (id) DO NOTHING;

-- Inserir Produtos
INSERT INTO produtos (id, estabelecimento_id, codigo, sku, nome, categoria, estoque, estoque_minimo, preco_custo, preco_venda, unidade, status, ativo)
VALUES
    ('p1', 'a0000000-0000-0000-0000-000000000001', '001', 'ALM-ARR-001', 'Arroz Nobre Tipo 1 5kg', 'Alimentos', 145, 30, 22.50, 32.90, 'UN', 'normal', TRUE),
    ('p2', 'a0000000-0000-0000-0000-000000000001', '002', 'ALM-FEJ-002', 'Feijão Carioca Especial 1kg', 'Alimentos', 18, 25, 6.20, 9.80, 'UN', 'baixo', TRUE),
    ('p3', 'a0000000-0000-0000-0000-000000000001', '003', 'ALM-OLE-003', 'Óleo de Soja Refinado 900ml', 'Alimentos', 64, 20, 5.10, 7.90, 'UN', 'normal', TRUE),
    ('p4', 'a0000000-0000-0000-0000-000000000001', '004', 'LMP-DET-004', 'Detergente Líquido Neutro 500ml', 'Limpeza', 12, 30, 1.80, 2.99, 'UN', 'baixo', TRUE),
    ('p5', 'a0000000-0000-0000-0000-000000000001', '005', 'HIG-SAB-005', 'Sabonete Antibacteriano 90g', 'Higiene', 180, 40, 2.10, 3.85, 'UN', 'normal', TRUE),
    ('p6', 'a0000000-0000-0000-0000-000000000001', '006', 'BEB-REF-006', 'Refrigerante Cola Pet 2L', 'Bebidas', 48, 15, 6.50, 9.99, 'UN', 'normal', TRUE),
    ('p7', 'a0000000-0000-0000-0000-000000000001', '007', 'ALM-CAF-007', 'Café Torrado e Moído 500g', 'Alimentos', 8, 20, 14.20, 21.50, 'UN', 'baixo', TRUE),
    ('p8', 'a0000000-0000-0000-0000-000000000001', '008', 'BEB-LEI-008', 'Leite Integral Longa Vida 1L', 'Bebidas', 110, 30, 4.10, 5.89, 'UN', 'normal', TRUE),
    ('p9', 'a0000000-0000-0000-0000-000000000001', '009', 'ALM-IOG-009', 'Iogurte Morango Garrafa 850g', 'Alimentos', 22, 15, 4.80, 7.50, 'UN', 'normal', TRUE),
    ('p10', 'a0000000-0000-0000-0000-000000000001', '010', 'PAD-PAO-010', 'Pão de Forma Tradicional 500g', 'Padaria', 35, 15, 5.50, 8.90, 'UN', 'normal', TRUE),
    ('p11', 'a0000000-0000-0000-0000-000000000001', '011', 'BEB-SUC-011', 'Suco de Laranja Integral 1L', 'Bebidas', 28, 10, 7.90, 12.90, 'UN', 'normal', TRUE),
    ('p12', 'a0000000-0000-0000-0000-000000000001', '012', 'LMP-DES-012', 'Desinfetante Lavanda 1L', 'Limpeza', 5, 20, 4.30, 6.99, 'UN', 'baixo', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Inserir Lotes
INSERT INTO lotes (id, produto_id, codigo_lote, quantidade, quantidade_inicial, data_entrada, data_validade, status)
VALUES
    ('l1', 'p8', 'LOT-2026-08', 35, 40, '2026-09-10', '2026-10-31', 'proximo_vencimento'),
    ('l2', 'p9', 'LOT-2026-09', 5, 20, '2026-08-25', '2026-10-20', 'vencido'),
    ('l3', 'p10', 'LOT-2026-10', 35, 50, '2026-10-02', '2026-11-15', 'normal'),
    ('l4', 'p11', 'LOT-2026-11', 28, 30, '2026-10-01', '2026-12-10', 'normal'),
    ('l5', 'p7', 'LOT-2026-07', 8, 25, '2026-08-15', '2026-11-05', 'proximo_vencimento'),
    ('l6', 'p1', 'LOT-2026-01', 145, 150, '2026-09-28', '2027-04-30', 'normal'),
    ('l7', 'p2', 'LOT-2026-02', 18, 50, '2026-09-20', '2027-02-15', 'normal'),
    ('l8', 'p4', 'LOT-2026-04', 12, 40, '2026-09-15', '2027-09-15', 'normal')
ON CONFLICT (id) DO NOTHING;

-- Inserir Movimentações
INSERT INTO movimentacoes (id, produto_id, tipo, quantidade, custo_unitario, motivo, lote_id, usuario, referencia, data_hora)
VALUES
    ('m1', 'p1', 'entrada', 50, 22.50, 'Compra de Reposição', 'l6', 'Operador do Sistema', 'NF-e 84920', '2026-10-15 14:32'),
    ('m2', 'p7', 'saida', 5, NULL, 'Venda Balcão', 'l5', 'Operador do Sistema', 'Venda #1092', '2026-10-15 11:15'),
    ('m3', 'p8', 'entrada', 40, 4.10, 'Compra de Reposição', 'l1', 'Operador do Sistema', 'NF-e 84890', '2026-10-14 16:47'),
    ('m4', 'p4', 'saida', 8, NULL, 'Venda Balcão', 'l8', 'Operador do Sistema', 'Venda #1085', '2026-10-14 10:20'),
    ('m5', 'p9', 'perda', 5, NULL, 'Vencimento no Estoque', 'l2', 'Operador do Sistema', 'Descarte Sanitário', '2026-10-13 17:05'),
    ('m6', 'p6', 'saida', 12, NULL, 'Venda Balcão', NULL, 'Operador do Sistema', 'Venda #1078', '2026-10-13 15:30'),
    ('m7', 'p3', 'avaria', 2, NULL, 'Embalagem Rompida no Transporte', NULL, 'Operador do Sistema', 'Laudo Avaria #02', '2026-10-12 14:10'),
    ('m8', 'p5', 'saida', 20, NULL, 'Venda Balcão', NULL, 'Operador do Sistema', 'Venda #1064', '2026-10-11 09:40')
ON CONFLICT (id) DO NOTHING;

-- Inserir Vendas
INSERT INTO vendas (id, estabelecimento_id, codigo, data_hora, valor_total, forma_pagamento, status)
VALUES
    ('v1', 'a0000000-0000-0000-0000-000000000001', 'VND-1092', '2026-10-15 11:15', 107.50, 'PIX', 'concluida'),
    ('v2', 'a0000000-0000-0000-0000-000000000001', 'VND-1085', '2026-10-14 10:20', 39.32, 'Cartão de Crédito', 'concluida'),
    ('v3', 'a0000000-0000-0000-0000-000000000001', 'VND-1078', '2026-10-13 15:30', 251.48, 'Cartão de Débito', 'concluida'),
    ('v4', 'a0000000-0000-0000-0000-000000000001', 'VND-1064', '2026-10-11 09:40', 165.35, 'PIX', 'concluida'),
    ('v5', 'a0000000-0000-0000-0000-000000000001', 'VND-1050', '2026-10-10 16:10', 329.00, 'Dinheiro', 'concluida')
ON CONFLICT (id) DO NOTHING;

-- Inserir Itens das Vendas
INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal)
VALUES
    ('v1', 'p7', 5, 21.50, 107.50),
    ('v2', 'p4', 8, 2.99, 23.92),
    ('v2', 'p5', 4, 3.85, 15.40),
    ('v3', 'p6', 12, 9.99, 119.88),
    ('v3', 'p1', 4, 32.90, 131.60),
    ('v4', 'p5', 20, 3.85, 77.00),
    ('v4', 'p8', 15, 5.89, 88.35),
    ('v5', 'p1', 10, 32.90, 329.00)
ON CONFLICT DO NOTHING;
