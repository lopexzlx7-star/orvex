# ORVEX Platform

Plataforma de automações da ORVEX: cadastro de fluxos, execução via n8n, histórico de execuções e estado real das integrações.

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**
- **Supabase** para autenticação e banco (Postgres com RLS por usuário)
- **n8n** como motor de execução: a plataforma só dispara workflows e registra o resultado

O site institucional estático (`../index.html`, `../dashboard.html`, `../admin/`) continua independente.

## Arquitetura

```
Navegador ──► Next.js (server actions / rotas API) ──► Supabase (auth, automações, execuções)
                       │                    ▲
                       ▼                    │  POST /api/n8n/callback (x-orvex-secret)
                      n8n  ─────────────────┘
Sistemas externos ──► POST /api/hooks/{token} ──► Next.js ──► n8n
```

- Toda chamada ao n8n e ao provedor de IA sai do servidor. Nenhuma chave vai para o navegador.
- Execuções são gravadas apenas com a service role, no servidor. Usuários não conseguem inserir nem alterar execuções diretamente: a RLS e os grants impedem.
- Cada execução tem uma `idempotency_key`, única por automação. Webhooks podem enviar o cabeçalho `Idempotency-Key`; uma repetição devolve a execução existente em vez de rodar de novo.
- Os números do dashboard vêm de consultas reais ao banco. Sem dados, ele mostra estados vazios.

## Rodando localmente

Pré-requisitos: Node 20+ (22 recomendado), Docker e [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
cd platform
npm install
supabase start              # sobe Postgres/Auth locais e aplica supabase/migrations
cp .env.example .env.local  # preencha com a saída de `supabase status`
npm run dev                 # http://localhost:3000
```

n8n local (opcional, para executar fluxos):

```bash
docker run -d --name n8n -p 5678:5678 \
  -e ORVEX_WEBHOOK_SECRET=<mesmo valor de N8N_WEBHOOK_SECRET> \
  -e ORVEX_CALLBACK_SECRET=<mesmo valor de N8N_CALLBACK_SECRET> \
  -e N8N_BLOCK_ENV_ACCESS_IN_NODE=false \
  --add-host=host.docker.internal:host-gateway \
  n8nio/n8n
```

Nesse caso use `APP_URL=http://host.docker.internal:3000` para o n8n alcançar o callback.

## Variáveis de ambiente

| Variável | Onde é usada |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase (sessão do usuário) |
| `SUPABASE_SERVICE_ROLE_KEY` | Somente servidor: grava execuções, recebe webhooks e callbacks |
| `APP_URL` | URL pública da plataforma (URLs de webhook e `callback_url` enviada ao n8n) |
| `N8N_BASE_URL` | URL da instância n8n |
| `N8N_WEBHOOK_SECRET` | Enviado ao n8n no cabeçalho `x-orvex-secret` |
| `N8N_CALLBACK_SECRET` | Exigido no cabeçalho `x-orvex-secret` de `/api/n8n/callback` |
| `N8N_API_KEY` | Opcional, valida a API do n8n na página Integrações |
| `AI_PROVIDER`, `AI_API_KEY`, `AI_BASE_URL` | Teste de conexão do provedor de IA (`openai` ou `anthropic`) |
| `ALLOW_PRIVATE_API_URLS` | `true` só em desenvolvimento, para testar APIs em endereços privados |

## Conectando um workflow do n8n

1. No n8n, crie um workflow com um nó **Webhook** (POST) e ative-o. Importe `n8n/exemplo-sincrono.json` ou `n8n/exemplo-callback.json` como ponto de partida.
2. Na plataforma, informe o *path* desse webhook no campo **Caminho do webhook no n8n** da automação.
3. O n8n recebe:

```json
{
  "execution_id": "uuid",
  "automation_id": "uuid",
  "idempotency_key": "string",
  "trigger": "manual | webhook",
  "wait_for_callback": false,
  "callback_url": "https://.../api/n8n/callback",
  "automation": { "name": "...", "source_app": "...", "actions": [], "config": {} },
  "payload": {}
}
```

O cabeçalho `x-orvex-secret` vem com `N8N_WEBHOOK_SECRET`. Valide-o no workflow.

- **Síncrono** (padrão): o webhook responde no fim (*Respond: When last node finishes*). Uma resposta 2xx marca a execução como sucesso. Qualquer outro status marca como erro.
- **Com callback** (marque *Aguardar callback do n8n*): o webhook responde na hora e o workflow chama `callback_url` ao terminar:

```json
POST /api/n8n/callback
x-orvex-secret: <N8N_CALLBACK_SECRET>
{ "execution_id": "uuid", "status": "success | error", "output": {}, "error": "mensagem opcional" }
```

Callbacks repetidos para uma execução já finalizada são ignorados.

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run lint    # ESLint
```
