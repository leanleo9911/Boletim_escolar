Leonardo Santos Costa - 2504288
  Glória Mariano Feliciano - 2504112
# Sistema de Gestão de Boletins Escolares

## 📋 Descrição
Sistema completo desenvolvido em TypeScript para gestão de boletins escolares. A aplicação permite cadastrar alunos, calcular médias, determinar aprovação/reprovação e gerar relatórios em formato texto e CSV.

## 🎯 Funcionalidades

### ✅ Cadastro de Alunos
- Coleta de nome e série do aluno
- Registro de faltas (máximo 200 aulas)
- Entrada de 8 notas para cada uma das 5 matérias:
  - Matemática
  - Português
  - Geografia
  - História
  - Química

### ✅ Cálculos Automáticos
- **Média por matéria**: Soma das 8 notas dividida por 8
- **Média geral**: Média das médias de todas as matérias
- **Percentual de presença**: ((200 - faltas) / 200) × 100
- **Aprovação**: Média ≥ 7.0 E presença ≥ 75%

### ✅ Geração de Boletins
- Boletim completo em formato texto (.txt)
- Informações detalhadas: notas, médias, presença, status
- Identificação de matérias em recuperação
- Classificação de desempenho

### ✅ Persistência de Dados
- Armazenamento em arquivo CSV
- Histórico completo de todos os alunos
- Relatórios estatísticos
- Exportação de dados

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Iniciando o Sistema
- Execute `node dist/index.js` no terminal
- O menu principal será exibido com as opções disponíveis

### 2. Cadastrando um Aluno
- Escolha " Cadastrar novo aluno"
- Insira o nome do aluno (mínimo 2 caracteres, apenas letras)
- Informe a série (ex: "9º ano", "1º ano EM")
- Digite o número de faltas (0 a 200)
- Para cada matéria, insira 8 notas (0.0 a 10.0)
- Confirme os dados inseridos

### 3. Visualizando Resultados
- O sistema calcula automaticamente:
  - Média de cada matéria
  - Média geral do aluno
  - Percentual de presença
  - Status de aprovação/reprovação
- Um boletim em texto é gerado e salvo na pasta `data/`

### 4. Consultando Dados
- **Listar alunos**: Visualiza todos os alunos cadastrados
- **Relatório estatístico**: Mostra estatísticas da turma
- **Exportar dados**: Cria backup dos dados em CSV

##  Critérios de Avaliação

### Aprovação
Para ser aprovado, o aluno deve atender **AMBOS** os critérios:
- ✅ **Média geral ≥ 7.0**
- ✅ **Presença ≥ 75%**

### Recuperação
Matérias com média individual < 7.0 são marcadas para recuperação.

### Classificação de Desempenho
- **Excelente**: ≥ 9.0
- **Bom**: ≥ 8.0
- **Regular**: ≥ 7.0
- **Insuficiente**: ≥ 5.0
- **Crítico**: < 5.0

## 📄 Formato dos Arquivos

### Boletim (TXT)
```
═══════════════════════════════════════════════════════════════════════════════
                          BOLETIM ESCOLAR
═══════════════════════════════════════════════════════════════════════════════

DADOS DO ALUNO:
----------------------------------------
Nome: João Silva
Série: 9º ano
Data de Cadastro: 14/10/2025 10:30
Data de Geração: 14/10/2025 10:35

FREQUÊNCIA:
----------------------------------------
Faltas: 20
Presença: 90.0%

NOTAS POR MATÉRIA:
----------------------------------------
Matéria     Notas                                         Média
────────────────────────────────────────────────────────────────────────────────
Matemática  [8.5, 7.0, 9.0, 8.0, 7.5, 8.5, 9.0, 8.0]  8.19
Português   [9.0, 8.5, 8.0, 9.5, 8.0, 8.5, 9.0, 8.5]  8.63
...

RESULTADO FINAL:
----------------------------------------
🎉 ALUNO APROVADO
```

### Base de Dados (CSV)
```csv
nome,serie,faltas,dataCadastro,notasMatematica,notasPortugues,...,mediaGeral,percentualPresenca,aprovado,motivoReprovacao
João Silva,9º ano,20,2025-10-14T13:30:00.000Z,8.5;7.0;9.0;8.0;7.5;8.5;9.0;8.0,...,8.41,90.0,true,
```

## 🛠️ Tecnologias Utilizadas

- **TypeScript**: Linguagem principal
- **Node.js**: Runtime de execução
- **readline-sync**: Interface interativa no console
- **iconv-lite**: Codificação UTF-8 e suporte a acentos
- **File System (fs)**: Manipulação de arquivos
- **Path**: Manipulação de caminhos de arquivos

## 🔧 Configurações

### Constantes do Sistema (`src/models/Constantes.ts`)
```typescript
export const CONFIG_AVALIACAO = {
  NOTA_MINIMA_APROVACAO: 7.0,        // Nota mínima para aprovação
  PRESENCA_MINIMA_APROVACAO: 75,      // Presença mínima (%)
  NUMERO_NOTAS_POR_MATERIA: 8,        // Quantidade de notas por matéria
  TOTAL_AULAS_PERIODO: 200            // Total de aulas no período
};
```

## 📝 Validações Implementadas

### Entrada de Dados
- **Nome**: Mínimo 2 caracteres, apenas letras e espaços
- **Série**: Campo obrigatório
- **Faltas**: Número inteiro entre 0 e 200
- **Notas**: Números decimais entre 0.0 e 10.0

### Tratamento de Erros
- Validação de tipos de dados
- Verificação de intervalos válidos
- Tratamento de arquivos corrompidos
- Mensagens de erro informativas

## 🎨 Interface do Usuário

### Características
- **Menu interativo**: Navegação por setas e Enter
- **Feedback visual**: Emojis e cores para status
- **Validação em tempo real**: Verificação imediata de entradas
- **Confirmação de dados**: Revisão antes de salvar
- **Mensagens claras**: Instruções e feedback detalhados

## 📈 Relatórios e Estatísticas

### Relatório Individual (Boletim)
- Todas as notas organizadas por matéria
- Médias parciais e geral
- Frequência e presença
- Status de aprovação detalhado
- Matérias em recuperação

### Relatório da Turma
- Total de alunos cadastrados
- Taxa de aprovação/reprovação
- Média geral da turma
- Presença média da turma
