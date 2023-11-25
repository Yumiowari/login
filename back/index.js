const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json()); // necessário para extrair os dados de forms vindos de uma requisição POST
app.use(cors()); // permite mesma origem (front e back no mesmo pc)

app.listen(3001, () => {
    console.log('Servidor ouvindo na porta 3001!');
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body; // "desconstrói" o corpo da requisição em suas partes (é um objeto)

    const caminho = path.join(__dirname, '.', 'db', 'usuarios.json'); // busca o banco de dados de usuários
    const usuarios = JSON.parse(fs.readFileSync(caminho, {encoding: 'utf8', flag: 'r'})); // faz a LEITURA do banco de dados de usuários

    for(let usuario of usuarios){
        if(usuario.email === email){ // se achar o e-mail
            if(password === usuario.password){ // verifica se a senha coincide
                return res.status(200).send('Login autenticado!');
            }else return res.status(422).send('E-mail ou senha incorretos.');
        }
    }

    return res.status(409).send(`Usuário com e-mail ${email} não existe. Considere criar uma conta!`);
});

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body; // "desconstrói" o corpo da requisição em suas partes (é um objeto)

    const caminho = path.join(__dirname, '.', 'db', 'usuarios.json'); // busca o banco de dados de usuários
    const usuarios = JSON.parse(fs.readFileSync(caminho, {encoding: 'utf8', flag: 'r'})); // faz a LEITURA do banco de dados de usuários

    for(let usuario of usuarios){
        if(usuario.email === email){ // se achar o e-mail
            return res.status(409).send(`Usuário com e-mail ${email} já cadastrado.`);
        }
    }

    const id = usuarios.length + 1;

    const novoUsuario = {
        id: id,
        username: username,
        email: email,
        password: password
    };

    usuarios.push(novoUsuario);

    fs.writeFileSync(caminho, JSON.stringify(usuarios, null, 2));

    res.status(200).send('Tudo certo. Usuário cadastrado com sucesso!');
});