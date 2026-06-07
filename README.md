# LP AI

Micro SaaS B2B da AceleraObra para criar, publicar e gerenciar landing pages
profissionais para lojas de materiais de construção e tintas.

## O que o sistema faz

- Painel administrativo com login por e-mail e senha.
- Cadastro, edição, ativação, desativação e exclusão de LPs.
- Landing page pública por loja em `/site/[slug]` e em subdomínio próprio.
- Upload de logo da loja e logos das marcas vendidas.
- Cores principais sugeridas automaticamente a partir da logo.
- Produtos, avaliações, endereço, horários, redes sociais e WhatsApp.
- Formulário de lead com envio para webhook de CRM.
- Pixel da Meta e conversão do Google Ads por loja.
- Cadastro de usuários do painel com senha padrão `acelera123`.

## Stack

- Next.js 14 com App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL/Supabase
- NextAuth com e-mail e senha
- Supabase Storage para logos
- React Hook Form + Zod

## Funcionamento em produção

O painel administrativo ficará no domínio principal:

```text
https://aceleraobra.com.br/admin/login
```

Cada loja terá uma LP pública em subdomínio:

```text
https://slug-da-loja.aceleraobra.com.br
```

O `middleware.ts` identifica o subdomínio e entrega a página pública correta.
Em desenvolvimento, a mesma LP pode ser acessada por:

```text
http://localhost:3000/site/[slug]
http://localhost:3000?slug=[slug]
```

O passo a passo completo para publicar está em [DEPLOY.md](./DEPLOY.md).

## Setup local

1. Copie `.env.example` para `.env.local`.
2. Preencha as credenciais reais.
3. Instale as dependências.
4. Gere o Prisma Client.
5. Rode as migrações.
6. Crie o primeiro administrador.
7. Inicie o servidor local.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

O seed cria o primeiro usuário administrativo usando:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

## Variáveis de ambiente

As variáveis ficam no `.env.local` localmente e no painel da Vercel em produção.

```env
BASE_DOMAIN=aceleraobra.com.br
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://aceleraobra.com.br
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```

Use um `NEXTAUTH_SECRET` forte. Um exemplo:

```bash
openssl rand -base64 32
```

## Supabase

Crie um projeto no Supabase com PostgreSQL e Storage.

No banco:

```bash
npm run prisma:deploy
npm run seed
```

No Storage:

- Bucket público: `client-logos`
- Tipos aceitos: JPG, PNG e WebP
- Tamanho máximo: 2 MB

A rota `/api/upload` usa `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor. A chave
de service role nunca deve ser exposta no navegador.

## Vercel e domínio

1. Suba o projeto para um repositório Git.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente de produção.
4. Configure o comando de build como `npm run prisma:deploy && npm run build`.
5. Rode o deploy de produção.
6. Adicione o domínio `aceleraobra.com.br`.
7. Adicione o wildcard `*.aceleraobra.com.br`.
8. Configure o DNS:

```text
Apex/root: aceleraobra.com.br -> conforme instrução da Vercel
Wildcard: *.aceleraobra.com.br -> CNAME cname.vercel-dns.com
```

Depois disso, uma loja com slug `fibromax` ficará disponível em:

```text
https://fibromax.aceleraobra.com.br
```

O fluxo real fica assim: o painel roda em `aceleraobra.com.br`, cada loja ganha
um subdomínio próprio, o banco fica no Supabase, as logos ficam no Supabase
Storage e a Vercel entrega a landing page correta conforme o slug.

## Webhook do CRM

Cada loja pode ter uma URL de webhook. Quando o lead preencher o formulário da
LP, o servidor envia um `POST` para essa URL.

Payload enviado:

```json
{
  "event": "lead.created",
  "createdAt": "2026-06-07T18:00:00.000Z",
  "source": "LP AI",
  "pageUrl": "https://loja.aceleraobra.com.br",
  "client": {
    "slug": "loja",
    "storeName": "Nome da loja"
  },
  "lead": {
    "name": "Nome do lead",
    "whatsapp": "5599999999999",
    "message": "Mensagem enviada"
  }
}
```

## Pixels e conversões

No cadastro da loja:

- Pixel da Meta: informe apenas o ID numérico.
- Google Ads: informe `AW-000000000` ou `AW-000000000/label`.

Quando o formulário de lead é enviado com sucesso:

- Meta recebe evento `Lead`.
- Google Ads recebe evento `conversion`.

## Operação do painel

Fluxo recomendado:

1. Acesse `/admin/login`.
2. Cadastre usuários do painel em `/admin/dashboard/users`.
3. Crie uma loja em `/admin/dashboard/clients/new`.
4. Preencha identidade, contato, Google Meu Negócio, endereço, horários,
   produtos, marcas, avaliações, pixels e webhook.
5. Use a prévia para revisar desktop, tablet e mobile.
6. Clique em `Salvar e publicar`.
7. Ative, desative ou exclua LPs pelo dashboard.

## Verificações antes de ir ao ar

```bash
npm run lint
npx tsc --noEmit
npm run prisma:generate
npm run prisma:deploy
npm run seed
```

Teste manual:

- Login do administrador.
- Cadastro de usuário com senha padrão `acelera123`.
- Criação, edição, ativação, desativação e exclusão de LP.
- Upload de logo e marcas.
- Formulário de lead enviando para webhook real.
- Pixel da Meta e Google Ads pelo modo de diagnóstico das plataformas.
- Acesso por subdomínio público.
