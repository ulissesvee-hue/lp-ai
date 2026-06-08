# Publicação do LP AI

Este é o caminho para colocar o LP AI no ar e fazer cada landing page publicada
abrir em um subdomínio próprio.

## 1. Criar o Supabase

1. Crie um projeto no Supabase.
2. Copie a connection string do PostgreSQL para `DATABASE_URL`.
3. Copie a URL do projeto para `NEXT_PUBLIC_SUPABASE_URL`.
4. Copie a chave pública para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Copie a service role para `SUPABASE_SERVICE_ROLE_KEY`.
6. No SQL Editor do Supabase, rode o arquivo `supabase/storage.sql`.

O arquivo `supabase/storage.sql` cria o bucket público `client-logos`, usado
para logos das lojas e logos das marcas.

## 2. Criar o projeto na Vercel

1. Suba este projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. A Vercel vai detectar Next.js automaticamente.
4. O arquivo `vercel.json` já configura o build de produção.

Durante o deploy, a Vercel roda:

```bash
npm run production:check
npm run prisma:generate
npm run seed
npm run build
```

Isso valida o ambiente, cria ou atualiza o usuário admin e compila o site.

## 3. Variáveis obrigatórias na Vercel

Cadastre estas variáveis em Settings > Environment Variables:

```env
BASE_DOMAIN=aceleraobra.com.br
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://aceleraobra.com.br
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=admin@aceleraobra.com.br
ADMIN_PASSWORD=troque-esta-senha
ADMIN_NAME=AceleraObra Admin
```

`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` é opcional.

## 4. Configurar domínio e subdomínios

Na Vercel, adicione:

```text
aceleraobra.com.br
*.aceleraobra.com.br
```

No provedor do domínio, configure o DNS conforme a Vercel indicar.

Modelo esperado:

```text
aceleraobra.com.br      -> domínio principal da Vercel
*.aceleraobra.com.br    -> CNAME cname.vercel-dns.com
```

## 5. Como as LPs ficam online

O app é publicado uma única vez.

Quando você cria uma loja no painel com o slug `tintaobraecia`, ela fica
disponível em:

```text
https://tintaobraecia.aceleraobra.com.br
```

Quando você cria uma loja com o slug `fibromax`, ela fica disponível em:

```text
https://fibromax.aceleraobra.com.br
```

Não precisa fazer um deploy novo para cada loja. O sistema lê o subdomínio,
encontra o cliente pelo slug e entrega a LP correspondente.

## 6. Checklist final

- Entrar em `https://aceleraobra.com.br/admin/login`.
- Conferir `https://aceleraobra.com.br/api/health`.
- Criar uma loja real.
- Clicar em `Salvar e publicar`.
- Abrir `https://slug-da-loja.aceleraobra.com.br`.
- Testar WhatsApp.
- Testar formulário de lead com webhook real.
- Conferir Pixel da Meta e Google Ads.
- Conferir upload de logo.
