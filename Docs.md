# SpeedToBox — Documentação do Projeto

**Sistema web integrado para controle de estoque, lotes, validades, vendas e fluxo financeiro de produtos.**

---

## Controle do Documento

| Campo | Descrição |
| :--- | :--- |
| **Projeto** | SpeedToBox |
| **Tipo** | Documentação inicial de visão, requisitos e regras de negócio |
| **Versão** | 1.0 |
| **Data** | 15 de outubro de 2026 |
| **Contexto** | Projeto Integrador II |
| **Status** | Documento-base para validação da equipe e do supervisor |
| **Integrantes / Responsáveis** | Mylenna Gonçalves De Paula e Brayan Alexandre Ivo Garrido |

---

### Propósito
Organizar o que o SpeedToBox deverá entregar, registrar as regras essenciais e orientar as próximas etapas de modelagem, desenvolvimento e testes.

### Como utilizar esta documentação
Este material consolida a proposta do projeto e traduz a ideia em funcionalidades verificáveis. Ele serve como referência para o briefing, o desenho do banco de dados, a construção das telas, a implementação da API e os testes.

As decisões marcadas como "a definir" precisam ser confirmadas pela equipe antes de fechar o DER e iniciar a implementação correspondente.

> **Decisão de escopo importante:**
> O SpeedToBox será mais do que um cadastro de produtos: a proposta integra o fluxo físico do estoque ao fluxo financeiro diretamente relacionado à compra e à venda de mercadorias. Isso não equivale, nesta versão, a um sistema contábil completo.

---

## Sumário
1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Problema, justificativa e objetivos](#2-problema-justificativa-e-objetivos)
3. [Público-alvo e perfis de acesso](#3-público-alvo-e-perfis-de-acesso)
4. [Escopo e entregas por versão](#4-escopo-e-entregas-por-versão)
5. [Requisitos funcionais](#5-requisitos-funcionais)
6. [Requisitos não funcionais](#6-requisitos-não-funcionais)
7. [Regras de negócio](#7-regras-de-negócio)
8. [Dados e modelo conceitual](#8-dados-e-modelo-conceitual)
9. [Arquitetura e tecnologias](#9-arquitetura-e-tecnologias)
10. [Experiência do usuário e chatbot](#10-experiência-do-usuário-e-chatbot)
11. [Segurança, privacidade e confiabilidade](#11-segurança-privacidade-e-confiabilidade)
12. [Estratégia de testes e critérios de aceite](#12-estratégia-de-testes-e-critérios-de-aceite)
13. [Plano de implementação](#13-plano-de-implementação)
14. [Riscos e decisões pendentes](#14-riscos-e-decisões-pendentes)
15. [Glossário](#15-glossário)

---

## 1. Visão Geral do Projeto

O **SpeedToBox** é uma aplicação web destinada a pequenos negócios e estabelecimentos comerciais que precisam acompanhar mercadorias, lotes, datas de validade e movimentações de estoque, ao mesmo tempo em que visualizam receitas e custos gerados pelas operações de compra e venda desses produtos.

A proposta é centralizar as informações em um único ambiente de uso simples, com painel de indicadores, alertas operacionais, relatórios e um chatbot de consulta. O sistema deverá ajudar o responsável a responder perguntas práticas: o que há no estoque, o que está acabando, o que está perto de vencer, quanto foi registrado em vendas e quais custos de mercadorias foram lançados.

### 1.1 Proposta de Valor

| Pilar | O que o SpeedToBox oferece |
| :--- | :--- |
| **Controle físico** | Produtos, lotes, quantidades, validade e histórico de entradas/saídas. |
| **Visibilidade financeira** | Receitas de vendas registradas, custos de compras de mercadorias e indicadores de resultado bruto. |
| **Apoio à decisão** | Painel com indicadores, alertas e gráficos para identificar tendências e prioridades. |
| **Facilidade de uso** | Interface responsiva, linguagem simples, busca e filtros. |
| **Assistência conversacional** | Chatbot para consultar informações do próprio sistema por perguntas em linguagem natural. |

### 1.2 Limite Financeiro da Proposta

O fluxo financeiro inicial será restrito às operações relacionadas aos produtos: compras de mercadorias e vendas registradas no sistema. Gastos como aluguel, salários, energia, impostos, empréstimos, conciliação bancária, emissão fiscal e contabilidade não serão tratados como parte do núcleo da primeira versão, salvo se o escopo for ampliado e validado posteriormente.

> **Precisão dos indicadores:**
> Receita de vendas menos custo das mercadorias vendidas pode apoiar a leitura do resultado bruto dos produtos. Esse valor não deve ser apresentado como lucro líquido da empresa, pois despesas operacionais, tributos e outros compromissos não fazem parte do escopo inicial.

---

## 2. Problema, Justificativa e Objetivos

### 2.1 Problema
Pequenos negócios podem utilizar anotações, planilhas ou ferramentas separadas para registrar produtos, quantidades, validade, compras e vendas. A falta de integração dificulta a conferência do estoque, pode levar a divergências entre o saldo registrado e o real, aumenta o risco de perdas por vencimento e torna mais difícil entender os resultados financeiros gerados pelas mercadorias.

Quando informações operacionais e financeiras não conversam entre si, o responsável pode não perceber que determinado item vende pouco, está próximo do vencimento, precisa de reposição ou está associado a custos elevados. Também pode gastar tempo procurando dados em diferentes controles.

### 2.2 Justificativa
O desenvolvimento do SpeedToBox se justifica pela possibilidade de centralizar dados, rastrear movimentações e oferecer indicadores compreensíveis sobre estoque e operações com mercadorias. A integração de compras, vendas e movimentações poderá reduzir registros duplicados e facilitar a consulta do histórico. Alertas de estoque baixo e vencimento poderão antecipar ações preventivas, enquanto gráficos de vendas e custos ajudarão a interpretar as operações registradas.

O projeto também permite aplicar conhecimentos de desenvolvimento web, APIs, modelagem relacional, validação de regras de negócio, segurança, interface responsiva e testes. A arquitetura modular permite evoluir o sistema sem tratar a primeira versão como uma solução contábil completa.

### 2.3 Objetivo Geral
Desenvolver um sistema web integrado para controlar produtos, lotes, validades e movimentações de estoque, registrar compras e vendas de mercadorias e apresentar indicadores financeiros relacionados a essas operações, complementados por um chatbot de consulta, a fim de facilitar a gestão cotidiana e apoiar decisões de reposição e prevenção de perdas.

### 2.4 Objetivos Específicos
- Permitir cadastrar, consultar, editar e desativar produtos sem apagar o histórico associado.
- Controlar lotes, quantidades disponíveis e datas de validade.
- Registrar compras/entradas e saídas, mantendo histórico rastreável.
- Registrar vendas de produtos, calcular seus totais e refletir as baixas de estoque.
- Consolidar valores de compras de mercadorias e receitas das vendas registradas.
- Exibir gráficos e indicadores de estoque, vendas, custos e resultado bruto estimado.
- Alertar sobre estoque baixo, lotes próximos do vencimento e produtos vencidos.
- Oferecer um chatbot que responda perguntas com base nos dados acessíveis ao usuário.
- Manter uma estrutura organizada e extensível para futuras funcionalidades.

---

## 3. Público-Alvo e Perfis de Acesso

O público-alvo principal são proprietários, gerentes e funcionários de pequenos comércios, como minimercados, lojas de conveniência e estabelecimentos que vendem produtos sujeitos a controle de lote ou validade. Como parte dos usuários pode ter pouca familiaridade com software de gestão, as telas devem privilegiar clareza, feedback visível e tarefas diretas.

### 3.1 Perfis Previstos

| Perfil | Responsabilidades previstas | Acesso sugerido |
| :--- | :--- | :--- |
| **Proprietário / Administrador** | Configurar o estabelecimento, gerir usuários, consultar estoque e indicadores financeiros, revisar registros e relatórios. | Acesso amplo às funções do estabelecimento. |
| **Responsável pelo Estoque** | Cadastrar e manter produtos, registrar compras/entradas, perdas, ajustes e consultar lotes/alertas. | Operações de estoque; acesso financeiro conforme permissão. |
| **Vendedor / Operador** | Registrar vendas, consultar disponibilidade e validade, pesquisar produtos. | Operações de venda e consultas necessárias à função. |

> **Nota sobre permissões:**
> Os perfis são uma proposta inicial. A equipe deve decidir se a primeira versão implementará permissões detalhadas ou se utilizará um único perfil autenticado com acesso completo, conforme o tempo disponível. Mesmo que a autorização granular seja simplificada, o sistema não deve expor dados de um estabelecimento a outro.

### 3.2 Cenário de Uso Principal
1. O responsável cadastra um produto e define o nível mínimo desejado.
2. A mercadoria chega e é registrada como compra/entrada, com quantidade, custo e lote quando aplicável.
3. O sistema atualiza o saldo e passa a considerar a validade daquele lote nos alertas.
4. O vendedor registra uma venda, seleciona os itens e quantidades, e o sistema registra a receita e baixa o estoque.
5. O painel apresenta indicadores para o período selecionado e destaca produtos que exigem atenção.
6. O usuário pergunta ao chatbot sobre estoque, vencimentos ou números resumidos de compras e vendas.

---

## 4. Escopo do Projeto

Para que o trabalho seja viável no contexto acadêmico, o sistema será desenvolvido por módulos. O núcleo da primeira versão já considera o relacionamento entre estoque e movimentações financeiras de produtos, enquanto funcionalidades de gestão empresarial mais ampla ficam para uma evolução posterior.

### 4.1 Escopo Previsto para a Primeira Versão

| Módulo | Incluído na primeira versão | Observações |
| :--- | :--- | :--- |
| **Produtos** | Cadastro, edição, consulta, pesquisa e desativação; estoque mínimo. | Campos exatos definidos na modelagem. |
| **Lotes e Validade** | Lote, quantidade e vencimento; visão de vencidos e próximos do vencimento. | Aplicável aos produtos que exigirem controle por lote. |
| **Movimentações** | Entradas, saídas, perdas e ajustes identificados; histórico. | Ajustes não devem ser tratados automaticamente como compra ou venda. |
| **Compras de Mercadorias** | Registro de entrada com quantidade e custo de compra. | Registro operacional; não substitui contas a pagar ou gestão de fornecedores. |
| **Vendas** | Registro de itens, quantidade, preço praticado, total, data e forma de pagamento básica. | Não inclui emissão de nota fiscal ou frente de caixa fiscal. |
| **Financeiro de Produtos** | Resumo por período de receitas de vendas, compras registradas e resultado bruto estimado quando os dados forem suficientes. | Não equivale a lucro líquido nem a contabilidade completa. |
| **Dashboard e Gráficos** | Indicadores de estoque, validade, vendas e custos de mercadorias. | Filtros por período e atualização baseada nos registros. |
| **Chatbot** | Consulta em linguagem natural a dados e indicadores disponíveis ao usuário. | Inicialmente somente leitura; não altera dados por conta própria. |
| **Acesso** | Área protegida e vínculo dos dados ao estabelecimento. | Nível de permissões detalhado a confirmar. |

### 4.2 Fora do Escopo Inicial
- Contabilidade completa, cálculo de lucro líquido e apuração fiscal.
- Emissão de notas fiscais, integração com órgãos fiscais, bancos ou maquininhas.
- Contas a pagar/receber completas, fluxo de caixa geral com despesas fixas e folha de pagamento.
- Gestão avançada de fornecedores/clientes, compras automatizadas e pedidos a fornecedores.
- Previsão de demanda avançada ou reposição automática sem aprovação humana.
- Chatbot autorizado a excluir, editar, comprar ou vender sem confirmação explícita do usuário.

### 4.3 Evoluções Possíveis
Em versões futuras, poderão ser considerados cadastro detalhado de fornecedores e clientes, despesas operacionais, contas a pagar e receber, categorias financeiras, integração fiscal, exportações avançadas, previsão de reposição, chatbot com ações confirmadas e integração com serviços externos de inteligência artificial, desde que haja tempo, necessidade e validação dos riscos.

---

## 5. Requisitos Funcionais

| ID | Prioridade | Requisito e Critério Verificável |
| :--- | :--- | :--- |
| **RF-01** | Essencial | A aplicação deve permitir acesso autenticado às áreas de gestão e impedir acesso não autorizado. |
| **RF-02** | Essencial | O usuário deve cadastrar, consultar, editar, pesquisar e desativar produtos. |
| **RF-03** | Essencial | O produto deve permitir informar identificação, nome, unidade, status e estoque mínimo; campos adicionais serão definidos no DER. |
| **RF-04** | Essencial | O sistema deve cadastrar lotes vinculados ao produto, com quantidade e data de validade quando aplicável. |
| **RF-05** | Essencial | O sistema deve registrar entradas de mercadorias, informando quantidade, data e custo unitário ou total de aquisição. |
| **RF-06** | Essencial | O sistema deve registrar saídas e identificar seu motivo, como venda, perda, vencimento ou ajuste. |
| **RF-07** | Essencial | O sistema deve registrar vendas com um ou mais itens, quantidades, preço unitário, desconto autorizado se houver, total e data. |
| **RF-08** | Essencial | Ao confirmar uma venda, o sistema deve atualizar o estoque e registrar a receita associada sem duplicar a operação. |
| **RF-09** | Essencial | O sistema deve manter histórico pesquisável de movimentações de estoque, compras e vendas. |
| **RF-10** | Essencial | O sistema deve indicar produtos cujo saldo esteja igual ou abaixo do estoque mínimo configurado. |
| **RF-11** | Essencial | O sistema deve listar lotes vencidos e lotes que vencerão dentro de uma janela configurável ou definida no sistema. |
| **RF-12** | Essencial | O dashboard deve mostrar indicadores atuais de estoque, alertas, vendas e custos de mercadorias. |
| **RF-13** | Essencial | O usuário deve consultar resumos financeiros relacionados às compras e vendas registradas, com filtro de período. |
| **RF-14** | Essencial | O sistema deve apresentar gráficos temporais de vendas e custos registrados, deixando clara a métrica e o período. |
| **RF-15** | Essencial | O sistema deve distinguir receita, custo de aquisição, valor de estoque e resultado bruto estimado. |
| **RF-16** | Essencial | O usuário deve pesquisar e filtrar produtos, lotes, movimentações e relatórios por critérios relevantes. |
| **RF-17** | Essencial | O chatbot deve responder perguntas de consulta usando informações e indicadores disponíveis ao usuário. |
| **RF-18** | Essencial | O chatbot deve informar quando não houver dados suficientes para uma resposta e não deve inventar valores. |
| **RF-19** | Essencial | O chatbot deve respeitar o estabelecimento e as permissões do usuário autenticado. |
| **RF-20** | Complementar | O sistema deve permitir administrar usuários e associá-los ao estabelecimento, conforme a decisão de permissões. |
| **RF-21** | Complementar | O sistema poderá permitir exportar ou imprimir relatórios resumidos. |
| **RF-22** | Complementar | O sistema poderá manter registro de quem efetuou operações críticas, para auditoria básica. |

---

## 6. Requisitos Não Funcionais

| ID | Categoria | Requisito |
| :--- | :--- | :--- |
| **RNF-01** | Usabilidade | As telas devem usar linguagem simples, ações primárias evidentes, mensagens de validação claras e feedback após operações. |
| **RNF-02** | Responsividade | A interface deve adaptar-se a desktops, tablets e celulares, com prioridade para o uso em telas comuns de comércio. |
| **RNF-03** | Consistência | Alterações de estoque e registros financeiros relacionados devem ser salvos de modo consistente, evitando baixa duplicada ou atualização parcial. |
| **RNF-04** | Segurança | Credenciais devem ser protegidas; endpoints devem validar identidade, autorização e dados recebidos. |
| **RNF-05** | Isolamento | Dados de estabelecimentos diferentes não podem ser acessados ou alterados entre si. |
| **RNF-06** | Integridade | Quantidades e valores devem ser validados no backend; cálculos monetários devem usar tipos decimais apropriados, não ponto flutuante binário. |
| **RNF-07** | Rastreabilidade | Operações relevantes devem guardar data/hora e referência à operação de origem. |
| **RNF-08** | Manutenibilidade | Código organizado por módulos, nomes consistentes, versionamento Git e documentação das decisões relevantes. |
| **RNF-09** | Desempenho | Consultas comuns devem responder em tempo adequado para um pequeno estabelecimento, com paginação quando listas crescerem. |
| **RNF-10** | Disponibilidade | Devem ser previstas rotinas de backup e procedimentos de recuperação no ambiente escolhido. |
| **RNF-11** | Compatibilidade | A aplicação deve funcionar nos navegadores modernos mais comuns, sem depender de recursos específicos de um único navegador. |
| **RNF-12** | Transparência (IA) | Respostas do chatbot baseadas em dados devem indicar o período/critério considerado quando isso afetar o resultado e reconhecer limites de informação. |

---

## 7. Regras de Negócio

| ID | Regra |
| :--- | :--- |
| **RN-01** | O saldo de estoque deve ser derivado de movimentações válidas ou mantido com uma estratégia transacional que garanta correspondência entre saldo e histórico. |
| **RN-02** | A venda só pode ser confirmada se houver quantidade disponível suficiente, salvo se a equipe decidir explicitamente permitir estoque negativo. |
| **RN-03** | A confirmação da venda e a baixa do estoque devem ocorrer juntas: ou ambas são concluídas, ou nenhuma é aplicada. |
| **RN-04** | Cada compra registrada deve identificar a entrada de mercadoria e o custo relacionado. Uma entrada avulsa sem custo não deve ser considerada despesa financeira calculada sem indicação. |
| **RN-05** | Uma saída por venda gera receita de venda; perda, vencimento, doação ou ajuste não geram receita. |
| **RN-06** | A saída por perda ou vencimento deve reduzir o estoque, mas não pode ser contada como venda. |
| **RN-07** | O estoque mínimo é definido por produto. O alerta aparece quando o saldo atual for menor ou igual ao limite. |
| **RN-08** | A condição de vencido é determinada comparando a validade do lote com a data corrente usada pelo sistema; o fuso horário e o critério de fim do dia devem ser definidos de forma consistente. |
| **RN-09** | A janela de "próximo do vencimento" deve ser explícita, por exemplo, vencer nos próximos 7, 15 ou 30 dias. O valor padrão precisa ser escolhido pela equipe. |
| **RN-10** | Produtos desativados não devem ser oferecidos em novas vendas, mas seu histórico e suas movimentações anteriores devem continuar consultáveis. |
| **RN-11** | A exclusão física de produtos, vendas, compras ou movimentações com histórico não deve ser usada como operação comum. Correções devem seguir processo rastreável de estorno/ajuste. |
| **RN-12** | Receita de vendas é calculada a partir das vendas confirmadas, considerando a política de desconto escolhida e excluindo vendas canceladas/estornadas. |
| **RN-13** | Compras de mercadorias e custo das mercadorias vendidas são métricas diferentes. Não subtrair simplesmente todas as compras do período para afirmar lucro do mesmo período sem definir o método de apuração. |
| **RN-14** | O valor estimado do estoque deve identificar o método adotado para o custo. A primeira versão deverá escolher um método simples, como último custo registrado ou custo médio, e aplicá-lo consistentemente. |
| **RN-15** | O indicador chamado "resultado bruto estimado" deve explicitar a metodologia e não deve ser rotulado "lucro líquido". |
| **RN-16** | O chatbot só pode consultar os dados a que o usuário autenticado tem acesso e não pode contornar validações da API. |
| **RN-17** | Na primeira versão, o chatbot será somente leitura. Uma resposta ou sugestão não altera estoque, não confirma venda e não registra compra. |
| **RN-18** | Valores financeiros devem armazenar moeda, precisão e regra de arredondamento de forma consistente. A moeda inicial prevista é o real brasileiro (BRL), sujeita à confirmação. |
| **RN-19** | Toda operação crítica deve evitar duplicidade causada por clique repetido, falha de rede ou repetição de requisição. |
| **RN-20** | A data de registro, a data de compra/venda e a data do pagamento são conceitos distintos. Se não houver registro de pagamento na primeira versão, o relatório deve se chamar resumo de vendas/compras registradas, e não fluxo de caixa realizado. |

> **Ponto de atenção financeiro:**
> Para apresentar um fluxo de caixa realizado, o sistema precisa saber quando o dinheiro efetivamente entrou ou saiu. Se a primeira versão guardar apenas a data da venda e da compra, ela mostrará movimentação comercial registrada, não necessariamente caixa recebido/pago. A equipe deve decidir se registra também a data e o status do pagamento.

---

## 8. Dados e Modelo Conceitual

A lista a seguir é uma proposta inicial de entidades para orientar o DER. Ela não substitui o diagrama definitivo: nomes, cardinalidades, campos obrigatórios, índices, enums e regras de exclusão deverão ser revisados pela equipe antes de criar o banco de dados.

| Entidade Candidata | Responsabilidade Principal | Relações / Observações |
| :--- | :--- | :--- |
| **Estabelecimento** | Representar a empresa/loja dona dos dados. | Agrupa usuários, produtos, compras, vendas e relatórios; permite isolamento de dados. |
| **Usuário** | Identidade e credenciais da pessoa que usa o sistema. | Vinculado a um estabelecimento e a um perfil/permissão. |
| **Produto** | Dados gerais da mercadoria. | Pode ter vários lotes e aparecer em itens de compra, venda e movimentação. |
| **Lote** | Quantidade e validade de uma partida específica. | Vinculado a um produto; validade pode ser opcional quando não aplicável. |
| **Movimentação Estoque** | Histórico de alteração de quantidade e motivo. | Referência à compra, venda, perda, ajuste ou outro evento de origem. |
| **Compra** | Cabeçalho do recebimento/aquisição de mercadorias. | Contém data, estado, valores e itens; pode originar entrada de estoque. |
| **ItemCompra** | Produto, quantidade e custo registrado em cada compra. | Pode vincular a um lote criado/abastecido. |
| **Venda** | Cabeçalho de uma operação de venda. | Data, estado, total, desconto e informações de pagamento definidas no escopo. |
| **ItemVenda** | Produto, quantidade e preço praticado em cada venda. | Guarda preço histórico vendido, não apenas o preço atual do cadastro. |
| **Pagamento / Recebimento** | Registro de entrada/saída efetiva do dinheiro, se incluído na versão. | Necessário para distinguir caixa realizado de venda/compra registrada. |
| **RegistroAuditoria** *(Opcional)* | Registrar usuário, ação, data e objeto afetado. | Ajuda a rastrear correções e operações críticas. |

### 8.1 Relações Principais Previstas
- Um **estabelecimento** possui vários usuários e produtos.
- Um **produto** pode possuir vários lotes, movimentações, itens de compra e itens de venda.
- Uma **compra** contém um ou mais itens de compra; uma **venda** contém um ou mais itens de venda.
- Cada **movimentação** deve indicar o produto, a quantidade, o tipo/motivo, a data e, quando aplicável, a origem relacionada.
- Cada **item de venda** deve preservar o preço praticado naquele momento, mesmo que o preço do produto seja alterado depois.

### 8.2 Campos e Tipos que Merecem Atenção
Valores monetários devem usar um tipo decimal no banco de dados e na API. Datas de validade devem ser armazenadas como datas, sem hora se o negócio não exigir horário. Datas e horas de transações devem seguir uma política de fuso horário consistente. A unidade do produto deve ser definida (unidade, kg, litro etc.) e deve determinar se quantidades fracionárias são permitidas.

### 8.3 Decisões Necessárias Antes de Fechar o DER
1. O estabelecimento será criado por um usuário administrador?
2. Será permitido mais de um usuário por estabelecimento já na primeira versão?
3. O produto terá preço de venda atual no cadastro ou o preço será informado em cada venda, com sugestão a partir do cadastro?
4. Como será calculado o custo de estoque: último custo ou custo médio?
5. O controle de lote será obrigatório para todos os produtos ou configurável por produto?
6. A primeira versão registrará pagamentos recebidos/pagos ou apenas vendas e compras?
7. Como serão tratados cancelamentos, estornos, descontos e vendas parcialmente pagas?

---

## 9. Arquitetura e Tecnologias

A arquitetura prevista separa a interface web, a API de regras de negócio e o banco relacional. Essa separação ajuda a manter as validações centralizadas e facilita testes e futuras expansões.

| Camada / Tecnologia | Papel no Projeto |
| :--- | :--- |
| **Next.js + TypeScript** | Interface web, páginas, componentes e comunicação com a API. |
| **Tailwind CSS** | Sistema de estilos para telas consistentes e responsivas. |
| **Python + FastAPI** | API, validação de dados, regras de negócio, controle de estoque e operações financeiras. |
| **PostgreSQL** | Armazenamento relacional de produtos, lotes, movimentações, compras, vendas, usuários e registros associados. |
| **Git + GitHub** | Versionamento, colaboração e histórico de mudanças. |
| **Visual Studio Code** | Ambiente de desenvolvimento utilizado pela equipe. |

### 9.1 Fluxo Técnico Simplificado

```
[ Interface Web: Next.js ]
        │
        │ (Requisição Autenticada)
        ▼
[ API REST: FastAPI ]
        │
        │ (Validação, Regras de Negócio & Transações)
        ▼
[ Banco de Dados: PostgreSQL ]
```

### 9.2 Princípios de Arquitetura
- A interface não deve ser a única responsável por validar estoque, preço ou total de venda.
- As regras críticas devem ficar na API e ser apoiadas por restrições/transações do banco sempre que possível.
- O cálculo de indicadores deve usar definições documentadas para evitar números diferentes entre telas.
- O chatbot deve consultar funções/serviços da aplicação e não ter acesso irrestrito ao banco ou às credenciais.
- Segredos e credenciais devem ficar em variáveis de ambiente e fora do repositório Git.

---

## 10. Experiência do Usuário e Chatbot

### 10.1 Diretrizes de Interface
- Painel inicial com os avisos mais urgentes e indicadores de leitura rápida.
- Formulários curtos, rótulos objetivos e validação ao lado do campo relevante.
- Busca de produtos por nome/código e filtros por status, categoria, validade e estoque.
- Confirmação antes de operações sensíveis, como concluir venda ou estornar movimentação.
- **Estados vazios úteis:** explicar por que não há registros e qual ação pode ser feita em seguida.
- Gráficos acompanhados de título, unidade, período e explicação do que está sendo comparado.

### 10.2 Escopo Inicial do Chatbot
O chatbot será um assistente de consulta e orientação dentro do SpeedToBox. Deve interpretar a intenção do usuário, consultar dados permitidos por meio da API e responder de forma direta, indicando os filtros usados quando necessário. A primeira versão será somente leitura.

| Tipo de Pergunta | Exemplo de Resposta Esperada |
| :--- | :--- |
| **Estoque** | *"Quais produtos estão abaixo do estoque mínimo?"* com lista de produtos e saldo atual. |
| **Validade** | *"Quais lotes vencem nos próximos 15 dias?"* com produto, lote, quantidade e data. |
| **Vendas** | *"Quanto foi vendido entre 1º e 15 de outubro?"* com total e período utilizado. |
| **Custos** | *"Quanto registrei em compras de mercadorias neste mês?"* com base nas compras registradas. |
| **Resultado bruto** | *"Qual foi o resultado bruto estimado?"* somente se CMV estiver disponível e a metodologia definida. |
| **Orientação** | *"Como registro uma entrada?"* com instruções para navegar até a função correta. |

### 10.3 Limites e Salvaguardas do Chatbot
- Não inventar saldo, valores, lotes nem datas. Quando faltarem registros, informar a limitação.
- Não tratar compras registradas como pagamentos realizados, a menos que o pagamento também esteja registrado.
- Não chamar resultado bruto estimado de lucro líquido.
- Não revelar dados fora do estabelecimento ou das permissões do usuário.
- Não criar, editar, excluir, vender ou movimentar estoque na versão inicial.

---

## 11. Segurança, Privacidade e Confiabilidade

### 11.1 Controles Mínimos Recomendados
- Autenticação para áreas de operação e validação de autorização em cada endpoint protegido.
- Senhas armazenadas com algoritmo próprio para hash de senha, nunca em texto puro.
- Validação de entrada no frontend e, obrigatoriamente, na API.
- Isolamento por estabelecimento aplicado nas consultas e operações do backend.
- Operações transacionais para confirmar vendas, compras e movimentações vinculadas.
- Proteção contra requisições repetidas que criem vendas ou baixas duplicadas.
- Credenciais de banco/serviços fora do código-fonte e do repositório.
- Backups e procedimento conhecido para restauração no ambiente de demonstração.

### 11.2 Tratamento de Falhas

| Situação | Comportamento Esperado |
| :--- | :--- |
| **Quantidade insuficiente** | Bloquear a venda, mostrar saldo disponível e não registrar baixa parcial involuntária. |
| **Erro ao gravar uma venda** | Reverter a operação inteira e informar que a venda não foi concluída. |
| **Falha na atualização do painel**| Manter os dados transacionais íntegros; permitir tentar atualizar a consulta novamente. |
| **Chatbot sem dados** | Informar que não encontrou registros para o período ou pergunta, sem preencher lacunas com suposições. |
| **Produto em histórico** | Impedir exclusão destrutiva comum; oferecer desativação ou processo de estorno apropriado. |
| **Acesso não autorizado** | Recusar a requisição sem revelar dados protegidos. |

---

## 12. Estratégia de Testes e Critérios de Aceite

### 12.1 Casos de Teste Essenciais

| ID | Cenário | Resultado Esperado |
| :--- | :--- | :--- |
| **CT-01** | Cadastrar produto válido. | Produto aparece na pesquisa e pode ser consultado. |
| **CT-02** | Registrar compra com itens, custo e lote. | Compra é salva; entrada de estoque e custo registrado correspondem aos itens confirmados. |
| **CT-03** | Registrar venda com saldo suficiente. | Venda e itens são salvos, saldo é reduzido uma única vez e os indicadores consideram a venda. |
| **CT-04** | Tentar vender quantidade maior que o saldo. | Operação é bloqueada e o estoque permanece inalterado. |
| **CT-05** | Registrar perda de produto. | Saldo diminui, histórico identifica perda e receita de venda não aumenta. |
| **CT-06** | Configurar estoque mínimo e atingir o limite. | Produto aparece no alerta de estoque baixo. |
| **CT-07** | Consultar lote vencido e próximo do vencimento.| Listagens classificam corretamente lotes conforme as datas e janela configurada. |
| **CT-08** | Filtrar vendas por período. | Totais incluem somente os registros elegíveis segundo a regra documentada. |
| **CT-09** | Perguntar ao chatbot por vendas do período. | Resposta bate com a consulta de referência e informa o período utilizado. |
| **CT-10** | Tentar consultar dados de outro estabelecimento. | Acesso é negado e nenhum dado indevido é retornado. |
| **CT-11** | Repetir uma requisição de venda. | A aplicação não cria venda nem baixa duplicada. |
| **CT-12** | Falhar a gravação no meio da transação. | Não ficam venda e estoque em estados divergentes. |

### 12.2 Critérios Gerais para Considerar o Projeto Pronto
- As funcionalidades essenciais estão acessíveis por uma interface coerente e responsiva.
- Os registros podem ser consultados após sair e entrar novamente no sistema.
- As regras de estoque e os cálculos financeiros definidos pela equipe passam nos testes.
- Os indicadores do painel correspondem a consultas verificadas com dados de teste.
- O chatbot respeita permissões, não inventa números e não altera registros.
- A equipe consegue demonstrar um fluxo completo de compra, atualização do lote/estoque, venda, baixa, painel e consulta ao chatbot.

---

## 13. Plano de Implementação

### 13.1 Etapas de Desenvolvimento

| Etapa | Entregáveis | Condição para Avançar |
| :--- | :--- | :--- |
| **1. Validação** | Aprovação do escopo, definição dos perfis e decisões financeiras pendentes. | Equipe e supervisor concordam com o recorte. |
| **2. Modelagem** | Casos de uso, DER, dicionário de dados e regras detalhadas. | Entidades e relacionamentos revisados. |
| **3. Fundação Técnica** | Repositório, estrutura Next.js, API FastAPI, conexão PostgreSQL e autenticação. | Aplicação executa localmente e endpoints básicos respondem. |
| **4. Estoque** | Produtos, lotes, entradas, saídas, alertas e histórico. | Saldos conferem com os testes definidos. |
| **5. Compras e Vendas** | Registro dos itens, custos, preços, totais, baixas e tratamento de cancelamento. | Operações integradas e sem duplicidade. |
| **6. Painel Financeiro** | Consultas consolidadas, filtros e gráficos de vendas/custos/resultado bruto estimado. | Indicadores batem com dados de teste. |
| **7. Chatbot** | Consulta segura à API, intents/perguntas suportadas, limites e mensagens de erro. | Respostas testadas, coerentes e somente leitura. |
| **8. Testes e Entrega** | Testes finais, correções, documentação, roteiro de demonstração e apresentação. | Critérios de aceite cumpridos e versão demonstrável. |

### 13.2 Divisão do Trabalho na Dupla
A divisão de responsabilidades é compartilhada entre os integrantes **Mylenna Gonçalves De Paula** e **Brayan Alexandre Ivo Garrido**:

- **Mylenna Gonçalves De Paula:** Interface do Usuário (UI/UX), prototipagem, desenvolvimento de páginas e componentes em Next.js, estilização responsiva com Tailwind CSS e integração frontend com a API.
- **Brayan Alexandre Ivo Garrido:** Arquitetura do Backend em Python com FastAPI, modelagem do Banco de Dados PostgreSQL, regras de negócio transacionais, endpoints RESTful e implementação da lógica do chatbot.

### 13.3 Entregáveis Acadêmicos Sugeridos
1. Briefing validado e documentação de requisitos.
2. Diagramas de casos de uso e DER revisado.
3. Repositório GitHub com histórico de colaboração da dupla.
4. Aplicação demonstrável com dados fictícios de teste.
5. Plano/casos de teste e evidências de validação.
6. Manual breve de uso e instruções de execução local.
7. Apresentação final com demonstração de um fluxo ponta a ponta.

---

## 14. Riscos e Decisões Pendentes

### 14.1 Principais Riscos

| Risco | Impacto Possível | Resposta Recomendada |
| :--- | :--- | :--- |
| **Escopo crescer além do tempo** | Atraso ou funcionalidades incompletas. | Proteger o núcleo e adiar integrações fiscais, despesas gerais e automações. |
| **Definição financeira inconsistente** | Gráficos com números incorretos ou confusão entre compra, custo e caixa. | Definir métricas, datas, estornos e método de custo antes de programar os relatórios. |
| **Estoque divergente** | Vendas impossíveis, perdas de controle ou saldos negativos. | Usar transações, validações no backend e testes repetidos/concomitantes. |
| **Chatbot alucinar ou expor dados** | Decisões erradas e risco de privacidade. | Limitar a consultas estruturadas, validar permissões e testar perguntas com dados conhecidos. |

### 14.2 Decisões Pendentes Prioritárias

| Decisão | Recomendação Inicial para Discussão |
| :--- | :--- |
| **Significado de fluxo de caixa** | Na primeira versão, usar o nome "resumo de compras e vendas registradas", salvo se houver controle de pagamento. |
| **Métrica de custo/resultado** | Separar valor comprado do custo das mercadorias vendidas (CMV). |
| **Método de custo do estoque** | Escolher entre último custo registrado e custo médio. |
| **Lotes** | Permitir configuração por produto (opcional para itens sem validade). |
| **Janelas de alerta** | Definir padrão para validade próxima (ex.: 7, 15 ou 30 dias). |

---

## 15. Glossário

| Termo | Definição Utilizada no Projeto |
| :--- | :--- |
| **Estoque** | Quantidade de mercadoria disponível segundo os registros válidos do sistema. |
| **Produto** | Cadastro geral do item comercializado, independentemente da partida ou lote. |
| **Lote** | Conjunto/partida de um produto com identificação e, quando aplicável, data de validade própria. |
| **Movimentação** | Registro de alteração do estoque com tipo, quantidade, data e motivo. |
| **Compra registrada** | Operação que documenta aquisição/entrada de mercadorias no sistema. |
| **Venda registrada** | Operação comercial documentada no sistema. |
| **Receita de vendas** | Valor das vendas elegíveis no período, após aplicação de descontos e estornos. |
| **CMV** | Custo das Mercadorias Vendidas no período, conforme método adotado. |
| **Resultado bruto estimado**| Receita líquida das vendas menos CMV. |
| **Chatbot** | Interface de conversa que auxilia consultas e navegação (somente leitura no MVP). |
| **DER** | Diagrama Entidade-Relacionamento do banco de dados. |
| **API** | Interface pela qual o frontend solicita dados e operações ao backend. |

---

### Encerramento e Próximos Passos
O **SpeedToBox** propõe integrar a gestão física de mercadorias, o registro de operações comerciais e a leitura financeira em um ambiente único. A confiabilidade do projeto dependerá da consistência das regras transacionais e da precisão dos dados apresentados.

**Próximo passo recomendado para Mylenna e Brayan:**
Realizar uma reunião rápida para fechar as decisões pendentes prioritárias (método de custo e janelas de alerta) e avançar na criação do Diagrama Entidade-Relacionamento (DER) e dos protótipos de tela.