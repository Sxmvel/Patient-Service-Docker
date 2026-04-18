const http = require('http');
const { Pool } = require('pg');

// 1. Configurando a chave do cofre! 

//usa NOME DO SERVIÇO (meu-banco-dados) em vez de localhost
const pool = new Pool({
  connectionString: 'postgresql://admin:senha_super_secreta@meu-banco-dados:5432/clinica_db'
});

// 2. Função que prepara o banco de dados quando o serviço liga
async function inicializarBanco() {
  try {
    // Cria a tabela se for a primeira vez rodando
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        idade INT,
        exame VARCHAR(100),
        status VARCHAR(50)
      );
    `);
    
    // Verifica se a tabela está vazia. Se estiver, insere o João!
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

// Executa a preparação do banco
inicializarBanco();

// 3. O nosso servidor recebendo os pedidos
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Busca os dados REAIS direto do banco de dados
    const resultado = await pool.query('SELECT * FROM pacientes');
    
    res.statusCode = 200;
    res.end(JSON.stringify(resultado.rows));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ erro: "Erro interno ao buscar dados no banco." }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🏥 Patient-service (Conectado ao DB) rodando na porta ${PORT}`);
});