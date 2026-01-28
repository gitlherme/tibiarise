# TibiaRise Monorepo

Este é um monorepo gerenciado com [Turborepo](https://turbo.build/) e NPM Workspaces.

## Estrutura

```
tibiarise/
├── apps/
│   ├── web/          # Frontend Next.js (Vercel)
│   └── cron/         # Cron Service (Coolify/VPS)
├── packages/
│   ├── database/     # Prisma client compartilhado
│   └── shared/       # Types e utils compartilhados
├── turbo.json        # Configuração Turborepo
└── package.json      # Root com NPM workspaces
```

## Primeiros Passos

```bash
# Instalar dependências (na raiz do monorepo)
npm install

# Gerar Prisma Client
npm run db:generate

# Rodar todos os apps em dev
npm run dev

# Rodar apenas o web
npm run dev:web

# Rodar apenas o cron
npm run dev:cron
```

## Scripts Disponíveis

| Script                | Descrição                      |
| --------------------- | ------------------------------ |
| `npm run dev`         | Roda todos os apps em modo dev |
| `npm run build`       | Build de todos os apps         |
| `npm run dev:web`     | Dev apenas do app web          |
| `npm run dev:cron`    | Dev apenas do cron             |
| `npm run db:generate` | Gera Prisma Client             |
| `npm run db:migrate`  | Executa migrations             |
| `npm run db:push`     | Push do schema para o banco    |

## Apps

### @tibiarise/web

Frontend Next.js 15 com:

- App Router
- next-intl (i18n)
- next-auth (autenticação)
- shadcn/ui (componentes)
- React Query (data fetching)

### @tibiarise/cron

Serviço de cron jobs para:

- Seed de experiência dos jogadores (`seed`)
- Limpeza de dados antigos (`cleanup`)
- Deduplicação de personagens (`deduplicate`)

## Packages

### @tibiarise/database

Prisma Client singleton compartilhado entre apps.

### @tibiarise/shared

Types e utils compartilhados:

- Models TypeScript
- Funções utilitárias (formatação, cálculos)

## Deploy

Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy.
