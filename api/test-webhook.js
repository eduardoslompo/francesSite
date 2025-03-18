// Este é um script para testar o webhook localmente
// Execute com: node api/test-webhook.js

// Simular as variáveis de ambiente
process.env.FIREBASE_SERVICE_ACCOUNT_KEY = JSON.stringify({
  "type": "service_account",
  "project_id": "aprenderfrances-site",
  "private_key_id": "eb1a96f37838d6757bf5cf07844cef21cd1c0f74",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjznxnWlen3/ct\nGUbXuRpyaDoxaN3DMWhdpXH+CHNkJ7t4Kv/rR8GNYf72HRbFqc94arQxfQHt8W0o\nobQ9tt9pzcvRct3P57auip+wbl/Dd3PNwU84TKvh3FZepR9lcERDrbyRnUn6IG2a\nI/F1eAgPYyNVh7h2b5EWS2QzjMTp6tUdnXXnRQs/rDkIXyNtMpPzoz/km5blj4gU\nJaxndt7tiGG0e8ju5AAZI1wbpU3PDovhvz2pxNRTVMz06xBSyPjq5MlhPzO05HBL\no9phsOLasgxnkWwTu0urVccPf2y50aKU7vR701T2P7/+rinpW+U84FtD4vKYIwEx\nmGDrnE7/AgMBAAECggEAD5U0k3ZuMUumjXVCnoH+6JROuOWTdx6roYD8K6DtLUF0\nXZWlm+HLIWKJqSsSQAKL+JYaBz0vok2dx0g+x8IuVbfcpFOrkzwlTkxkrZmKZaNm\n8lNp8F6m2UknNEC8EF/SNqf/8NBIOdG863Vw4m5lQeV59oh/PVEWucq5QQgqsV/c\n+oGl2XnUQzLoyLSUObD/TPT6OzFcoAQ3r1181w/a5mgtjcMdK3lDmr4+LUZHAPyx\nbruTwE01LvK+Jk5COBXrg2cT9BLqFT9dQ/n4ffF0iq2EzkJhIpPxiFB+byic/Hak\nAFs/n9DgIvtgp/vWH9fC0QlU8gzMtYumxdxupLUVMQKBgQDhi6OmFMQyvrD8jWjq\n82JY/c0DoO5ETJr4GTjeJxHRdwfOQ4m3wtXzaW4nPBnydOdxqGglUo8R3ASrp9jY\nJkctoReRrm6jtnFYzBGS2hb3ATAdc8/LPIsyAeADKx6qu6YiTB0DmmTYHzvSZ5oN\n/tvH5k44h6Pw0/ViFd4zoYQiEQKBgQC57LzhyCC7D7SMi9LEPTzxHMsJ0BrNDIKB\nQZCXx+6MuSm2FE2eArVVDrsvL3kdLHafOe9qJAxzuT2l8wa922d4Kne7lTbsVdoT\nB3SyFrQzlEZadg74+0csJlP2Cvlg8KfGtKNgqzWedHIh41no46sZjFsSj9Pi72wK\n/21e3alQDwKBgHDqYdGBz/+/rAekHASUOIZo+bx5Uw/qciMHLYs6cBc3yjafZVEU\nP9yOydDmq+7QTBaAwzL8NBgy2Du/2jXMZBIZ9hy/ATEA45obAClO+fRLKfV0x3Du\nLJmqiqXLbpz3OOMuy8/D+fyhFmft6hhboVhgmoR+k7q7wruKSyX6FJahAoGAGnRZ\n59Je/d7dNMZMZgnEmxYaubm3podqJlQa683R3ooWKkc3SA1gmcqvzaX2mLUT59IJ\ng9O/RdQMtoke43LNhSadxL4Vg4kvr1d3PkPGvjQR0ptLxBeU5+5IMhEbrLRxWu+m\n84FI7tPozXOY/m8ukEMNTlXSs06X0/TGLiJiDfcCgYEAwP9Ey48yrtfJDvRFM9K9\npggGP6FiDMRg0m6TTp3ABRtnymEY6fKcpRgrS3qTvcMbHbFDbHg/rZ+Sa8U1jgtX\n5QI8LAlAJ1W1UFnUbLFrohzMA7DZGEM3ix9koggp526KThYyVcjmHR+gQy41UtpN\nmy7PIoz+yr2wrL0bsF6H5dA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@aprenderfrances-site.iam.gserviceaccount.com",
  "client_id": "104151318863688404864",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40aprenderfrances-site.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
});

process.env.FIREBASE_DATABASE_URL = 'https://aprenderfrances-site.firebaseio.com';

// Importar a função do webhook
const webhookHandler = require('./webhook');

// Criar objetos simulados de requisição e resposta
const mockReq = {
  method: 'POST',
  body: {
    data: {
      buyer: {
        email: 'teste@exemplo.com',
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