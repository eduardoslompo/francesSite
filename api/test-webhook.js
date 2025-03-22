// Este é um script para testar o webhook localmente
// Execute com: node api/test-webhook.js

// Carregar variáveis de ambiente em desenvolvimento
try {
  // Este módulo só será carregado em ambiente de desenvolvimento
  require('dotenv').config({ path: '../.env.local' });
  console.log('Variáveis de ambiente carregadas com sucesso');
} catch (error) {
  // Em produção (Vercel) as variáveis de ambiente já estarão disponíveis
  console.log('Erro ao carregar variáveis de ambiente:', error.message);
}

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

// Criar um email único para teste
const timestamp = Date.now();
const testEmail = `teste${timestamp}@exemplo.com`;
const testName = `Usuário de Teste ${timestamp}`;

// Endereço de email real para receber o teste (opcional)
const realEmailForTest = process.argv[2] || testEmail;

// Criar objetos simulados de requisição e resposta
const mockReq = {
  method: 'POST',
  body: {
    data: {
      buyer: {
        email: realEmailForTest,
        name: testName
      },
      product: {
        id: '12345',
        name: 'Curso de Francês Premium'
      },
      purchase: {
        transaction: `TRX${timestamp}`,
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
  console.log(`Será enviado um email para: ${realEmailForTest}`);
  try {
    await webhookHandler(mockReq, mockRes);
  } catch (error) {
    console.error('Erro durante o teste:', error);
  }
}

runTest();