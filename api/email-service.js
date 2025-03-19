const nodemailer = require('nodemailer');

// Configuração do serviço de email
let transporter = null;

/**
 * Inicializa o serviço de email com as configurações fornecidas
 */
function initEmailService() {
  // Verifica se já está inicializado
  if (transporter) return;

  // Configuração do serviço de email
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  console.log('Serviço de email inicializado');
}

/**
 * Envia email com as credenciais de acesso para o usuário
 * @param {string} email - Email do destinatário
 * @param {string} name - Nome do destinatário
 * @param {string} password - Senha gerada para o usuário
 * @returns {Promise<boolean>} - Retorna true se o email foi enviado com sucesso
 */
async function sendCredentialsEmail(email, name, password) {
  try {
    // Inicializa o serviço de email se ainda não estiver inicializado
    initEmailService();
    
    // Verifica se o serviço de email está configurado
    if (!transporter) {
      console.error('Serviço de email não configurado');
      return false;
    }

    // Conteúdo do email
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Curso de Francês'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Suas credenciais de acesso ao curso de francês',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333;">Bem-vindo(a), ${name}!</h2>
          <p>Obrigado por adquirir nosso curso de francês. Abaixo estão suas credenciais de acesso à plataforma:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Senha:</strong> ${password}</p>
          </div>
          
          <p>Para acessar o curso, visite <a href="${process.env.SITE_URL || 'https://frances-site.vercel.app'}">nossa plataforma</a> e faça login com as credenciais acima.</p>
          
          <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
          
          <p>Se tiver alguma dúvida, responda a este email ou entre em contato conosco.</p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #777;">Atenciosamente,<br>Equipe do Curso de Francês</p>
        </div>
      `
    };

    // Envia o email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

module.exports = {
  initEmailService,
  sendCredentialsEmail
};