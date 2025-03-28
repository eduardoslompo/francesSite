const admin = require('firebase-admin');

// Verificar se o Firebase já está inicializado
let firebaseInitialized = false;

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
    
    // Tenta obter credenciais da variável de ambiente
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    // Verifica se as credenciais estão presentes
    if (!serviceAccountEnv) {
      console.error('FIREBASE_SERVICE_ACCOUNT_KEY não está definida');
      
      // Tenta carregar do arquivo local como fallback
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
        } else {
          throw new Error('Arquivo de credenciais local não encontrado');
        }
      } catch (fileError) {
        console.error('Erro ao carregar do arquivo:', fileError);
        throw new Error('Credenciais do Firebase não disponíveis');
      }
    }
    
    // Tenta usar credenciais diretamente (para Vercel)
    try {
      // Cria um objeto de credenciais manualmente para o caso da Vercel
      const firebaseServiceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID || "aprenderfrances-site",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
        private_key: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL || "",
        client_id: process.env.FIREBASE_CLIENT_ID || "",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || ""
      };

      console.log('Verificando credenciais principais...');
      if (!firebaseServiceAccount.private_key || !firebaseServiceAccount.client_email) {
        console.log('Credenciais individuais não encontradas, tentando JSON completo...');
        
        // Tenta parsear o JSON da variável de ambiente
        try {
          // Tenta fazer parse do JSON com diferentes métodos
          let serviceAccount;
          
          // Método 1: Parse direto
          try {
            serviceAccount = JSON.parse(serviceAccountEnv);
          } catch (e) {
            console.log('Método 1 falhou, tentando método 2...');
            
            // Método 2: Limpeza básica e então parse
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
              console.log('Método 2 falhou, tentando método 3...');
              
              // Método 3: Assume que é uma string já escapada pelo sistema
              const unescapedJson = serviceAccountEnv
                .replace(/\\\\/g, "\\")
                .replace(/\\"/g, '"');
                
              try {
                serviceAccount = JSON.parse(unescapedJson);
              } catch (e3) {
                console.error('Todos os métodos de parse falharam.');
                throw new Error('Não foi possível parsear as credenciais do Firebase');
              }
            }
          }
          
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://aprenderfrances-site.firebaseio.com'
          });
          
          firebaseInitialized = true;
          console.log('Firebase inicializado com sucesso usando JSON completo');
          return true;
        } catch (jsonError) {
          console.error('Erro ao parsear JSON de credenciais:', jsonError);
          throw jsonError;
        }
      } else {
        // Usa as credenciais individuais
        admin.initializeApp({
          credential: admin.credential.cert(firebaseServiceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://aprenderfrances-site.firebaseio.com'
        });
        
        firebaseInitialized = true;
        console.log('Firebase inicializado com credenciais individuais');
        return true;
      }
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro na inicialização do Firebase:', error);
    return false;
  }
}

module.exports = {
  admin,
  initializeFirebaseAdmin
}; 