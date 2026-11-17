# HelpDesk — Equipe Rocket

Frontend acadêmico para organizar a interface de um sistema de suporte usando React e Vite.

## Estado atual

Esta versão não possui backend nem dados de exemplo. Os formulários de entrada, cadastro, chamados, mensagens e perfil preservam sua apresentação e validações de interface, mas não salvam nem enviam dados. As rotas internas permanecem protegidas e redirecionam para a tela de entrada enquanto não houver autenticação real.

A preferência de tema claro/escuro é a única informação persistida pelo frontend, em `localStorage`. Os artigos da base de conhecimento são conteúdo estático mantido no código, não registros de chamados ou usuários.

## Executar

Na raiz do projeto:

```bash
npm install
npm run dev
```

Para gerar o build de produção:

```bash
npm run build
```

## Organização

```text
src/
├── components/
│   ├── layout/       # Layout e proteção das rotas
│   └── ui/           # Componentes visuais compartilhados
├── features/
│   ├── autenticacao/ # Entrada e cadastro
│   ├── base-conhecimento/
│   ├── chamados/     # Listagem, abertura, fila e conversa
│   ├── dashboard/    # Painel, relatórios e gráficos
│   ├── em-desenvolvimento/
│   └── usuarios/     # Configurações, equipe e solicitantes
├── hooks/            # Hooks globais, como useTitulo
├── services/         # Reservado para futura integração; sem implementação
├── routes/           # Tabela de rotas do React Router
├── styles/           # Estilos globais da interface
├── utils/            # Formatação e utilitários compartilhados
├── App.jsx           # Ponto de entrada da aplicação
└── main.jsx          # Inicialização do React e tema
```

Componentes e páginas específicos ficam na respectiva funcionalidade; elementos reutilizados entre funcionalidades ficam em `components/`. A arquitetura é intencionalmente simples e não introduz uma camada de dados simulada.

> O Git não versiona diretórios vazios. `src/services/` deve ser recriado vazio quando necessário; não adicione arquivos placeholder.

## Próximos passos

A futura integração real deverá introduzir autenticação e operações de dados em uma camada de serviços e conectar as páginas aos resultados reais. Não há cliente HTTP, endpoint ou integração com banco nesta versão. As rotas de aplicação estão preservadas, mas continuam bloqueadas até existir autenticação real.

O `package.json` disponibiliza scripts de desenvolvimento e build; não declara scripts de teste ou lint.
