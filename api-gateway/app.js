const http = require('http');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // 1. ROTA DE LOGIN
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const respostaAuth = await fetch('http://api-auth:3000/login', {
          method: 'POST', body: body, headers: { 'Content-Type': 'application/json' }
        });
        const dados = await respostaAuth.json();
        res.statusCode = respostaAuth.status; res.end(JSON.stringify(dados));
      } catch (error) {
        res.statusCode = 500; res.end(JSON.stringify({ erro: "Erro no Auth-service" }));
      }
    });
  }

  // 2. BUSCAR PACIENTES (GET)
  else if (req.url === '/paciente' && req.method === 'GET') {
    const tokenHeader = req.headers['authorization'];
    if (tokenHeader === 'Bearer token-secreto-do-joao-xyz') {
      try {
        const respostaPatient = await fetch('http://meu-patient:3000/', {
          headers: { 'Connection': 'close' } 
        });
        const dados = await respostaPatient.json();
        res.statusCode = 200; res.end(JSON.stringify(dados));
      } catch (error) {
        res.statusCode = 500; res.end(JSON.stringify({ erro: "Erro no Patient-service" }));
      }
    } else {
      res.statusCode = 401; res.end(JSON.stringify({ erro: "Acesso Negado." }));
    }
  }

  // 3. NOVA ROTA: CADASTRAR PACIENTE (POST)
  else if (req.url === '/paciente' && req.method === 'POST') {
    const tokenHeader = req.headers['authorization'];

    // 1º Passo: Exige o crachá!
    if (tokenHeader === 'Bearer token-secreto-do-joao-xyz') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });

      req.on('end', async () => {
        try {
          // 2º Passo: O crachá é válido. Manda os dados para o Patient-service!
          const respostaPatient = await fetch('http://meu-patient:3000/', {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/json' }
          });
          const dados = await respostaPatient.json();
          res.statusCode = respostaPatient.status;
          res.end(JSON.stringify(dados));
        } catch (error) {
          res.statusCode = 500; res.end(JSON.stringify({ erro: "Erro no Patient-service" }));
        }
      });
    } else {
      res.statusCode = 401; res.end(JSON.stringify({ erro: "Acesso Negado para cadastro." }));
    }
  }

  else {
    res.statusCode = 404; res.end(JSON.stringify({ erro: "Rota nao encontrada" }));
  }
});

const PORT = 4000;
server.listen(PORT, () => console.log(`🚪 API Gateway rodando na porta ${PORT}`));