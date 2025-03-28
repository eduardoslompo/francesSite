// Endpoint para diagnóstico do Firebase
const { initializeFirebaseAdmin } = require('./firebase-admin');

module.exports = async (req, res) => {
  try {
    // Informações sobre variáveis de ambiente Firebase
    const firebaseEnv = {
      projectIdExists: !!process.env.FIREBASE_PROJECT_ID,
      privateKeyExists: !!process.env.FIREBASE_PRIVATE_KEY,
      clientEmailExists: !!process.env.FIREBASE_CLIENT_EMAIL,
      serviceAccountKeyExists: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      serviceAccountKeyLength: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length : 0,
      privateKeyFirstChars: process.env.FIREBASE_PRIVATE_KEY ? 
        process.env.FIREBASE_PRIVATE_KEY.substring(0, 20) + '...' : null,
      privateKeyHasCorrectStart: process.env.FIREBASE_PRIVATE_KEY ? 
        process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') : false,
      clientEmailSample: process.env.FIREBASE_CLIENT_EMAIL ? 
        process.env.FIREBASE_CLIENT_EMAIL.substring(0, 10) + '...' : null
    };
    
    // Tenta inicializar o Firebase
    console.log('Tentando inicializar Firebase para diagnóstico...');
    const success = await initializeFirebaseAdmin();
    
    if (success) {
      console.log('Firebase inicializado com sucesso no diagnóstico');
    } else {
      console.log('Falha ao inicializar Firebase no diagnóstico');
    }
    
    // Responde com informações de diagnóstico
    return res.status(200).json({
      firebaseInitialized: success,
      environment: process.env.NODE_ENV,
      firebaseEnv: firebaseEnv,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no diagnóstico do Firebase:', error);
    return res.status(500).json({
      error: 'Erro no diagnóstico do Firebase',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 