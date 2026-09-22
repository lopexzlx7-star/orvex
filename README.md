# ORVEX — Inteligência que opera.

Site institucional da ORVEX, empresa de transformação em IA e sistemas inteligentes.

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
- **Login e cadastro**: os botões *Entrar* e *Cadastro* apontam para `#`. Troque
  pelos destinos reais quando existirem.
