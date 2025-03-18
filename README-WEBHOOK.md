# Webhook da Hotmart para Firebase

Este projeto implementa um webhook para receber notificações da Hotmart quando uma compra é realizada. O webhook cria automaticamente um usuário no Firebase Authentication e armazena os dados do comprador no Firestore.

## Funcionalidades

- Recebe webhooks da Hotmart
- Extrai dados do comprador (email, nome)
- Gera uma senha aleatória segura
- Cria um usuário no Firebase Authentication
- Armazena dados detalhados no Firestore
- Configurado para deployment no Vercel

## Pré-requisitos

- Conta no Firebase com Authentication e Firestore configurados
- Conta na Vercel
- Chave de serviço do Firebase (Firebase Admin SDK)
- Configuração de webhook na Hotmart apontando para sua URL

## Instalação Local

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

## Teste Local

Para testar localmente:

1. Configure suas variáveis de ambiente (pode criar um arquivo `.env.local`):
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY='{...seu JSON de credenciais...}'
   FIREBASE_DATABASE_URL='https://seu-projeto.firebaseio.com'
   ```

2. Execute o script de teste:
   ```bash
   node api/test-webhook.js
   ```

## Deploy na Vercel

1. Conecte seu repositório à Vercel

2. Configure as seguintes variáveis de ambiente no projeto da Vercel:
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Cole o JSON da chave de serviço do Firebase (Admin SDK)
   - `FIREBASE_DATABASE_URL`: URL do seu banco de dados Firebase

3. Faça o deploy na Vercel:
   ```bash
   vercel
   ```

4. Ou configure o GitHub para deploy automatizado na Vercel

## Configuração do Webhook na Hotmart

1. Acesse sua conta Hotmart > Ferramentas > Webhooks
2. Adicione um novo webhook
3. Use a URL: `https://sua-url-vercel.vercel.app/api/webhook`
4. Selecione os eventos para os quais deseja receber notificações (geralmente "Compra Aprovada")
5. Salve as configurações

## Estrutura do Projeto

- `api/webhook.js` - Função principal do webhook
- `api/package.json` - Dependências específicas para a API
- `vercel.json` - Configuração de rotas para o Vercel

## Segurança

- A senha gerada é aleatória e segura
- Recomenda-se configurar um mecanismo de reset de senha para o primeiro acesso do usuário
- Considere adicionar validação de origem do webhook (usar HMAC para verificar a autenticidade) 