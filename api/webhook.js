const admin = require('firebase-admin');
const crypto = require('crypto');
const { sendCredentialsEmail } = require('./email-service');

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

// Função para limpar a string JSON antes de fazer o parse
function cleanJsonString(jsonString) {
  if (typeof jsonString !== 'string') {
    return null;
  }
  
  // Remove espaços extras, quebras de linha e outros caracteres que possam causar problemas
  // Verifica se o JSON começa com uma chave aberta
  if (jsonString.trim().startsWith('{')) {
    return jsonString.trim();
  } else {
    // Se não começar com chave, pode ser um JSON com quebras de linha
    // Tenta remover quebras de linha e espaços extras
    try {
      // Converte para um objeto e depois de volta para string para normalizar
      return JSON.stringify(JSON.parse(jsonString));
    } catch (e) {
      console.error('Erro ao tentar limpar a string JSON:', e);
      return jsonString.trim();
    }
  }
}

// Tenta carregar a chave de serviço
try {
  // Tenta carregar do arquivo first
  const fs = require('fs');
  const path = require('path');
  const keyPath = path.resolve(process.cwd(), 'firebase-key.json');
  
  if (fs.existsSync(keyPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log('Credenciais do Firebase carregadas do arquivo firebase-key.json');
  } 
  // Se não conseguir do arquivo, tenta da variável de ambiente
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      console.log('Credenciais do Firebase carregadas da variável de ambiente');
    } catch (e) {
      console.error('Erro ao analisar a credencial do Firebase da variável de ambiente:', e);
      throw e;
    }
  } else {
    throw new Error('Credenciais do Firebase não disponíveis');
  }
} catch (error) {
  console.error('Erro ao carregar credenciais do Firebase:', error);
  throw new Error('Não foi possível carregar as credenciais do Firebase: ' + error.message);
}

if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://aprenderfrances-site.firebaseio.com'
    });
    console.log('Firebase Admin SDK inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin SDK:', error);
    throw error; // Propaga o erro para que seja tratado adequadamente
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

    // Enviar e-mail para o usuário com suas credenciais
    const emailSent = await sendCredentialsEmail(email, name, password);
    console.log('Email com credenciais ' + (emailSent ? 'enviado com sucesso' : 'falhou ao enviar'));

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