const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Importar o módulo para manipulação de ficheiros

const app = express();
const port = process.env.PORT || 3000;

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());

// Nome do ficheiro JSON
const dataFile = 'escolas.json';

// Função para carregar os dados do ficheiro JSON
function loadData() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        } else {
            console.log('Ficheiro JSON não encontrado. Criando um novo.');
            return [];
        }
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        return [];
    }
}

// Função para salvar os dados no ficheiro JSON
function saveData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        console.log('Dados salvos no ficheiro JSON com sucesso.');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

// Dados simulados carregados do ficheiro JSON
let escolas = loadData();

// Rota principal
app.get('/', (req, res) => {
    res.send('API está ativa');
});

// Rota para listar todas as escolas
app.get('/escolas', (req, res) => {
    console.log('Recebeu pedido para listar escolas.');
    res.json(escolas);
});

// Rota para adicionar uma nova escola
app.post('/escolas', (req, res) => {
    console.log('Recebeu pedido para adicionar uma nova escola.');
    const escola = req.body;

    // Validação simples
    if (!escola.nome || !escola.cursos || !Array.isArray(escola.cursos)) {
        console.log('Erro: Nome da escola ou cursos está em falta ou inválido.');
        return res.status(400).json({ error: 'Nome da escola ou lista de cursos inválida' });
    }

    escolas.push(escola);
    saveData(escolas); // Salvar os dados atualizados no ficheiro JSON
    res.status(201).json(escola);
});

// Rota para listar cursos de uma escola
app.get('/escolas/:nome/cursos', (req, res) => {
    console.log(`Recebeu pedido para listar cursos da escola: ${req.params.nome}.`);
    const escola = escolas.find(e => e.nome === req.params.nome);

    if (!escola) {
        console.log('Erro: Escola não encontrada.');
        return res.status(404).json({ error: 'Escola não encontrada' });
    }

    res.json(escola.cursos);
});

// Rota para adicionar um curso a uma escola
app.post('/escolas/:nome/cursos', (req, res) => {
    console.log(`Recebeu pedido para adicionar curso na escola: ${req.params.nome}.`);
    const escola = escolas.find(e => e.nome === req.params.nome);

    if (!escola) {
        console.log('Erro: Escola não encontrada.');
        return res.status(404).json({ error: 'Escola não encontrada' });
    }

    const curso = req.body;

    // Validação simples para cursos
    if (!curso.nome || !curso.empresas || !Array.isArray(curso.empresas)) {
        console.log('Erro: Nome do curso ou lista de empresas inválida.');
        return res.status(400).json({ error: 'Nome do curso ou lista de empresas inválida' });
    }

    escola.cursos.push(curso);
    saveData(escolas); // Salvar os dados atualizados no ficheiro JSON
    res.status(201).json(curso);
});

// Rota para listar empresas de um curso
app.get('/escolas/:nomeEscola/cursos/:nomeCurso/empresas', (req, res) => {
    console.log(`Recebeu pedido para listar empresas do curso ${req.params.nomeCurso} da escola ${req.params.nomeEscola}.`);
    const escola = escolas.find(e => e.nome === req.params.nomeEscola);

    if (!escola) {
        console.log('Erro: Escola não encontrada.');
        return res.status(404).json({ error: 'Escola não encontrada' });
    }

    const curso = escola.cursos.find(c => c.nome === req.params.nomeCurso);

    if (!curso) {
        console.log('Erro: Curso não encontrado.');
        return res.status(404).json({ error: 'Curso não encontrado' });
    }

    res.json(curso.empresas);
});

// Rota para adicionar uma empresa a um curso
app.post('/escolas/:nomeEscola/cursos/:nomeCurso/empresas', (req, res) => {
    console.log(`Recebeu pedido para adicionar empresa ao curso ${req.params.nomeCurso} da escola ${req.params.nomeEscola}.`);
    const escola = escolas.find(e => e.nome === req.params.nomeEscola);

    if (!escola) {
        console.log('Erro: Escola não encontrada.');
        return res.status(404).json({ error: 'Escola não encontrada' });
    }

    const curso = escola.cursos.find(c => c.nome === req.params.nomeCurso);

    if (!curso) {
        console.log('Erro: Curso não encontrado.');
        return res.status(404).json({ error: 'Curso não encontrado' });
    }

    const empresa = req.body;

    // Validação simples para empresa
    const requiredFields = ["id", "nome", "descricao", "email", "telefone", "morada", "coordenadas"];
    for (let field of requiredFields) {
        if (!empresa[field]) {
            console.log(`Erro: Campo ${field} está em falta.`);
            return res.status(400).json({ error: `Campo ${field} está em falta` });
        }
    }

    curso.empresas.push(empresa);
    saveData(escolas); // Salvar os dados atualizados no ficheiro JSON
    res.status(201).json(empresa);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
