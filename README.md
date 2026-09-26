# Helpdesk — Equipe Rocket (AV1)

Integrantes: Geovane Valério Ribeiro da Silva, Heitor Júlio Souza Batista, Lieberty Wendell Queiroz de Holanda, Vanessa Camelo Lins do Nascimento, José Lúfyo César França Camelo e Ananda Almeida Ramos.

Sistema para registrar e acompanhar chamados de suporte.

Nesta entrega os dados ficam **neste navegador** (localStorage). Cada computador tem a sua cópia. A senha também fica só aí, sem criptografia — na AV2 ela passa para o servidor. A API Spring Boot entra na AV2.

## Como abrir

Na pasta do projeto:

```bash
npm install
npm run dev
```

Abra http://localhost:5173

## Contas de exemplo

Senha das duas: `123456`

| Quem | E-mail | O que vê |
| --- | --- | --- |
| Ana Souza | ana@empresa.com | Lista dos chamados que ela abriu |
| Carlos Lima | carlos@empresa.com | Painel para assumir chamados |

Na tela de entrar também dá para clicar nessas contas. O botão **Restaurar dados de exemplo** apaga o que foi cadastrado neste navegador e volta a essas contas.

## O que a AV1 tem

- Login e cadastro (solicitante ou responsável)
- Lista dos chamados de quem está logado
- Painel do responsável, com busca, filtro e botão **Assumir**

## Onde mexer

```
src/paginas        telas
src/componentes    botão, campo, cartão, topo
src/estilos        cores e espaçamento (comece pelo :root)
src/servicos       regras de usuário e chamado
src/dados          gravação no navegador e dados de exemplo
```

As telas não falam com o localStorage. Elas chamam `src/servicos`. Na AV2, a equipe troca o miolo desses serviços por `fetch` na API. As telas podem continuar iguais.

Para ver os dados salvos: DevTools do navegador → Application → Local Storage.

## Fica para a AV2

Tipos de usuário além destes dois, tipos de chamado, anexos, setores, controle de status, chat e assistente virtual.
