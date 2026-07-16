# Meu Closet

Aplicação web para **organizar o guarda-roupa**, **montar combinações de looks** e **planejar o que vestir** — com dashboard analítico de uso ao longo do ano.

Projeto full-stack pensado como produto pessoal, com visual dark/glass e foco em usabilidade.

## Funcionalidades

- Cadastro de peças (roupas, sapatos, bolsas, acessórios, bandanas)
- Montagem de looks combinando peças por tag/ocasião
- Planejamento de looks por data (trabalho, academia, ocasiões especiais)
- Dashboard com estatísticas de uso (tops, bottoms, vestidos, sapatos, bolsas)
- Looks não utilizados no ano corrente
- Autenticação JWT com recuperação de senha

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | Angular 21, PrimeNG 21, PrimeFlex, RxJS, Highcharts |
| Backend | Node.js, Express, MongoDB, JWT |
| Padrões | Facades, stores reativos, tema customizado (`ClosetTheme`) |

## Arquitetura

```
my-clothing-app (Angular)  →  my-clothing-api (Express)  →  MongoDB
        │                              │
   Components/Pages              Routes/Services
   Facades + Stores              Models + Controllers
```

## Pré-requisitos

- Node.js >= 24.15
- npm >= 11.12
- MongoDB (Atlas ou local)

## Como rodar localmente

### 1. API

```bash
cd my-clothing-api
cp .env.example .env
# Edite .env com suas credenciais MongoDB e SMTP
npm install
npm start
```

A API sobe em `http://localhost:3001`.

> **Windows:** se `mongodb+srv://` falhar, use a connection string `mongodb://` padrão (veja comentário no `.env.example`).

### 2. App

```bash
cd my-clothing-app
npm install
npm start
```

O app abre em `http://localhost:1104`.

Configure a URL da API em `src/environments/environment.ts` se necessário:

```ts
export const environment = {
  production: false,
  url: 'http://localhost:3001/api',
};
```

## Scripts úteis

```bash
# Frontend
npm start          # dev server (porta 1104)
npm run build      # build de produção

# Backend
npm start          # API (porta 3001)
```

## Estrutura do frontend (principais pastas)

```
src/app/
├── components/     # UI reutilizável (look-card, charts, dialogs)
├── facades/        # Orquestração de dados
├── pages/          # Telas (home, looks, planned-looks, …)
├── services/       # HTTP clients
├── stores/         # Estado reativo
└── styles/         # Tema ClosetTheme + overrides glass
```

## Screenshots

| Tela | Descrição |
|------|-----------|
| Home | Dashboard com stats, próximo look e gráficos |
| Looks | Grid de cards com combinações coloridas |
| Planejados | Agenda de looks por data |


## Licença

Projeto pessoal — uso livre para referência de portfolio.
