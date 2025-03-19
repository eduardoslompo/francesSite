// Este é um script para testar o webhook localmente
// Execute com: node api/test-webhook.js

// Simular as variáveis de ambiente - Modificado para funcionar no PowerShell
const serviceAccountKey = {
  "type": "service_account",
  "project_id": "aprenderfrances-site",
  "private_key_id": "7c82ada3ec7bf612b5c3ec294b275b186fbc139b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTduQ7+TL4knY5\nQdnelRG6MXvdOPw5mI/zdImvKHfUZypbgH9TDUMniSABBHd+vSk6XKwMNIRgX60p\nIRvWN8cgDb9g4hcblvbLNtvCH5J3J2ZmfKUSCq1zJ1vIMCQArQFbWNkDmc390T6Z\nm+L4JDaav+XS1yNjhh33b924qkw65vYmRoh34rZPdpv6myBYxvahGila8roP9vVk\nFwE3pnpnTQFNIgsIHmTWwFsccfPKH4UyaJO/d7NdO/UyEKnwUNKqkns4HpbnYdJf\nFeVRNkN79XeoIGA/IplXB8v7WQ4KBwmCvGtV7A5bqa5QQ8HwPukykhsiWe+MW9DU\nh2FV2381AgMBAAECggEACeYjch5iKFa3S5/7pCyMtR2fOqXHQqYTwpQgVlFNbWVx\nJ5yCoHL+mMfAaB2QagNq4af4QPNYaUS/iLt37gPM3ivRPt92lFkNy9eDBdYeE+S+\nm2pBp35yBUcygNLfM7FXXs7Fmsz91GA8a6AynwLehbrgZ98SHD+UAKZ9ZAzZO5Os\ndxsvSDy7vtjwvSB5tVbg1j8ZsxxQkF8ZYMY1JzybDg5iBSZT7NXkt/zWOfuMAp+n\nPaftob1uEkEYTkKz07/K4x3yFEs5Bn6RgyAIHkuHDaoTvyBp2o8OOE8K65g/O/ho\nGhXBULeP4/2rts14wZnds3BydinulzpXrp5JpOJbRQKBgQDs79U/1IFU6L9WHisy\nIHob9VTE7fMJ+zAJnS8wDu3VsGaIk1nsrEbSgu2Km8os81nJkBveRGr2pIMmoNIR\nwkMmc9xxDJ2oO2nbjqUtMbVffINSlolXiblBb1QBYG5noryzpEI4Ww23S7527YQL\nGKqGEKdJIjnIAHEZPzzEVddZPwKBgQDkeme9FTwz2PD1ahvlid6nrPjrYDZCm+Sx\n1vFo9G495F58qKfdkGGW+SMndULH8lP7HB2AWpgBDWLbsbaUv6/5zBwydpHV8wOi\n9+IJKHFu+S+WF4UO0iumTcCO1UlM2U5j8INtmjZcZyMMEOuRpbrGSTnemvd4636p\n0WlWE3V2iwKBgEi6sdXfEDgVHa58ojvH1lPAsd2lQOY+cZdx5Ws2GfFvLXoc6QyK\nMU8rG2lhuuSjaltB3hwTGlZNV2jDEtiarewewnr9KWPboPnhRnih+o+t882lIdF6\nGCCq4LlvdVRgktX9xMnxwTsTiAqPi+mwD6AJeqArXlszL4RVcfy+cNUXAoGBAKdR\npMrp1C67/qoazNcqQi5VE+17hgD9nVtHZ39PEbStmyx7boNpiq4/QSlSTFeU9T99\n9XTb41lR7kWpPWZtgnfSrAugnWgrEUy1b4j5Xyi/v8OQ8dZKv8CITC3NsGJg+XFi\n3zzSpGDC/v2FHp6I2eEAGysUHYsmGppOS2/HzEvFAoGBANr6c1+yObyGT0SP/STp\nWioOZEHA1f5BRPe1NuIBWf+Cr/NRakEA3+n+0OyRRS2/lFQg2I6kNvacao+sb/k/\nd1fpN+cST2+yNBK/jNHZTsZ1xRfJQ5dmcwCDhfBxwVqvNBRrzixaMVEDLOWbG+9t\nA8JHCrs0Ly/Gx8lD5Mpu7P+1\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@aprenderfrances-site.iam.gserviceaccount.com",
  "client_id": "104151318863688404864",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40aprenderfrances-site.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Atribuir diretamente o objeto em vez de usar JSON.stringify
process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify(serviceAccountKey);
process.env.FIREBASE_DATABASE_URL = 'https://aprenderfrances-site.firebaseio.com';

// Importar a função do webhook
const webhookHandler = require('./webhook');

// Criar objetos simulados de requisição e resposta
const mockReq = {
  method: 'POST',
  body: {
    data: {
      buyer: {
        email: 'teste' + Date.now() + '@exemplo.com',
        name: 'Usuário de Teste'
      },
      product: {
        id: '12345',
        name: 'Curso de Francês Premium'
      },
      purchase: {
        transaction: 'TRX12345',
        status: 'APPROVED'
      }
    }
  }
};

const mockRes = {
  status: (code) => {
    console.log(`Resposta status: ${code}`);
    return {
      json: (data) => {
        console.log('Resposta dados:', JSON.stringify(data, null, 2));
      }
    };
  }
};

// Executar o teste
async function runTest() {
  console.log('Testando webhook com dados:', JSON.stringify(mockReq.body, null, 2));
  try {
    await webhookHandler(mockReq, mockRes);
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

runTest();