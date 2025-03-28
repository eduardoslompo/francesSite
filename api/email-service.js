const nodemailer = require('nodemailer');

// Configuração do serviço de email
let transporter = null;

/**
 * Inicializa o serviço de email com as configurações fornecidas
 */
function initEmailService() {
  // Verifica se já está inicializado
  if (transporter) return;

  try {
    // Verificar se todas as variáveis necessárias estão disponíveis
    const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
      return false;
    }
    
    // Configuração do serviço de email
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Serviço de email inicializado');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar serviço de email:', error);
    return false;
  }
}

/**
 * Envia email com as credenciais de acesso para o novo usuário
 * @param {string} email Email do usuário
 * @param {string} name Nome do usuário
 * @param {string} password Senha gerada
 * @returns {Promise<boolean>} True se o email foi enviado com sucesso
 */
async function sendCredentialsEmail(email, name, password) {
  try {
    // Inicializa o serviço de email se ainda não estiver inicializado
    const initialized = initEmailService();
    if (!initialized && !transporter) {
      console.error('Serviço de email não inicializado');
      return false;
    }

    // Template do email
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Curso de Francês'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Bem-vindo ao Curso de Francês - Suas Credenciais de Acesso',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2B3A67;">Bem-vindo(a) ao Curso de Francês, ${name}!</h2>
          
          <p>Estamos muito felizes em ter você conosco! Aqui estão suas credenciais de acesso à plataforma:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Senha:</strong> ${password}</p>
          </div>
          
          <p>Para acessar a plataforma, siga estes passos:</p>
          <ol>
            <li>Acesse <a href="${process.env.SITE_URL || 'https://aprenderfrances.vercel.app'}/login">nossa plataforma</a></li>
            <li>Digite seu email e senha</li>
            <li>Clique em "Entrar"</li>
          </ol>
          
          <p>Por segurança, recomendamos que você altere sua senha após o primeiro acesso.</p>
          
          <p>Se tiver alguma dúvida ou precisar de ajuda, não hesite em nos contatar respondendo a este email.</p>
          
          <p>Bons estudos!</p>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px;">
            Este é um email automático. Por favor, não responda diretamente a esta mensagem.
          </p>
        </div>
      `
    };

    // Envia o email com timeout para evitar bloqueio
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao enviar email')), 15000)
      )
    ]);
    
    console.log('Email enviado com sucesso:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

module.exports = {
  sendCredentialsEmail
};