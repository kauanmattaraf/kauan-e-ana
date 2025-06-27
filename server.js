// Importa os módulos necessários
const express = require('express');
const cors = require('cors'); // Para permitir requisições do Front-End

const app = express();
const PORT = 3000;

// Configura o middleware
app.use(cors()); // Habilita o CORS
app.use(express.json()); // Habilita o Express a interpretar requisições com corpo JSON

// --- SIMULAÇÃO DE BANCO DE DADOS EM MEMÓRIA ---
// NOTA: Os dados serão perdidos toda vez que o servidor for reiniciado!
let products = [
    { id: 'prod-101', name: 'Ração para Cães Filhotes', price: 95.50, description: 'Fórmula balanceada para o crescimento saudável.' },
    { id: 'prod-102', name: 'Petisco Dental para Gatos', price: 25.00, description: 'Ajuda a controlar o tártaro e o mau hálito.' },
    { id: 'prod-103', name: 'Coleira Antipulgas e Carrapatos', price: 70.00, description: 'Proteção eficaz por até 8 meses.' }
];

console.log('Simulando o banco de dados em memória. Produtos iniciais carregados.');

// --- Rotas da API ---

// Rota GET /produtos: Retorna todos os produtos
app.get('/produtos', (req, res) => {
    // Retorna a lista de produtos em memória
    // Simula um pequeno atraso de rede
    setTimeout(() => {
        res.json(products);
    }, 200);
});

// Rota POST /produtos: Adiciona um novo produto
app.post('/produtos', (req, res) => {
    const { name, price, description } = req.body;

    if (!name || typeof price !== 'number' || isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Nome e Preço são obrigatórios e o preço deve ser um número positivo.' });
    }

    // Gera um ID único simples (simula o que um banco de dados faria)
    const id = `prod-${Date.now()}`;
    const newProduct = { id, name, price: parseFloat(price), description: description || '' };

    products.push(newProduct); // Adiciona o novo produto ao array em memória

    // Simula um pequeno atraso de rede e retorna o produto criado
    setTimeout(() => {
        res.status(201).json(newProduct);
    }, 200);
});

// Rota DELETE /produtos/:id: Exclui um produto por ID
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    const initialLength = products.length;
    // Filtra o array, removendo o produto com o ID correspondente
    products = products.filter(product => product.id !== id);

    // Simula um pequeno atraso de rede
    setTimeout(() => {
        if (products.length < initialLength) {
            res.json({ message: 'Produto excluído com sucesso!', id: id });
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    }, 200);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor Back-End simulado rodando em http://localhost:${PORT}`);
    console.log('NOTA: Dados são armazenados APENAS em memória e serão perdidos ao reiniciar o servidor.');
    console.log('Pressione CTRL+C para parar o servidor.');
});

