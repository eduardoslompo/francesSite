// Endpoint para testar a conexão com o webhook

module.exports = async (req, res) => {
  try {
    // Registra a requisição
    console.log('Webhook test endpoint accessed');
    
    // Retorna dados de sucesso
    return res.status(200).json({
      status: 'success',
      message: 'Webhook test endpoint is working correctly',
      timestamp: new Date().toISOString(),
      method: req.method
    });
  } catch (error) {
    console.error('Erro no endpoint de teste:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
}; 