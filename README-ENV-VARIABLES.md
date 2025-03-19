# Gerenciamento Seguro de Variáveis de Ambiente

## Visão Geral

Este documento fornece orientações sobre como gerenciar variáveis de ambiente de forma segura no projeto. As variáveis de ambiente são usadas para armazenar informações sensíveis como chaves de API, credenciais de banco de dados e outras configurações que não devem ser expostas publicamente ou incluídas no controle de versão.

## Arquivos de Ambiente

O projeto usa os seguintes arquivos de ambiente:

- `.env.example` - Um modelo com exemplos de variáveis necessárias (sem valores reais)
- `.env.local` - Variáveis para desenvolvimento local
- `.env.development.local` - Variáveis específicas para ambiente de desenvolvimento
- `.env.test.local` - Variáveis específicas para ambiente de teste
- `.env.production.local` - Variáveis específicas para ambiente de produção

## Práticas Recomendadas

### 1. Nunca Comitar Arquivos de Ambiente

Todos os arquivos `.env.*` (exceto `.env.example`) estão incluídos no `.gitignore` e **nunca** devem ser adicionados ao repositório Git. Isso evita que informações sensíveis sejam expostas publicamente.

### 2. Usar .env.example como Modelo

O arquivo `.env.example` serve como um modelo e documentação para as variáveis de ambiente necessárias. Ele deve:

- Listar todas as variáveis de ambiente necessárias
- Incluir comentários explicando o propósito de cada variável
- Nunca conter valores reais ou sensíveis

### 3. Configuração para Novos Desenvolvedores

Ao configurar o projeto pela primeira vez:

1. Copie o arquivo `.env.example` para `.env.local`
2. Preencha `.env.local` com os valores reais necessários

```bash
cp .env.example .env.local
# Edite .env.local com seus valores reais
```

### 4. Verificação de Segurança

Antes de fazer commit de alterações, verifique se nenhum arquivo de ambiente está sendo incluído acidentalmente:

```bash
git status
```

### 5. O que Fazer se Credenciais Forem Expostas

Se credenciais sensíveis forem acidentalmente expostas no repositório:

1. Revogue imediatamente as credenciais expostas (altere senhas, regenere chaves de API, etc.)
2. Não tente apenas remover as credenciais com um novo commit, pois elas permanecerão no histórico do Git
3. Consulte um administrador do sistema para obter orientação sobre como limpar o histórico do Git, se necessário

## Variáveis de Ambiente em Ambientes de Produção

Para ambientes de produção (como Vercel, Firebase, etc.), configure as variáveis de ambiente através do painel de controle do serviço de hospedagem, não através de arquivos no repositório.

## Verificação de Configuração

O projeto inclui verificações para garantir que todas as variáveis de ambiente necessárias estejam definidas. Se estiver faltando alguma variável, você verá um erro ao iniciar o aplicativo.