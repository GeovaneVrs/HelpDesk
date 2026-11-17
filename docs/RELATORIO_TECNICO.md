# Relatório técnico — Frontend HelpDesk

## 1. Escopo e estado final

O projeto é um frontend React 19 com Vite 6 e React Router DOM 7. A refatoração organizou os módulos por funcionalidade e removeu os dados fictícios, a sessão simulada, o armazenamento local usado como banco e as operações que imitavam gravações no backend.

Não há integração HTTP nem backend. Os formulários e telas de atendimento continuam representados, com validações de interface e mensagens explícitas de indisponibilidade onde uma ação não pode ser executada. As rotas internas continuam protegidas e redirecionam para `/entrar`, pois ainda não existe autenticação real.

## 2. Estrutura atual

```text
agents/
└── AGENTS.md
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── layout/
│   │   ├── Layout.jsx
│   │   └── RotaProtegida.jsx
│   └── ui/
│       ├── Botao.jsx
│       ├── CampoTexto.jsx
│       ├── EstadoVazio.jsx
│       └── Marca.jsx
├── features/
│   ├── autenticacao/pages/
│   │   ├── Cadastrar.jsx
│   │   └── Entrar.jsx
│   ├── base-conhecimento/pages/
│   │   └── BaseConhecimento.jsx
│   ├── chamados/
│   │   ├── components/
│   │   │   ├── CartaoChamado.jsx
│   │   │   └── HistoricoChamados.jsx
│   │   └── pages/
│   │       ├── Chamados.jsx
│   │       ├── Conversa.jsx
│   │       ├── Fila.jsx
│   │       └── NovoChamado.jsx
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── GraficoRosca.jsx
│   │   │   └── GraficoTempo.jsx
│   │   └── pages/
│   │       ├── Painel.jsx
│   │       └── Relatorios.jsx
│   ├── em-desenvolvimento/pages/
│   │   └── EmDesenvolvimento.jsx
│   └── usuarios/
│       ├── components/CartaoPessoa.jsx
│       └── pages/
│           ├── Configuracoes.jsx
│           ├── Equipe.jsx
│           └── Solicitantes.jsx
├── hooks/useTitulo.js
├── services/             # Diretório reservado; sem arquivos ou implementação
├── routes/AppRoutes.jsx  # Definição das rotas
├── styles/global.css
└── utils/texto.js
```

O Git não armazena diretórios vazios; por isso, `src/services/` existe vazio na cópia de trabalho, mas não aparece como diretório versionado em um clone. Não foi criado arquivo placeholder.

## 3. Arquitetura e fluxo da aplicação

A organização é Feature-Based simplificada:

- `components/ui/` concentra elementos de interface compartilhados.
- `components/layout/` contém o contêiner principal e a proteção de rotas.
- `features/` agrupa páginas e elementos específicos do domínio.
- `hooks/` contém o hook global de título da aba.
- `utils/` concentra funções de formatação compartilhadas.
- `styles/` mantém a folha global já existente.
- `services/` foi reservado para uma futura camada de integração, sem implementação nesta entrega.

`main.jsx` configura `StrictMode` e `BrowserRouter`, importa os estilos globais e restaura a preferência de tema salva. `App.jsx` reexporta a configuração de `routes/AppRoutes.jsx`, que declara as rotas. As rotas públicas são `/entrar` e `/cadastrar`; `/` redireciona para `/entrar`. As rotas da aplicação ficam abaixo de `RotaProtegida` e de `Layout`.

No estado atual, `RotaProtegida` sempre redireciona para `/entrar`. A proteção foi mantida conforme decisão de implementação, mas ainda não verifica identidade ou papel: sem autenticação real, nenhuma rota interna é liberada. Quando a autenticação for implementada, a verificação de sessão e autorização por papel precisará ser feita nessa fronteira.

Rotas internas preservadas:

| Caminho | Página |
|---|---|
| `/chamados` | Lista de chamados |
| `/chamados/novo` | Formulário de novo chamado |
| `/chamados/:id` | Conversa do chamado |
| `/conhecimento` | Base de conhecimento |
| `/configuracoes` | Configurações |
| `/painel` | Painel da equipe |
| `/relatorios` | Relatórios |
| `/equipe` | Equipe |
| `/solicitantes` | Solicitantes |

`Fila.jsx` e `EmDesenvolvimento.jsx` foram mantidos como componentes existentes, mas não possuem rota própria registrada nesta versão. A fila não pode mais ser escolhida pela função do usuário, pois a sessão simulada foi removida.

Fluxo que existe hoje:

```text
main.jsx
  └── BrowserRouter
      └── App.jsx
          └── routes/AppRoutes.jsx
              ├── /entrar e /cadastrar → páginas públicas
              └── demais caminhos → RotaProtegida → redireciona para /entrar
```

Se uma autenticação real for adicionada no futuro, as rotas autorizadas renderizarão `Layout`, que contém o menu e um `Outlet` para a página ativa.

## 4. Componentes e responsabilidades

### Componentes compartilhados

- `Botao.jsx`: renderiza um `<button>` ou, quando recebe `para`, um link do React Router. Recebe também `children`, `variante`, `bloco` e demais propriedades do elemento.
- `CampoTexto.jsx`: compõe rótulo, campo, dica e erro; pode renderizar `input` ou `textarea`. Gera um id acessível com `useId` quando nenhum id é fornecido.
- `EstadoVazio.jsx`: apresenta ilustração, título, texto e ação opcional para listas sem conteúdo.
- `Marca.jsx`: exibe o logotipo e navega para o destino recebido em `para`.

### Layout e rotas

- `Layout.jsx`: compõe barra lateral, links, conteúdo (`Outlet`) e rodapé. Também rola a página ao topo quando o caminho muda e alterna o tema claro/escuro.
- `RotaProtegida.jsx`: bloqueia as rotas internas redirecionando para `/entrar`; ainda não há autenticação ou autorização real.

### Componentes de funcionalidade

- `CartaoChamado.jsx`: cartão visual de chamado. Recebe `titulo`, `descricao`, `status`, `detalhes` e uma `acao` opcional.
- `HistoricoChamados.jsx`: recebe uma lista de chamados, a forma de exibir autoria/responsável e o texto vazio; cada registro pode apontar para a conversa.
- `CartaoPessoa.jsx`: mostra identificação, números, conteúdo adicional e um histórico expansível. Recebe `nome`, `email`, `destaque`, `numeros`, `extra` e `children`.
- `GraficoRosca.jsx`: gráfico SVG de distribuição; recebe `atribuidos` e `semResponsavel`.
- `GraficoTempo.jsx`: barras horizontais; recebe `porResponsavel` e `esperaAtual`.

Os cartões e gráficos continuam no código para preservar os elementos visuais existentes. Sem dados reais, os relatórios não os renderizam e as listagens exibem estados vazios.

## 5. Páginas e formulários

- `Entrar.jsx`: mantém os campos de e-mail e senha, valida preenchimento e informa que a autenticação não está disponível. Não aceita credenciais, cria sessão ou envia dados.
- `Cadastrar.jsx`: mantém os campos e a seleção visual de papel; valida nome, formato do e-mail, tamanho mínimo da senha, confirmação e papel. Não cria conta.
- `Chamados.jsx`: mantém cabeçalho, busca, resumo e ação visual; indica que os chamados estão indisponíveis, em vez de afirmar que a lista está vazia ou exibir contagens fictícias.
- `NovoChamado.jsx`: mantém campos, contadores, dicas e validações de interface (título com ao menos 5 caracteres e descrição com ao menos 10). Não cria nem salva chamados.
- `Conversa.jsx`: mantém o painel e o formulário; não carrega chamado ou mensagens e não envia conteúdo. A validação de mensagem vazia permanece.
- `Fila.jsx`: preserva filtros, busca e estado de lista sem dados; não assume chamados.
- `Painel.jsx`: preserva resumo, filtros e busca, mas mostra valores indisponíveis e não executa operações de atribuição.
- `Relatorios.jsx`: preserva seletor de período, cartões e áreas de gráficos. Métricas e gráficos são indicados como indisponíveis; a seleção de período não calcula dados.
- `Equipe.jsx` e `Solicitantes.jsx`: preservam a estrutura visual de busca, filtros, cartões e métricas, sem ler usuários ou chamados fictícios.
- `Configuracoes.jsx`: mantém a apresentação dos campos pessoais e empresariais. Valida os campos de edição, mas não carrega nem salva um perfil.
- `BaseConhecimento.jsx`: contém artigos editoriais estáticos definidos no próprio módulo, com busca e filtro de categoria. Esses textos não são registros simulados de usuários ou chamados.
- `EmDesenvolvimento.jsx`: componente de apresentação que recebe `titulo` e `texto`; não está associado a uma rota.

## 6. Hooks, contexto e estado

O único hook personalizado global é `useTitulo(titulo)`, em `src/hooks/useTitulo.js`. Ele atualiza `document.title` para `<titulo> · Helpdesk` quando o título muda.

O contexto de sessão foi removido porque dependia exclusivamente das contas armazenadas localmente e dos serviços simulados. Não há contexto global nem biblioteca de gerenciamento de estado. Os estados restantes usam os hooks nativos do React, principalmente `useState` para campos e controles de interface; `useEffect` permanece no layout para rolagem da página.

`src/utils/texto.js` reúne funções puras usadas pela interface: `formatarData` converte uma data para apresentação pt-BR e devolve “Data indisponível” se a data for inválida; `iniciais` extrai até duas iniciais de um nome; `textoResponsavel` descreve se há responsável e qual é; `formatarDuracao` transforma milissegundos em texto curto para os gráficos. Essas funções não acessam dados ou armazenamento.

## 7. Dados, comunicação e persistência

Antes da refatoração, `dados/exemplo.js` fornecia contas, chamados e mensagens fictícios; `dados/armazenamento.js` inicializava e gravava esses dados no `localStorage`; a pasta `servicos/` fazia operações locais de cadastro, login, perfil, chamados, mensagens, pessoas e relatórios. O contexto `Sessao` conectava essas operações às telas.

Esses módulos e as telas de entrada/restauração de contas de exemplo foram removidos. Também foram retirados os comportamentos simulados de cadastro, login, edição de perfil, criação/atribuição de chamado e envio de mensagem.

A única persistência mantida é a preferência de tema (`helpdesk.tema`), lida em `main.jsx` e atualizada por `Layout.jsx`. Nenhuma chamada `fetch`, Axios, cliente HTTP, endpoint ou integração com banco foi adicionada.

Dados antigos eventualmente presentes no `localStorage` sob chaves de usuários, chamados, sessão ou mensagens não são mais lidos pela aplicação. Esta refatoração não apaga essas chaves automaticamente, para evitar uma exclusão silenciosa de dados já existentes no navegador.

## 8. Comunicação entre componentes

As páginas compõem componentes visuais por JSX e passam dados por props. Formulários mantêm seus valores localmente e usam eventos React; links do React Router controlam navegação. Não há event bus, estado global de usuário ou sincronização entre telas depois da remoção do contexto e dos serviços locais.

Enquanto não houver uma fonte de dados real, filtros e buscas permanecem como controles visuais, mas não processam registros. Mensagens informativas evitam apresentar resultado de sucesso para ações que não ocorreram.

## 9. Boas práticas observáveis

- Páginas e componentes específicos ficam agrupados por funcionalidade; elementos reutilizáveis ficam em `components/ui/`.
- Componentes compartilham valores por props e os campos são controlados por estado React local.
- `CampoTexto` conecta rótulos e campos com ids estáveis via `useId`; mensagens de estado usam semântica acessível como `role="status"` e `role="alert"`.
- `useTitulo` concentra um efeito lateral pequeno e reutilizado para atualizar o título do documento.
- Funções de apresentação em `utils/texto.js` são separadas do JSX e não fazem persistência.
- A estrutura permanece sem biblioteca adicional de estado e sem abstração de cliente de dados enquanto não há integração.

## 10. Integração futura e pendências

Uma integração posterior poderá criar módulos reais em `src/services/` para autenticação, perfil, chamados, conversas/mensagens, pessoas e relatórios. As páginas deverão consumir os resultados desses módulos; a proteção de rotas deverá validar sessão e papel usando uma fonte real. Nenhum desses módulos, endpoints, tokens ou mecanismos está implementado atualmente.

Pendências e limitações reais:

1. A autenticação e o cadastro não são operacionais; as rotas internas redirecionam para a tela de entrada.
2. Criação/consulta/atribuição de chamados, mensagens, edição de perfil, listagens e relatórios não têm fonte de dados.
3. `Fila.jsx` e `EmDesenvolvimento.jsx` não estão associados a rotas nesta versão.
4. Componentes de cartões e gráficos são mantidos, mas não recebem registros reais.
5. A preferência de tema permanece no código, embora o controle esteja no layout protegido e não fique acessível até a autenticação ser conectada.
6. O diretório `src/services/` vazio não pode ser preservado em clones pelo Git sem um arquivo, e nenhum arquivo placeholder foi adicionado por requisito.
7. Não há scripts de teste ou lint declarados em `package.json`.
8. A compilação e a renderização visual final não puderam ser verificadas neste ambiente porque o executável `vite` não está instalado; nenhuma dependência foi instalada.

## 11. Histórico dos principais commits

| Commit | Mensagem |
|---|---|
| `51174fd` | `docs: add agent development guidelines` |
| `e8b5695` | `refactor: organize frontend by feature` |
| `3eb5b30` | `refactor: remove mock persistence and operations` |
| `ac4d4cd` | `refactor: isolate route configuration` |
