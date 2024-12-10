const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());

// Dados simulados
let entries = [];

// Rota principal
app.get('/', (req, res) => {
    res.send('API está ativa');
});

// Rota para listar todas as entradas
app.get('/entries', (req, res) => {
    console.log('Recebeu pedido para listar entradas.');
    res.json(entries);
});

// Rota para adicionar uma nova entrada
app.post('/entries', (req, res) => {
    console.log('Recebeu pedido para adicionar uma nova entrada.');
    const entry = req.body;

    // Validação simples
    const requiredFields = ["id", "escola", "curso", "coordenadas", "nome", "descricao", "email", "telefone", "morada", "comentarios"];
    for (let field of requiredFields) {
        if (!entry[field]) {
            console.log(`Erro: Campo ${field} está em falta.`);
            return res.status(400).json({ error: `Campo ${field} está em falta` });
        }
    }

    entries.push(entry);
    res.status(201).json(entry);
});

// Rota para deletar uma entrada por ID
app.delete('/entries/:id', (req, res) => {
    console.log(`Recebeu pedido para deletar entrada com ID ${req.params.id}.`);
    const id = parseInt(req.params.id);
    entries = entries.filter(entry => entry.id !== id);
    res.json({ message: `Entrada com ID ${id} foi removida` });
});

// Rota para atualizar uma entrada por ID
app.put('/entries/:id', (req, res) => {
    console.log(`Recebeu pedido para atualizar entrada com ID ${req.params.id}.`);
    const id = parseInt(req.params.id);
    const updatedEntry = req.body;

    let entry = entries.find(e => e.id === id);
    if (!entry) {
        console.log(`Erro: Entrada com ID ${id} não encontrada.`);
        return res.status(404).json({ error: "Entrada não encontrada" });
    }

    Object.assign(entry, updatedEntry);
    res.json(entry);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
