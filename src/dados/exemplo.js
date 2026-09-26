/*
  Dados da primeira visita.
  Senha das duas contas: 123456

  Usuário: id, nome, email, senha, papel, criadoEm
  Chamado: id, titulo, descricao, autorId, autorNome,
            responsavelId, responsavelNome, assumidoEm, status, criadoEm

  papel "solicitante" abre chamados.
  papel "responsavel" atende no painel e não abre chamados.
*/

export const usuariosExemplo = [
  {
    id: 'usuario-ana',
    nome: 'Ana Souza',
    email: 'ana@empresa.com',
    senha: '123456',
    papel: 'solicitante',
    criadoEm: '2026-09-20T09:00:00-03:00',
  },
  {
    id: 'usuario-carlos',
    nome: 'Carlos Lima',
    email: 'carlos@empresa.com',
    senha: '123456',
    papel: 'responsavel',
    criadoEm: '2026-09-20T09:05:00-03:00',
  },
]

export const chamadosExemplo = [
  {
    id: 'chamado-1',
    titulo: 'Computador não liga',
    descricao: 'Aperto o botão e nada acontece. A tomada foi testada em outro equipamento e está funcionando.',
    autorId: 'usuario-ana',
    autorNome: 'Ana Souza',
    responsavelId: null,
    responsavelNome: null,
    status: 'Aberto',
    criadoEm: '2026-09-24T10:15:00-03:00',
  },
  {
    id: 'chamado-2',
    titulo: 'Sem acesso ao e-mail',
    descricao: 'A senha do e-mail corporativo não funciona desde ontem. Já tentei redefinir e a tela só carrega.',
    autorId: 'usuario-ana',
    autorNome: 'Ana Souza',
    responsavelId: 'usuario-carlos',
    responsavelNome: 'Carlos Lima',
    assumidoEm: '2026-09-25T16:10:00-03:00',
    status: 'Aberto',
    criadoEm: '2026-09-25T14:40:00-03:00',
  },
  {
    id: 'chamado-3',
    titulo: 'Impressora do financeiro travou',
    descricao: 'A impressora imprime metade da folha e para. Já reiniciei o equipamento duas vezes.',
    autorId: 'usuario-ana',
    autorNome: 'Ana Souza',
    responsavelId: null,
    responsavelNome: null,
    status: 'Aberto',
    criadoEm: '2026-09-26T09:05:00-03:00',
  },
]

export const mensagensExemplo = [
  {
    id: 'mensagem-1',
    chamadoId: 'chamado-2',
    autorId: 'usuario-ana',
    autorNome: 'Ana Souza',
    texto: 'A tela de redefinição fica carregando e o e-mail novo não chega.',
    criadoEm: '2026-09-25T15:10:00-03:00',
  },
]
