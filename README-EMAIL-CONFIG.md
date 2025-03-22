# Configuração do Serviço de Email e Webhook da Hotmart

Este guia explica como configurar o serviço de email para enviar credenciais automáticas após a compra e como configurar o webhook da Hotmart corretamente.

## Configuração do Serviço de Email

1. **Configurar variáveis de ambiente**
   - As variáveis de ambiente para o serviço de email já foram adicionadas ao arquivo `.env.local`
   - Você precisa atualizar os valores com suas credenciais reais:
     ```
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_SECURE=false
     EMAIL_USER=seu-email@gmail.com
     EMAIL_PASSWORD=sua-senha-de-app
     EMAIL_FROM=seu-email@gmail.com
     EMAIL_FROM_NAME=Curso de Francês
     ```

2. **Usando Gmail como serviço de email**
   - Se você estiver usando o Gmail, recomendamos criar uma "Senha de App" em vez de usar sua senha normal
   - Para criar uma senha de app:
     1. Acesse sua conta Google
     2. Vá para Segurança > Verificação em duas etapas (ative se não estiver ativada)
     3. Vá para Senhas de app
     4. Crie uma nova senha para o aplicativo "Outro (nome personalizado)"
     5. Use essa senha gerada no campo `EMAIL_PASSWORD`

3. **Testando o serviço de email**
   - Após configurar as variáveis de ambiente, você pode testar o serviço executando o script de teste do webhook:
   - `node api/test-webhook.js`
   - Verifique se o email é enviado para o endereço de teste

## Configuração do Webhook na Hotmart

Siga os passos abaixo para configurar o webhook na plataforma Hotmart:

1. **Acesse sua conta Hotmart**
   - Faça login na plataforma Hotmart
   - Navegue até o menu "Ferramentas" ou "Desenvolvedor"
   - Selecione a opção "Webhooks" ou "Integrações"

2. **Adicione um novo webhook**
   - Clique em "Adicionar Webhook" ou botão similar
   - Insira a URL do seu webhook: `https://aprenderfrances.vercel.app/api/webhook`
   - Certifique-se de substituir o domínio se você estiver usando um domínio personalizado

3. **Configure os eventos**
   - Selecione o evento "Compra Aprovada" para receber notificações quando uma compra for aprovada
   - Este evento é essencial para a criação automática de usuários

4. **Salve as configurações**
   - Clique em "Salvar" ou "Ativar Webhook"

## Verificando a Integração

Após configurar o serviço de email e o webhook da Hotmart:

1. **Faça uma compra de teste na Hotmart**
   - Use o ambiente de sandbox da Hotmart se disponível
   - Ou faça uma compra real com valor mínimo

2. **Verifique o Firebase**
   - Confirme se o usuário foi criado no Firebase Authentication
   - Verifique se os dados do usuário foram salvos no Firestore

3. **Verifique o email**
   - Confirme se o email com as credenciais foi enviado para o comprador

## Solução de Problemas

- **Erro de credenciais do Firebase**: Se você encontrar erros relacionados às credenciais do Firebase, verifique se a chave de serviço está válida e se o tempo do servidor está sincronizado.

- **Emails não enviados**: Verifique as configurações SMTP, especialmente se você está usando Gmail, certifique-se de que a "Senha de App" está correta e que o acesso a apps menos seguros está permitido (se necessário).

- **Webhook não recebido**: Verifique se a URL do webhook está correta e se o servidor está online. Você pode verificar os logs na Vercel para identificar possíveis erros.

## Próximos Passos

1. Configure as variáveis de ambiente no ambiente de produção (Vercel)
2. Faça testes completos do fluxo de compra
3. Monitore os logs para identificar e corrigir possíveis problemas

---

Para mais informações sobre webhooks da Hotmart, consulte a [documentação oficial da Hotmart](https://developers.hotmart.com/docs/pt-BR/webhooks/).