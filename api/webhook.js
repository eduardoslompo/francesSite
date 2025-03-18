const admin = require('firebase-admin');
const crypto = require('crypto');

// Carregar variáveis de ambiente em desenvolvimento
try {
  // Este módulo só será carregado em ambiente de desenvolvimento
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  // Em produção (Vercel) as variáveis de ambiente já estarão disponíveis
  console.log('Ambiente de produção ou dotenv não encontrado');
}

// Inicializa o Firebase Admin SDK se ainda não estiver inicializado
let serviceAccount;
try {
  // No ambiente de produção da Vercel, usamos variáveis de ambiente
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
  console.error('Erro ao analisar a credencial do Firebase:', error);
  // Em desenvolvimento, você pode usar um arquivo de chave diretamente
  // serviceAccount = require('../path-to-your-service-account.json');
}

if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    console.log('Firebase Admin SDK inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin SDK:', error);
  }
}

/**
 * Gera uma senha aleatória segura
 * @param {number} length - Comprimento da senha
 * @returns {string} Senha gerada
 */
function generatePassword(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    password += chars[randomIndex];
  }
  
  return password;
}

module.exports = async (req, res) => {
  // Verifica se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Log do payload recebido da Hotmart (omitir em produção para não expor dados sensíveis)
    console.log('Webhook recebido da Hotmart:', JSON.stringify(req.body));

    // Extrair os dados necessários do payload da Hotmart
    // Adapte conforme a estrutura real do webhook da Hotmart
    const data = req.body.data || {};
    const buyer = data.buyer || {};
    const email = buyer.email;
    const name = buyer.name;

    // Validar dados recebidos
    if (!email || !name) {
      console.error('Dados obrigatórios ausentes:', { email, name });
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
    }

    // Gerar senha aleatória para o novo usuário
    const password = generatePassword();

    // Criar o usuário no Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      emailVerified: false
    });

    console.log('Usuário criado com sucesso:', userRecord.uid);

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
        hotmartData: req.body,
        purchaseDate: new Date().toISOString()
      }
    };

    // Salvar os dados do usuário no Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);

    console.log('Dados do usuário salvos no Firestore');

    // Opcionalmente, enviar e-mail para o usuário com suas credenciais
    // Isso geralmente é feito com Firebase Auth Templates ou serviço de e-mail externo

    // Responder com sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Usuário criado com sucesso',
      userId: userRecord.uid 
    });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar webhook', 
      message: error.message
    });
  }
} 