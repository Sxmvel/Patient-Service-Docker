const http = require('http');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // 1. ROTA DE LOGIN: O Gateway recebe o pedido e repassa para o Auth-service
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {

        // nn usa "localhost", usa o NOME do container!
        const respostaAuth = await fetch('http://api-auth:3000/login', {
          method: 'POST',
          body: body,
          headers: { 'Content-Type': 'application/json' }
        });
        const dados = await respostaAuth.json();
        res.statusCode = respostaAuth.status;
        res.end(JSON.stringify(dados));
      } catch (error) {
        res.statusCode = 500; res.end(JSON.stringify({ erro: "Erro ao contatar Auth-service" }));
      }
    });
  }
  
  // 2. ROTA DE PACIENTES: O Gateway exige o "crachá" antes de deixar passar
  else if (req.url === '/paciente' && req.method === 'GET') {
    // O Gateway olha para o cabeçalho "Authorization" para ver se o Token está lá
    const tokenHeader = req.headers['authorization'];

    if (tokenHeader === 'Bearer token-secreto-do-joao-xyz') {
      try {
        // Token validado! O Gateway busca os dados lá no Patient-service
        const respostaPatient = await fetch('http://api-patient:3000/');
        const dados = await respostaPatient.json();
        res.statusCode = 200;
        res.end(JSON.stringify(dados));
      } catch (error) {
        res.statusCode = 500; res.end(JSON.stringify({ erro: "Erro ao contatar Patient-service" }));
      }
    } else {
      // acesso negado por falta de token
      res.statusCode = 401;
      res.end(JSON.stringify({ erro: "Acesso Negado pelo Gateway. Token invalido ou ausente." }));
    }
  }
  else {
    res.statusCode = 404; res.end(JSON.stringify({ erro: "Rota nao encontrada no Gateway" }));
  }
});

const PORT = 4000;
server.listen(PORT, () => console.log(`🚪 API Gateway rodando na porta ${PORT}`));