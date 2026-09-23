# ORVEX — Inteligência que opera.

Site institucional da ORVEX, empresa de transformação em IA e sistemas inteligentes.

Página única, estática, sem build e sem dependências instaláveis: todo o CSS e o
JavaScript estão embutidos no próprio HTML.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `index.html` | O site completo (login/cadastro abrem em modal glassmorphism) |
| `dashboard.html` | Painel pós-login do cliente: KPIs, financeiro, atendimento e automações (dados de demonstração) |
| `admin/` | Painel administrativo interno (SPA estática): Dashboard, CRM, Clientes, Projetos, Serviços, Vendas, Financeiro, Tarefas, Suporte, Analytics, Automações, Arquivos, Equipe e Configurações |
| `README.md` | Este arquivo |

### Painel administrativo (`admin/`)

Aplicação estática em uma pasta, sem build, com roteamento por hash e dados de
demonstração em `admin/data.js` (nenhum dado real). Estrutura:

| Arquivo | Descrição |
|---|---|
| `admin/index.html` | Shell: sidebar, topbar, pesquisa global, notificações, modais |
| `admin/app.css` | Design system completo (tokens, tabelas, kanban, gráficos, responsivo) |
| `admin/data.js` | _Datasets_ fictícios de todos os módulos |
| `admin/app.js` | Guarda de sessão, roteador, componentes (tabelas, gráficos, kanban, modais, toasts) |
| `admin/views.js` | Os 14 módulos do painel |

O acesso exige sessão criada no modal de login do site (`localStorage`); sem
sessão, `admin/` redireciona para `index.html?entrar=1`. A estrutura já é
modular para receber posteriormente banco de dados real, autenticação,
permissões, APIs e integrações externas.

## Rodando localmente

Basta abrir o arquivo no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## O que tem na página

- **Hero** com seção pinada: o notebook abre e o celular liga conforme o scroll.
- **Plataforma** — a linha Dados → Inteligência → Agentes → Automação → Negócio e as cinco camadas.
- **Busca ⌘K** — paleta de comandos que salta para qualquer seção.
- Tema claro/escuro seguindo a preferência do sistema, responsivo e com
  `prefers-reduced-motion` respeitado.

## Publicando

Como é um site estático, o GitHub Pages serve direto:

1. Push do repositório.
2. **Settings → Pages**.
3. Em *Source*, escolha **Deploy from a branch** e selecione `main` / `root`.
4. O site fica em `https://<usuario>.github.io/<repositorio>/`.

## Pontos para revisar antes de publicar

- **Nome da marca**: o site usa *ORVEX*. Está em texto puro no HTML, então a
  troca é uma busca e substituição simples.
- **Login e cadastro**: os botões *Entrar* e *Cadastro* abrem um modal
  glassmorphism no próprio `index.html`. É um protótipo somente de front-end: as
  contas ficam no `localStorage` do navegador (senha guardada como hash SHA-256
  com salt). Troque pelo backend definitivo quando existir.
