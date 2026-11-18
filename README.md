# HelpDesk — Equipe Rocket

Frontend acadêmico para atendimento de suporte, construído com React 19, Vite 6 e React Router DOM 7. A aplicação consome a API REST do HelpDesk.

## Requisitos

- Node.js e npm compatíveis com Vite 6
- API HelpDesk em execução (por padrão, `http://localhost:8080`)

## Executar

```bash
npm install
npm run dev
```

No desenvolvimento, as requisições `/api` são encaminhadas pelo proxy do Vite para `http://localhost:8080`, evitando problemas de CORS entre `localhost` e `127.0.0.1`. Para usar outra instância, configure `VITE_API_URL` no ambiente; o cliente acrescenta `/api`.

```bash
npm run build
```

## Integração

O cliente HTTP compartilhado em `src/services/api.js` envia o token Bearer, trata erros HTTP e limpa a sessão quando a API responde com HTTP 401. Os módulos em `src/services/` encapsulam autenticação, usuários, departamentos, chamados e solicitações para acesso técnico.

| Perfil | Funcionalidades conectadas |
|---|---|
| Solicitante (`USER`) | Cadastro, login, perfil, senha, abertura e acompanhamento dos próprios chamados, comentários e solicitação para se tornar técnico |
| Técnico (`TECHNICIAN`) | Fila e detalhes dos chamados, alteração de status, atribuição, painel, relatórios derivados, equipe e solicitantes |
| Administrador (`ADMIN`) | Funcionalidades da equipe, gerenciamento de usuários e departamentos e decisão sobre solicitações técnicas |

O cadastro público cria somente contas `USER`; papéis administrativos e técnicos são controlados pelas rotas protegidas e pela API. A base de conhecimento continua sendo conteúdo editorial estático. Os relatórios são calculados a partir dos chamados retornados pela API; não há endpoint de relatórios documentado.

## Contas de demonstração

No perfil `dev`, quando o seed inicializa um banco vazio, estão disponíveis estas contas:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador (`ADMIN`) | `admin@helpdesk.com` | `123456` |
| Técnico (`TECHNICIAN`) | `carlos.tecnico@helpdesk.com` | `123456` |
| Técnico (`TECHNICIAN`) | `mariana.tecnica@helpdesk.com` | `123456` |

Essas credenciais são **somente para desenvolvimento local**. O seed não substitui usuários de um banco já populado; não use essas senhas em produção. O README do backend contém detalhes sobre o seed e os demais usuários de teste.

Os dados de perfil e autenticação são mantidos em `localStorage` nas chaves `helpdesk.token` e `helpdesk.usuario`. A preferência de tema usa `helpdesk.tema`. Uma sessão persistida é validada novamente em `/auth/me` ao iniciar a aplicação.

## Organização

```text
src/
├── components/     # Layout e elementos visuais compartilhados
├── contexto/       # Estado global de autenticação
├── features/       # Páginas e componentes por funcionalidade
├── hooks/          # Hooks reutilizáveis
├── routes/         # Rotas e controle de acesso
├── services/       # Cliente HTTP e módulos da API
├── styles/         # Estilos globais
└── utils/          # Formatação e utilitários
```

O `package.json` disponibiliza scripts de desenvolvimento e build; não declara scripts de teste ou lint.
