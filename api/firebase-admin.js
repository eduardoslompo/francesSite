const admin = require('firebase-admin');

// Verificar se o Firebase já está inicializado
let firebaseInitialized = false;

/**
 * Corrige a chave privada, garantindo que ela tenha o formato correto
 * @param {string} key - Chave privada
 * @returns {string} - Chave privada corrigida
 */
function sanitizePrivateKey(key) {
  if (!key) return key;
  
  // Se não tiver os delimitadores, provavelmente está com escape
  if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
    // Tenta converter escapes \n para quebras de linha reais
    key = key.replace(/\\n/g, '\n');
  }
  
  // Verifica se após o processamento temos delimitadores
  if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
    // Tenta adicionar os delimitadores
    key = '-----BEGIN PRIVATE KEY-----\n' + key.replace(/-----.*?-----/g, '').trim() + '\n-----END PRIVATE KEY-----\n';
  }
  
  return key;
}

/**
 * Inicializa o Firebase Admin SDK
 * @returns {boolean} Sucesso da inicialização
 */
function initializeFirebaseAdmin() {
  // Se já foi inicializado, retorna
  if (firebaseInitialized || admin.apps.length > 0) {
    console.log('Firebase já inicializado');
    return true;
  }
  
  try {
    console.log('Tentando inicializar Firebase...');
    
    // TENTATIVA 1: Usar credenciais individuais (mais confiável)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      try {
        console.log('Tentando inicializar com credenciais individuais...');
        
        // Sanitiza a chave privada para garantir formatação correta
        const privateKey = sanitizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        
        const firebaseConfig = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
          private_key: privateKey,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID || "",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || ""
        };
        
        // Log para debug
        console.log('Configuração Firebase (credenciais individuais):', {
          projectId: firebaseConfig.project_id,
          email: firebaseConfig.client_email,
          privateKeyStart: firebaseConfig.private_key.substring(0, 20) + '...',
          privateKeyHasDelimiters: firebaseConfig.private_key.includes('-----BEGIN PRIVATE KEY-----')
        });
        
        // Inicializa com as credenciais
        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
        
        firebaseInitialized = true;
        console.log('Firebase inicializado com credenciais individuais');
        return true;
      } catch (error) {
        console.error('Erro ao inicializar com credenciais individuais:', error);
        console.log('Tentando método alternativo...');
        // Continua para próxima tentativa
      }
    }
    
    // TENTATIVA 2: Usar arquivo local
    try {
      const fs = require('fs');
      const path = require('path');
      const keyPath = path.resolve(process.cwd(), 'firebase-key.json');
      
      if (fs.existsSync(keyPath)) {
        console.log('Tentando carregar credenciais do arquivo local firebase-key.json');
        const serviceAccountFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountFile),
          databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://aprenderfrances-site.firebaseio.com'
        });
        
        firebaseInitialized = true;
        console.log('Firebase inicializado com credenciais do arquivo local');
        return true;
      }
    } catch (fileError) {
      console.error('Erro ao carregar do arquivo:', fileError);
      // Continua para próxima tentativa
    }
    
    // TENTATIVA 3: Usar JSON completo da variável de ambiente
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountEnv) {
      try {
        console.log('Tentando carregar do JSON completo...');
        let serviceAccount;
        
        // Tenta parse direto
        try {
          serviceAccount = JSON.parse(serviceAccountEnv);
        } catch (e) {
          console.log('Parse direto falhou, tentando limpar JSON...');
          
          // Tenta limpar o JSON
          const cleanedJson = serviceAccountEnv
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
            
          try {
            serviceAccount = JSON.parse(cleanedJson);
          } catch (e2) {
            console.log('Limpeza básica falhou, tentando remover escapes...');
            
            // Terceira tentativa: remover escapes
            const unescapedJson = serviceAccountEnv
              .replace(/\\\\/g, "\\")
              .replace(/\\"/g, '"');
              
            serviceAccount = JSON.parse(unescapedJson);
          }
        }
        
        // Se serviceAccount.private_key existe, verifica e sanitiza
        if (serviceAccount.private_key) {
          serviceAccount.private_key = sanitizePrivateKey(serviceAccount.private_key);
        }
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://aprenderfrances-site.firebaseio.com'
        });
        
        firebaseInitialized = true;
        console.log('Firebase inicializado com sucesso usando JSON completo');
        return true;
      } catch (jsonError) {
        console.error('Todos os métodos de parsing falharam:', jsonError);
        throw new Error('Não foi possível parsear as credenciais do Firebase: ' + jsonError.message);
      }
    }
    
    // Se chegou aqui, nenhuma tentativa funcionou
    throw new Error('Credenciais do Firebase não disponíveis após todas as tentativas');
  } catch (error) {
    console.error('Erro na inicialização do Firebase:', error);
    return false;
  }
}

module.exports = {
  admin,
  initializeFirebaseAdmin
}; 