# Guia de Deploy - TibiaRise Monorepo

Este guia detalha como fazer deploy dos apps do monorepo TibiaRise.

## Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────────┐
│                        TibiaRise                            │
├────────────────────────┬────────────────────────────────────┤
│        Vercel          │           VPS + Coolify            │
│    (@tibiarise/web)    │        (@tibiarise/cron)           │
│                        │                                    │
│  • Frontend Next.js    │  • Cron Jobs                       │
│  • API Routes          │  • Seed Experience                 │
│  • SSR/ISR             │  • Cleanup                         │
│  • Edge Functions      │  • Deduplication                   │
└────────────────────────┴────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Supabase/    │
                    │    Neon/RDS)    │
                    └─────────────────┘
```

---

## 1. Deploy do Web App (Vercel)

### 1.1 Configuração Inicial no Vercel

1. **Conectar Repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório do GitHub
   - Selecione a pasta raiz do monorepo

2. **Configurar Root Directory**

   ```
   Root Directory: apps/web
   ```

3. **Configurar Build Settings**

   ```
   Framework Preset: Next.js
   Build Command: cd ../.. && npm run build --filter=@tibiarise/web
   Output Directory: .next
   Install Command: cd ../.. && npm install
   ```

   **OU** use estas configurações simplificadas:

   ```
   Root Directory: (deixe vazio - raiz do monorepo)
   Build Command: npm run build --filter=@tibiarise/web
   Output Directory: apps/web/.next
   ```

4. **Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/tibiarise
   NEXTAUTH_URL=https://seu-dominio.vercel.app
   NEXTAUTH_SECRET=sua-secret-key
   GOOGLE_CLIENT_ID=seu-google-client-id
   GOOGLE_CLIENT_SECRET=seu-google-client-secret
   ```

### 1.2 Configuração do vercel.json (opcional)

Se preferir, crie um `vercel.json` na raiz do monorepo:

```json
{
  "buildCommand": "npm run build --filter=@tibiarise/web",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

### 1.3 Deploy Automático

Após configurar, cada push para a branch `main` irá:

1. Instalar dependências do monorepo
2. Gerar Prisma Client
3. Buildar apenas o app `@tibiarise/web`
4. Deploy no Vercel

### 1.4 Comandos Manuais (CLI)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod
```

---

## 2. Deploy do Cron Service (Coolify)

### 2.1 Pré-requisitos

- VPS com Coolify instalado
- Acesso SSH ao servidor
- Repositório Git acessível

### 2.2 Configuração no Coolify

1. **Criar Nova Aplicação**
   - Acesse seu Coolify dashboard
   - Clique em "Add Resource" → "Application"
   - Selecione "Docker"

2. **Configurar Source**

   ```
   Git Repository: seu-repositorio
   Branch: main
   Build Pack: Dockerfile
   Dockerfile Location: apps/cron/Dockerfile
   Docker Context: . (raiz do monorepo)
   ```

3. **Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/tibiarise
   TIBIA_DATA_API_URL=https://api.tibiadata.com/v4
   NODE_ENV=production
   ```

### 2.3 Configurar como Cron Job

No Coolify, você pode configurar o container para rodar como cron:

**Opção A: Scheduled Tasks no Coolify**

1. Na aba "Scheduled Tasks"
2. Adicione uma tarefa:

   ```
   Name: Seed Experience
   Command: node dist/index.js seed
   Cron Expression: 0 */6 * * *  (a cada 6 horas)
   ```

3. Adicione outra tarefa:
   ```
   Name: Cleanup Old Data
   Command: node dist/index.js cleanup
   Cron Expression: 0 3 * * 0  (todo domingo às 3h)
   ```

**Opção B: Crontab no Container**

Modifique o Dockerfile para usar crontab interno:

```dockerfile
# Adicione ao final do Dockerfile
RUN echo "0 */6 * * * cd /app/apps/cron && node dist/index.js seed >> /var/log/cron.log 2>&1" >> /etc/crontabs/root
RUN echo "0 3 * * 0 cd /app/apps/cron && node dist/index.js cleanup >> /var/log/cron.log 2>&1" >> /etc/crontabs/root

CMD ["crond", "-f", "-d", "8"]
```

**Opção C: Container que executa uma vez e sai**

Para jobs que devem rodar via external scheduler (GitHub Actions, etc):

```bash
# Seed
docker run --rm -e DATABASE_URL=... tibiarise-cron node dist/index.js seed

# Cleanup
docker run --rm -e DATABASE_URL=... tibiarise-cron node dist/index.js cleanup
```

### 2.4 Health Check

Adicione um health check no Coolify:

```
Health Check Path: (não aplicável para cron)
Restart Policy: on-failure
```

### 2.5 Build Manual via SSH

```bash
# No servidor VPS
cd /path/to/tibiarise

# Pull latest
git pull origin main

# Build cron
docker build -f apps/cron/Dockerfile -t tibiarise-cron .

# Run seed job
docker run --rm \
  -e DATABASE_URL="postgresql://..." \
  tibiarise-cron node dist/index.js seed
```

---

## 3. Configuração do Banco de Dados

### 3.1 Migrations

As migrations devem ser executadas antes do primeiro deploy:

```bash
# Localmente, com acesso ao banco de produção
cd packages/database
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 3.2 Opções de Hosting PostgreSQL

| Provider        | Plano Gratuito   | Prod Recomendado     |
| --------------- | ---------------- | -------------------- |
| **Supabase**    | 500MB            | Sim                  |
| **Neon**        | 0.5GB            | Sim                  |
| **Railway**     | $5 credits       | Sim                  |
| **PlanetScale** | 5GB (MySQL)      | Não (não é Postgres) |
| **AWS RDS**     | 750h/mês (1 ano) | Sim                  |

---

## 4. CI/CD com GitHub Actions

### 4.1 Workflow para Vercel (automático)

O Vercel já configura automaticamente via GitHub integration.

### 4.2 Workflow para Cron (Coolify)

Crie `.github/workflows/deploy-cron.yml`:

```yaml
name: Deploy Cron to Coolify

on:
  push:
    branches: [main]
    paths:
      - "apps/cron/**"
      - "packages/database/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify Deploy
        run: |
          curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}"
```

### 4.3 Secrets Necessários

No GitHub Repository Settings → Secrets:

```
COOLIFY_WEBHOOK_URL: (URL do webhook do Coolify)
```

---

## 5. Monitoramento

### 5.1 Logs

**Vercel:**

- Dashboard → Deployments → View Logs
- Ou via CLI: `vercel logs`

**Coolify:**

- Dashboard → Application → Logs
- Ou via SSH: `docker logs tibiarise-cron`

### 5.2 Alertas Recomendados

Configure alertas para:

- Falha no cron job
- Erro de conexão com banco
- Alto uso de memória/CPU

---

## 6. Troubleshooting

### Problema: Prisma Client não encontrado

```bash
# Regenerar Prisma
npm run db:generate
```

### Problema: Workspaces não resolvendo

```bash
# Limpar e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### Problema: Build falhando no Vercel

Verifique:

1. Root Directory está correto
2. Environment variables configuradas
3. Build command inclui `npm install` na raiz

### Problema: Cron não executando no Coolify

Verifique:

1. Logs do container
2. Permissions do crontab
3. Environment variables corretas

---

## 7. Checklist de Deploy

### Primeiro Deploy

- [ ] Banco de dados PostgreSQL provisionado
- [ ] Migrations executadas (`prisma migrate deploy`)
- [ ] Environment variables configuradas no Vercel
- [ ] Environment variables configuradas no Coolify
- [ ] Secrets do NextAuth configurados
- [ ] Google OAuth credentials configuradas
- [ ] DNS apontando para Vercel

### Cada Deploy

- [ ] Testes passando localmente
- [ ] Build local funcionando (`npm run build`)
- [ ] Migrations pendentes aplicadas
- [ ] Review das environment variables
