# Configuração do Webhook da Hotmart

Este guia explica como configurar o webhook da Hotmart para integrar com o sistema de curso de francês, permitindo a criação automática de usuários e envio de credenciais por email após a compra.

## Pré-requisitos

1. Conta ativa na Hotmart
2. Acesso à área de desenvolvedor/integrações da Hotmart
3. Seu site já deve estar hospedado na Vercel ou outro serviço similar

## Configuração das Variáveis de Ambiente

Antes de configurar o webhook, certifique-se de que as seguintes variáveis de ambiente estão configuradas no seu projeto na Vercel (ou no arquivo `.env.local` para desenvolvimento):

### Variáveis do Firebase
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Suas credenciais do Firebase Admin SDK em formato JSON
- `FIREBASE_DATABASE_URL`: URL do seu banco de dados Firebase

### Variáveis do Serviço de Email
- `EMAIL_HOST`: Servidor SMTP (ex: smtp.gmail.com)
- `EMAIL_PORT`: Porta do servidor SMTP (geralmente 587 ou 465)
- `EMAIL_SECURE`: Use 'true' para porta 465, 'false' para outras portas
- `EMAIL_USER`: Seu endereço de email
- `EMAIL_PASSWORD`: Senha do email ou senha de aplicativo (recomendado)
- `EMAIL_FROM`: Email que aparecerá como remetente
- `EMAIL_FROM_NAME`: Nome que aparecerá como remetente

### Outras Variáveis
- `SITE_URL`: URL do seu site (usado nos emails)

## Passos para Configurar o Webhook na Hotmart

1. **Acesse sua conta Hotmart**
   - Faça login na plataforma Hotmart
   - Navegue até o menu "Ferramentas" ou "Desenvolvedor"
   - Selecione a opção "Webhooks" ou "Integrações"

2. **Adicione um novo webhook**
   - Clique em "Adicionar Webhook" ou botão similar
   - Insira a URL do seu webhook: `https://seu-dominio.vercel.app/api/webhook`
   - Substitua "seu-dominio" pelo domínio real do seu site na Vercel

3. **Configure os eventos**
   - Selecione os eventos para os quais deseja receber notificações
   - Para criação de usuários após compra, selecione "Compra Aprovada" ou evento similar
   - Você também pode selecionar outros eventos como "Reembolso" se quiser gerenciar esses casos

4. **Configurações de segurança (opcional)**
   - Algumas plataformas permitem configurar um token de segurança
   - Se disponível, configure e adicione o mesmo token nas suas variáveis de ambiente

5. **Salve as configurações**
   - Clique em "Salvar" ou "Ativar Webhook"

## Testando o Webhook

1. **Teste de compra**
   - Você pode fazer uma compra de teste na Hotmart
   - Verifique se o usuário é criado no Firebase
   - Confirme se o email com as credenciais é enviado

2. **Logs**
   - Verifique os logs na Vercel para identificar possíveis erros
   - Os logs mostrarão informações sobre o processamento do webhook

## Estrutura do Payload da Hotmart

O webhook da Hotmart envia um payload JSON com informações sobre a compra. Os campos principais utilizados são:

```json
{
  "data": {
    "buyer": {
      "email": "email-do-comprador@exemplo.com",
      "name": "Nome do Comprador"
    },
    // outros dados da compra
  }
}
```

O sistema utiliza o email e nome do comprador para criar o usuário no Firebase e enviar as credenciais de acesso.

## Solução de Problemas

- **Webhook não está sendo recebido**: Verifique se a URL está correta e se o servidor está online.
- **Usuário não é criado**: Verifique os logs para identificar erros no processo de criação.
- **Email não é enviado**: Confirme se as configurações de email estão corretas e teste o serviço de email separadamente.

## Segurança

- As senhas geradas são aleatórias e seguras
- Recomenda-se que o usuário altere a senha após o primeiro acesso
- Considere implementar validação adicional para verificar a autenticidade dos webhooks da Hotmart

---

Para mais informações sobre webhooks da Hotmart, consulte a [documentação oficial da Hotmart](https://developers.hotmart.com/docs/pt-BR/webhooks/).