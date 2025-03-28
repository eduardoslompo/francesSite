const crypto = require('crypto');
const { admin, initializeFirebaseAdmin } = require('./firebase-admin');
const { sendCredentialsEmail } = require('./email-service');

/**
 * Gera uma senha aleatória segura
 * @param {number} length - Comprimento da senha
 * @returns {string} Senha gerada
 */
function generatePassword(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  
  try {
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytes[i] % chars.length;
      password += chars[randomIndex];
    }
  } catch (error) {
    // Fallback se randomBytes falhar
    console.error('Erro ao usar randomBytes, usando Math.random:', error);
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
  }
  
  return password;
}

module.exports = async (req, res) => {
  // Resposta rápida para verificação de saúde
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Webhook endpoint is healthy' });
  }

  // Prevenção de erros na resposta
  try {
    // Inicializa o Firebase
    const firebaseInitialized = await initializeFirebaseAdmin();
    if (!firebaseInitialized) {
      console.error('Firebase não inicializado');
      return res.status(500).json({ 
        error: 'Erro ao inicializar Firebase',
        message: 'Não foi possível inicializar o serviço Firebase' 
      });
    }

    // Verifica se é uma requisição POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // Verificação rápida para facilitar teste
    if (req.method === 'POST' && req.body && req.body.test === true) {
      return res.status(200).json({ success: true, message: 'Teste de webhook recebido com sucesso' });
    }

    // Validação básica do payload
    if (!req.body) {
      console.error('Payload vazio recebido');
      return res.status(400).json({ error: 'Payload vazio' });
    }

    // Log do payload recebido (com limite de tamanho para o log)
    const payloadString = JSON.stringify(req.body).substring(0, 1000) + 
      (JSON.stringify(req.body).length > 1000 ? '...[truncado]' : '');
    console.log('Webhook recebido da Hotmart:', payloadString);

    // Validar campos essenciais
    if (!req.body.event) {
      console.error('Campo "event" ausente no payload');
      return res.status(400).json({ error: 'Campo "event" ausente no payload' });
    }

    // Validar se é um evento de compra aprovada
    if (req.body.event !== 'PURCHASE_APPROVED') {
      console.log('Evento ignorado:', req.body.event);
      return res.status(200).json({ message: 'Evento ignorado', event: req.body.event });
    }

    // Validar a presença do campo data
    if (!req.body.data) {
      console.error('Campo "data" ausente no payload');
      return res.status(400).json({ error: 'Campo "data" ausente no payload' });
    }

    // Extrair os dados necessários do payload da Hotmart v2.0.0
    const data = req.body.data;
    
    // Validar dados do comprador
    if (!data.buyer) {
      console.error('Dados do comprador ausentes');
      return res.status(400).json({ error: 'Dados do comprador ausentes' });
    }
    
    const buyer = data.buyer;
    const email = buyer.email;
    
    // Obter nome usando diferentes campos possíveis
    let name = '';
    if (buyer.first_name && buyer.last_name) {
      name = `${buyer.first_name} ${buyer.last_name}`.trim();
    } else if (buyer.name) {
      name = buyer.name.trim();
    }

    // Validar dados recebidos
    if (!email) {
      console.error('Email do comprador ausente');
      return res.status(400).json({ error: 'Email do comprador ausente' });
    }

    if (!name) {
      console.log('Nome do comprador ausente, usando email como nome');
      name = email.split('@')[0]; // Usa parte do email como nome
    }

    console.log('Processando compra para:', { email, name });

    // Verificar se o usuário já existe
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log('Usuário já existe:', userRecord.uid);
      return res.status(200).json({ 
        success: true, 
        message: 'Usuário já existe',
        userId: userRecord.uid 
      });
    } catch (error) {
      // Se o usuário não existe, continua com a criação
      if (error.code !== 'auth/user-not-found') {
        console.error('Erro ao verificar se o usuário existe:', error);
        throw error;
      }
      console.log('Usuário não existe, prosseguindo com a criação');
    }

    // Gerar senha aleatória para o novo usuário
    const password = generatePassword();
    console.log('Senha gerada para o novo usuário');

    // Criar o usuário no Firebase Authentication
    let userRecord;
    try {
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
        emailVerified: false
      });
      console.log('Usuário criado com sucesso:', userRecord.uid);
    } catch (error) {
      console.error('Erro ao criar usuário no Firebase Auth:', error);
      return res.status(500).json({
        error: 'Erro ao criar usuário',
        message: error.message
      });
    }

    // Preparar dados extras para transação
    let transactionInfo = {};
    if (data.purchase) {
      try {
        transactionInfo = {
          transaction: data.purchase.transaction || '',
          purchaseDate: data.purchase.approved_date ? new Date(data.purchase.approved_date).toISOString() : new Date().toISOString(),
          status: data.purchase.status || 'APPROVED'
        };

        // Adicionar dados de pagamento se existirem
        if (data.purchase.payment) {
          transactionInfo.paymentType = data.purchase.payment.type || '';
          transactionInfo.installments = data.purchase.payment.installments_number || 1;
        }
      } catch (error) {
        console.error('Erro ao processar dados de transação:', error);
        // Continua com dados básicos
      }
    }

    // Preparar dados do produto
    let productInfo = {};
    if (data.product) {
      try {
        productInfo = {
          productId: data.product.ucode || data.product.id || '',
          productName: data.product.name || 'Curso de Francês'
        };
      } catch (error) {
        console.error('Erro ao processar dados do produto:', error);
        // Continua com dados básicos
      }
    }

    // Preparar dados adicionais para salvar no Firestore
    const userData = {
      uid: userRecord.uid,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'hotmart',
      status: 'active',
      role: 'user',
      planDetails: {
        hotmartData: {
          ...transactionInfo,
          ...productInfo
        }
      }
    };

    // Salvar os dados do usuário no Firestore
    try {
      await admin.firestore().collection('users').doc(userRecord.uid).set(userData);
      console.log('Dados do usuário salvos no Firestore');
    } catch (error) {
      console.error('Erro ao salvar dados no Firestore:', error);
      // Não falha o processo se o Firestore falhar, pois o usuário já foi criado no Auth
    }

    // Enviar e-mail para o usuário com suas credenciais
    let emailSent = false;
    try {
      emailSent = await sendCredentialsEmail(email, name, password);
      console.log('Email com credenciais ' + (emailSent ? 'enviado com sucesso' : 'falhou ao enviar'));
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Não falha o processo se o email falhar, pois o usuário já foi criado
    }

    // Responder com sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Usuário criado com sucesso',
      userId: userRecord.uid,
      emailSent
    });

  } catch (error) {
    // Tratamento final de erros
    console.error('Erro ao processar webhook:', error);
    
    // Tenta enviar uma resposta mais útil para a Hotmart
    try {
      return res.status(500).json({ 
        error: 'Erro ao processar webhook', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } catch (responseError) {
      console.error('Erro ao enviar resposta de erro:', responseError);
      // Tenta enviar uma resposta simples
      return res.status(500).send('Erro interno do servidor');
    }
  }
}