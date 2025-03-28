// Este endpoint é apenas para depuração das variáveis de ambiente
// Cuidado: não inclua informações sensíveis na resposta

module.exports = async (req, res) => {
  try {
    // Apenas para depuração, especialmente na Vercel
    const envInfo = {
      // Info básica
      environment: process.env.NODE_ENV || 'development',
      platform: process.env.VERCEL ? 'vercel' : 'local',
      region: process.env.VERCEL_REGION || 'unknown',
      
      // Variáveis Firebase
      firebase: {
        available: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        serviceAccountKeyLength: process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
          ? process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length 
          : 0,
        databaseUrl: !!process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID || null,
        hasIndividualCredentials: !!(
          process.env.FIREBASE_PROJECT_ID && 
          process.env.FIREBASE_PRIVATE_KEY && 
          process.env.FIREBASE_CLIENT_EMAIL
        )
      },
      
      // Variáveis Email
      email: {
        host: !!process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || null,
        user: process.env.EMAIL_USER ? 
          process.env.EMAIL_USER.substring(0, 3) + '...' + 
          process.env.EMAIL_USER.split('@')[1] : null,
        hasPassword: !!process.env.EMAIL_PASSWORD,
        secure: process.env.EMAIL_SECURE
      },
      
      // Outras variáveis relevantes
      otherVars: {
        siteUrl: process.env.SITE_URL,
        timestamp: new Date().toISOString()
      }
    };
    
    return res.status(200).json(envInfo);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro ao obter informações do ambiente', 
      message: error.message 
    });
  }
}; 