# Relatório técnico — Integração do frontend HelpDesk

## Escopo

O frontend React 19/Vite 6 usa React Router DOM 7 e consome a API REST do HelpDesk. A API fica em `http://localhost:8080` por padrão; `VITE_API_URL` permite definir outro host. O cliente acrescenta `/api` ao endereço configurado.

## Camada de serviços

- `src/services/api.js`: cliente `fetch`, JSON, token Bearer, erro HTTP tipado, respostas HTTP 204 e invalidação local de sessão em HTTP 401.
- `src/services/autenticacao.js`: entrada, sessão atual, saída e cadastro.
- `src/services/usuarios.js`: consulta, cadastro público, perfil, senha, papel e ativação.
- `src/services/departamentos.js`: consulta, cadastro, atualização e ativação/desativação.
- `src/services/chamados.js`: listagem por escopo, CRUD, atribuição, status, histórico e comentários.
- `src/services/solicitacoesTecnico.js`: consulta, solicitação, aprovação e rejeição.

O token e o usuário autenticado são salvos em `localStorage` (`helpdesk.token` e `helpdesk.usuario`). Ao iniciar, a aplicação valida a sessão por `/auth/me`. Respostas 401 limpam as credenciais e retornam a aplicação ao estado não autenticado.

## Autenticação e autorização

`ProvedorAutenticacao` centraliza login, logout, hidratação e atualização do usuário. `RotaProtegida` aguarda a validação da sessão e restringe páginas por `role`. O cadastro público cria solicitantes (`USER`); não oferece seleção de papel privilegiado. A API continua sendo a autoridade final de autorização.

## Funcionalidades conectadas

| Perfil | Páginas e operações |
|---|---|
| `USER` | Cadastro, login, listagem dos próprios chamados, abertura, conversa/comentários, perfil, alteração de senha e solicitação para se tornar técnico |
| `TECHNICIAN` | Fila de chamados, detalhes, comentários, alteração de status e técnico responsável, painel, relatórios calculados, equipe e solicitantes |
| `ADMIN` | Funcionalidades de equipe, gestão de usuários e departamentos e aprovação/rejeição de solicitações técnicas |

A base de conhecimento contém conteúdo estático editorial. Não há endpoint de relatórios: as métricas são calculadas no frontend usando os chamados retornados pela API e o período selecionado. Métricas que exigiriam dados não fornecidos pela API, como tempo médio de resposta, não são inventadas.

## Estrutura

```text
src/
├── components/       # Layout, proteção e UI compartilhada
├── contexto/         # Autenticação global
├── features/
│   ├── autenticacao/
│   ├── chamados/
│   ├── dashboard/
│   └── usuarios/
├── hooks/            # Título e carregamento de recursos
├── routes/           # Tabela de rotas e limites de papel
├── services/         # HTTP e integração por recurso
├── styles/
└── utils/
```

## Rotas principais

| Caminho | Acesso | Conteúdo |
|---|---|---|
| `/entrar`, `/cadastrar` | Público | Sessão e cadastro de solicitante |
| `/chamados`, `/chamados/:id` | Autenticado | Lista adequada ao papel e detalhe/conversa |
| `/chamados/novo` | `USER` | Criação de chamado |
| `/painel`, `/relatorios`, `/equipe`, `/solicitantes` | `TECHNICIAN`, `ADMIN` | Operação da equipe e métricas |
| `/solicitacoes-tecnico` | Autenticado | Solicitação pessoal ou análise administrativa |
| `/admin/usuarios`, `/admin/departamentos` | `ADMIN` | Administração de contas e departamentos |
| `/configuracoes`, `/alterar-senha`, `/conhecimento` | Autenticado | Perfil, senha e conteúdo de ajuda |

## Validação

O projeto oferece `npm run build`; não há scripts de teste ou lint declarados em `package.json`. Para validar a integração ponta a ponta, a API deve estar disponível no endereço configurado e as chamadas devem usar uma conta de cada papel.
