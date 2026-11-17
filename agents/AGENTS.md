# Instruções para agentes de IA

## Arquitetura

- Este projeto utiliza React e Vite.
- A arquitetura de referência é Feature-Based simplificada, adaptada às funcionalidades existentes.
- Componentes compartilhados devem ficar separados dos componentes específicos de cada funcionalidade.
- Cada módulo deve ter responsabilidades bem definidas.
- Não crie abstrações, arquivos ou diretórios sem necessidade real.

## Boas práticas

- Siga as convenções de React, JavaScript e JSX já adotadas no projeto.
- Utilize nomes claros e consistentes.
- Evite duplicação de código e preserve a separação de responsabilidades.
- Mantenha componentes pequenos quando a divisão trouxer benefício real.
- Evite lógica desnecessária dentro do JSX e hooks personalizados sem necessidade.
- Preserve o comportamento e a identidade visual existentes, salvo autorização explícita.

## Restrições

- Não adicione funcionalidades sem autorização.
- Não altere a identidade visual.
- Não instale dependências sem autorização.
- Não implemente integração com backend nesta etapa nem crie serviços ou implementações simuladas.
- Não crie dados fictícios ou mockados.
- Não modifique regras de negócio sem autorização.
- Não exclua componentes visuais apenas porque perderam sua fonte de dados.
- Não crie arquivos vazios desnecessários.
- Não faça push automaticamente.
- Não altere configurações de Git sem necessidade.
- Não inclua credenciais, arquivos sensíveis ou informações privadas em commits.

## Documentação

- Documente as responsabilidades dos módulos e as props relevantes quando isso ajudar a manutenção.
- Explique hooks personalizados, lógicas complexas e decisões que não sejam evidentes no código.
- Evite comentários redundantes que apenas repetem o que o código já expressa.
- Atualize a documentação quando mudanças importantes alterarem o funcionamento ou a organização.

## Git

- Registre o progresso em commits pequenos, coerentes e descritivos.
- Utilize mensagens Conventional Commits.
- Separe alterações por responsabilidade ou funcionalidade.
- Antes de cada commit, confira os arquivos incluídos e execute as validações pertinentes.
- Não inclua em commits alterações preexistentes que não pertençam à tarefa.
