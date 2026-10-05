<div align="center">

# SRAG 2026 — Estatística Descritiva

### Análise descritiva de notificações de Síndrome Respiratória Aguda Grave (2026)

</div>

---

## Sobre o projeto

Este site nasceu de uma atividade avaliativa de estatística descritiva, mas foi pensado para ser muito mais do que um trabalho de faculdade: a ideia é **contar a história das notificações de SRAG no Brasil em 2026** de um jeito que qualquer pessoa consiga entender.

Em vez de entregar planilhas enormes cheias de números soltos, o projeto transforma **os dados oficiais do SIVEP-Gripe (Portal de Dados Abertos do SUS)** em gráficos interativos, filtros fáceis de usar e visualizações estatísticas que mostram como as internações e óbitos por vírus respiratórios se comportaram.

---

## O que ele faz

Com dados de **170.328 registros** de notificações hospitalizadas e óbitos por SRAG, o site permite:

- **Explorar a distribuição por sexo** — Tabela de frequências com proporção feminino vs masculino.
- **Analisar raça/cor** — Frequências da variável CS_RACA por categoria, com a proporção de cada grupo.
- **Visualizar classificação final** — Gráfico de barras da classificação do caso (CLASSI_FIN), mostrando a mais frequente.
- **Entender a distribuição de idade** — Histograma com densidade de frequência e amplitude 10, identificando a faixa etária mais comum.
- **Ver medidas-resumo** — Média, mediana, desvio padrão, coeficiente de variação e quartis da idade das notificações.
- **Descobrir a evolução mais comum** — Moda da variável EVOLUCAO (cura, óbito, etc.).
- **Cruzar vacina com UTI** — Tabela cruzada mostrando a proporção de vacinados e não vacinados internados em UTI.
- **Comparar idade por sexo** — Box-plot com quartis, mediana e outliers para cada sexo.
- **Dashboards interativos** — Gráficos dinâmicos com filtros combináveis para explorar qualquer variável do dataset.
- **Gerar relatórios PDF** — Exportar análises completas em PDF com um clique.

---

## Como funciona o pipeline

```
INFLUD26.csv (fonte bruta, SIVEP-Gripe)
        │
        ▼
scripts/export-data.mjs   ← Node lê o CSV, calcula todas as respostas
        │
        ▼
src/data/srag.ts           ← dados pré-processados + respostas (gerado, commitado)
        │
        ▼
Componentes React (Items, Dashboard, FormulasLab…)  ← consomem srag.ts, sem backend
```

---

## Os 8 itens de análise descritiva

| Item | Variável | Análise | Tipo de gráfico |
|:--|:--|:--|:--|
| 1 | CS_SEXO | Tabela de frequências — % feminino vs masculino | Tabela + barras inline |
| 2 | CS_RACA | Tabela de frequências — proporção por raça/cor | Tabela + barras inline |
| 3 | CLASSI_FIN | Gráfico de barras — classificação mais frequente | Barras horizontais |
| 4 | NU_IDADE_N | Histograma (densidade, amplitude 10) — faixa mais frequente | SVG histograma |
| 5 | NU_IDADE_N | Medidas-resumo (média, mediana, DP, CV, quartis) | Tabela estatística |
| 6 | EVOLUCAO | Moda — evolução mais frequente | Barras horizontais |
| 7 | VACINA × UTI | Tabela cruzada — % internados em UTI por vacinação | Tabela cruzada + heatmap |
| 8 | NU_IDADE_N × CS_SEXO | Box-plot comparativo — dispersão, mediana, outliers | SVG box-plot |

---

## Dashboard interativo

Além dos 8 itens, o site oferece um **dashboard completo** para exploração livre dos dados:

- **5 dimensões** — Sexo, Idade, Raça/Cor, Classificação, Evolução, Vacina × UTI
- **5 tipos de gráfico** — Barra, Horizontal, Donut, Histograma, Tabela cruzada
- **Filtros combináveis** — Sexo, Faixa Etária, Raça/Cor, Classificação, Vacina, UTI
- **Cards de resumo** — Total de notificações, óbitos, internações em UTI, taxa de letalidade
- **Insights dinâmicos** — Análises automáticas dos dados filtrados

---

## O site oferece

- **8 itens de análise descritiva** — Tabelas, gráficos, box-plot, histograma
- **Dashboard interativo** — Gráficos dinâmicos com filtros combináveis
- **Fórmulas estatísticas** — Fórmulas com mini-visualizações SVG (barra de frequência, mini pie, box-plot mini, etc.)
- **Exportação em PDF** — Gerar relatórios completos com um clique
- **Modo claro e escuro** — Para gostar de cada um
- **3 idiomas** — Português, Inglês e Espanhol
- **Animação de fundo** — Canvas 2D com tema de "Data Flow" (nós, símbolos, micro-gráficos)
- **Responsivo** — Funciona no celular e no desktop

---

## Tecnologias

| Camada | Tecnologias |
|:--|:--|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Visual | Framer Motion 12, CSS customizado (tema claro/escuro) |
| i18n | i18next (PT/EN/ES) |
| Pipeline | Node.js (leitura CSV) |
| Qualidade | Vitest 4, ESLint 10 |
| Animação | Canvas 2D (Data Flow), Framer Motion |
| Exportação | jsPDF, html2canvas |

---

## Como rodar

Precisa ter o [Node.js](https://nodejs.org/) instalado (versão 18 ou superior).

```bash
git clone https://github.com/manoelja/descriptive-statistics.git
cd descriptive-statistics
npm install
npm run dev
```

Depois é só abrir `http://localhost:5173` no navegador.

| Comando | O que faz |
|:--|:--|
| `npm run dev` | Sobe o site em desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run lint` | Verifica o código |
| `npm run test` / `npx vitest run` | Roda os 15 testes automatizados |
| `npm run data:export` | Regenera `src/data/srag.ts` a partir do CSV |

---

## Estrutura

```
descriptive-statistics/
├── INFLUD26.csv       # dados brutos (SIVEP-Gripe)
├── package.json
├── vite.config.ts / vitest.config.ts
├── scripts/
│   └── export-data.mjs           # CSV → src/data/srag.ts
└── src/
    ├── main.tsx / App.tsx / i18n.ts
    ├── styles/global.css
    ├── data/srag.ts              # gerado pelo script
    ├── hooks/ (useActiveSection, useTypewriter)
    ├── components/
    │   ├── Navbar/ Hero/ Footer/
    │   ├── CyberBackground/      # animação "Data Flow"
    │   ├── Items/                # 8 itens de análise descritiva
    │   │   ├── Item1Sexo.tsx
    │   │   ├── Item2Raca.tsx
    │   │   ├── Item3Classificacao.tsx
    │   │   ├── Item4Histograma.tsx
    │   │   ├── Item5ResumoIdade.tsx
    │   │   ├── Item6Evolucao.tsx
    │   │   ├── Item7VacinaUTI.tsx
    │   │   └── Item8BoxPlot.tsx
    │   ├── Dashboard/            # dashboard interativo com gráficos
    │   ├── FormulasLab/          # fórmulas estatísticas + mini-widgets
    │   ├── Skills/               # tecnologias utilizadas
    │   ├── About/                # sobre o projeto
    │   └── Contact/              # fluxograma do pipeline
    └── test/
        ├── setup.ts
        └── srag-data.test.ts     # 15 testes de integridade
```

---

<div align="center">

**Feito com ❤️ para análise estatística de dados de saúde pública**

</div>
