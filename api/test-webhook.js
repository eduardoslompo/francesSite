// Este é um script para testar o webhook localmente
// Execute com: node api/test-webhook.js

// Carregar variáveis de ambiente em desenvolvimento
try {
  // Este módulo só será carregado em ambiente de desenvolvimento
  require('dotenv').config({ path: '.env.local' });
  console.log('Variáveis de ambiente carregadas com sucesso');
} catch (error) {
  // Em produção (Vercel) as variáveis de ambiente já estarão disponíveis
  console.log('Erro ao carregar variáveis de ambiente:', error.message);
}

// Importar e inicializar Firebase
const { initializeFirebaseAdmin } = require('./firebase-admin');
console.log('Inicializando Firebase...');
initializeFirebaseAdmin();

// Configurações do serviço de email para teste (caso não estejam no .env.local)
if (!process.env.EMAIL_HOST) {
  process.env.EMAIL_HOST = 'smtp.gmail.com';
  process.env.EMAIL_PORT = '587';
  process.env.EMAIL_SECURE = 'false';
  process.env.EMAIL_USER = 'aprenderfrancesdozero@gmail.com';
  process.env.EMAIL_PASSWORD = 'xhnn wyen wdxf cnjf';
  process.env.EMAIL_FROM = 'aprenderfrancesdozero@gmail.com';
  process.env.EMAIL_FROM_NAME = 'Curso de Francês';
  process.env.SITE_URL = 'https://aprenderfrances.vercel.app';
}

// Importar a função do webhook
const webhookHandler = require('./webhook');

// Criar um timestamp único para o teste
const timestamp = Date.now();
const testEmail = process.argv[2] || `teste${timestamp}@exemplo.com`;

// Payload real da Hotmart v2.0.0
const mockReq = {
  method: 'POST',
  body: {
    "id": `test-${timestamp}`,
    "creation_date": timestamp,
    "event": "PURCHASE_APPROVED",
    "version": "2.0.0",
    "data": {
      "product": {
        "id": 0,
        "ucode": "fb056612-bcc6-4217-9e6d-2a5d1110ac2f",
        "name": "Curso de Francês Premium",
        "has_co_production": false
      },
      "buyer": {
        "email": testEmail,
        "name": "Teste Comprador",
        "first_name": "Teste",
        "last_name": "Comprador",
        "checkout_phone": "99999999900"
      },
      "purchase": {
        "approved_date": timestamp,
        "order_date": timestamp,
        "status": "APPROVED",
        "transaction": `TRX${timestamp}`,
        "payment": {
          "installments_number": 12,
          "type": "CREDIT_CARD"
        }
      }
    },
    "hottok": `test-${timestamp}`
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
  console.log(`Será enviado um email para: ${testEmail}`);
  
  try {
    await webhookHandler(mockReq, mockRes);
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

runTest();