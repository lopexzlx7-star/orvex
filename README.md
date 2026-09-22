# Operand — Inteligência que opera.

Site institucional da Operand, empresa de transformação em IA e sistemas inteligentes.

Página única, estática, sem build e sem dependências instaláveis: todo o CSS e o
JavaScript estão embutidos no próprio HTML.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `index.html` | O site completo |
| `README.md` | Este arquivo |

## Rodando localmente

Basta abrir o arquivo no navegador, ou servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## O que tem na página

- **Hero** com seção pinada: o notebook abre e o celular liga conforme o scroll.
- **Plataforma** — a linha Dados → Inteligência → Agentes → Automação → Negócio e as cinco camadas.
- **Contato** — formulário com validação visual.
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

- **Nome da marca**: o site usa *Operand*. Está em texto puro no HTML, então a
  troca é uma busca e substituição simples.
- **Login**: o botão *Entrar* aponta para `#`. Troque pela URL real quando existir.
- **E-mail de contato**: `hello@operand.systems` é um placeholder.
- **Formulário**: hoje é só front-end — não envia para nenhum lugar. Para
  funcionar de verdade, aponte o `action` para um backend, serviço de formulário
  ou sistema de tickets.
