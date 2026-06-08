# Status da publicação

## Supabase

Projeto criado:

```text
Nome: lp-ai
Project ID: laqntjvmympaxhtjtmck
Região: sa-east-1
URL: https://laqntjvmympaxhtjtmck.supabase.co
```

Banco preparado:

- Migration `initial_schema` aplicada.
- Migration `add_tracking_and_webhook_fields` aplicada.
- Migration `create_client_logos_bucket` aplicada.
- Migration `enable_rls_for_private_tables` aplicada.
- Tabelas criadas: `User`, `Client`, `Review`.
- RLS ativado nas tabelas `User`, `Client` e `Review`.
- Bucket público criado: `client-logos`.

Chave pública recomendada para `NEXT_PUBLIC_SUPABASE_ANON_KEY`:

```text
sb_publishable_zJ5LLRR8L9GN-vr9LGbEKA_0uRNbCq9
```

## Ainda precisa ser feito fora do Codex

1. Criar um repositório no GitHub.
2. Enviar este projeto para o repositório.
3. Criar uma conta ou projeto na Vercel.
4. Importar o repositório na Vercel.
5. Preencher as variáveis de ambiente na Vercel.
6. Copiar do Supabase a `DATABASE_URL` e a `SUPABASE_SERVICE_ROLE_KEY`.
7. Apontar o DNS do domínio na Hostinger.

## Variáveis para usar na Vercel

```env
BASE_DOMAIN=aceleraobra.com.br
DATABASE_URL=cole_a_connection_string_do_supabase
NEXTAUTH_SECRET=gere_um_valor_seguro
NEXTAUTH_URL=https://aceleraobra.com.br
NEXT_PUBLIC_SUPABASE_URL=https://laqntjvmympaxhtjtmck.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zJ5LLRR8L9GN-vr9LGbEKA_0uRNbCq9
SUPABASE_SERVICE_ROLE_KEY=cole_a_service_role_key_do_supabase
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
ADMIN_EMAIL=admin@aceleraobra.com.br
ADMIN_PASSWORD=defina_uma_senha_forte
ADMIN_NAME=AceleraObra Admin
```

## DNS na Hostinger

Depois que o projeto estiver importado na Vercel, adicionar estes domínios na
Vercel:

```text
aceleraobra.com.br
*.aceleraobra.com.br
```

Na Hostinger, ajustar os registros conforme a Vercel indicar. Normalmente fica:

```text
Tipo A      @    76.76.21.21
Tipo CNAME  www  cname.vercel-dns.com
Tipo CNAME  *    cname.vercel-dns.com
```

O registro `*` é o que permite que qualquer LP funcione em:

```text
https://slug-da-loja.aceleraobra.com.br
```

## Segurança

O RLS foi ativado nas tabelas `User`, `Client` e `Review`. Como o app acessa o
banco pelo servidor usando Prisma, essas tabelas não precisam ter políticas de
acesso público pela API do Supabase.
