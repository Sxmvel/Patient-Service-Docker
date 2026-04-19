const http = require('http');
const { Pool } = require('pg');
const os = require('os');

// 1. Configurando a conexão com o banco de dados
const pool = new Pool({
  connectionString: 'postgresql://admin:senha_super_secreta@meu-banco-dados:5432/clinica_db'
});

// 2. Função que prepara o banco quando o serviço liga
async function inicializarBanco() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        idade INT,
        exame VARCHAR(100),
        status VARCHAR(50)
      );
    `);
    
    const { rows } = await pool.query('SELECT * FROM pacientes');
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO pacientes (nome, idade, exame, status) 
        VALUES ('João da Silva', 35, 'Raio-X do Tórax', 'Normal')
      `);
      console.log('📦 Dados iniciais inseridos no banco com sucesso!');
    }
  } catch (erro) {
    console.error('❌ Erro ao conectar no banco:', erro);
  }
}

inicializarBanco();

// 3. O servidor que escuta os pedidos do Gateway
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // ROTA 1: Ler os dados (GET)
 if (req.method === 'GET') {
    try {
      const resultado = await pool.query('SELECT * FROM pacientes');
      res.statusCode = 200;
      
      // Vamos embrulhar a resposta para mostrar QUAL container atendeu!
      res.end(JSON.stringify({
        atendido_pelo_container: os.hostname(), 
        pacientes: resultado.rows
      }));
      
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ erro: "Erro interno ao buscar dados no banco." }));
    }
  } 
  
  // ROTA 2: Cadastrar novo paciente (POST)
  else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    
    req.on('end', async () => {
      try {
        const novoPaciente = JSON.parse(body);
        
        const query = `
          INSERT INTO pacientes (nome, idade, exame, status) 
          VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const valores = [novoPaciente.nome, novoPaciente.idade, novoPaciente.exame, novoPaciente.status];

        const resultado = await pool.query(query, valores);
        
        res.statusCode = 201;
        res.end(JSON.stringify({ 
          mensagem: "Paciente cadastrado com sucesso!", 
          paciente: resultado.rows[0] 
        }));
      } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ erro: "Erro interno ao salvar no banco de dados." }));
      }
    });
  } 
  
  // Qualquer outro método
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ erro: "Método não suportado no patient-service" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🏥 Patient-service (Conectado ao DB) rodando na porta ${PORT}`);
});