 require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();

app.use(express.json()); // necessário para extrair os dados de forms vindos de uma requisição POST
app.use(cors()); // permite mesma origem (front e back no mesmo pc)

app.listen(3001, () => {
    console.log('Servidor ouvindo na porta 3001!');
});

// com validação de token
app.post('/login', async (req, res) => {
    const {email, password} = req.body; // "desconstrói" o corpo da requisição em suas partes (é um objeto)

    const caminho = path.join(__dirname, '.', 'db', 'usuarios.json'); // busca o banco de dados de usuários
    const usuarios = JSON.parse(fs.readFileSync(caminho, {encoding: 'utf8', flag: 'r'})); // faz a LEITURA do banco de dados de usuários

    for(let usuario of usuarios){
        if(usuario.email === email){ // se achar o e-mail
            const passwordValidado = await bcrypt.compare(password, usuario.password); // verifica se a senha coincide
            if(passwordValidado){
                const token = jwt.sign(usuario, process.env.TOKEN);
                
                const info = {
                    token: token,
                    feedback: 'Login autenticado!'
                }

                return res.status(200).json(info); // se validou, devolve o token
            }else return res.status(422).send('E-mail ou senha incorretos.');
        }
    }

    return res.status(409).send(`Usuário com e-mail ${email} não existe. Considere criar uma conta!`);
});

// com encriptação da senha
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

    // faz uma senha criptografada
    let salt = await bcrypt.genSalt(12);
    const passwordBcrypt = await bcrypt.hash(password, salt); // transforma a senha num hash

    const recKey = gerarRecKey(); // faz uma recovery key
    
    salt = await bcrypt.genSalt(12); // necessário?
    const recKeyBcrypt = await bcrypt.hash(recKey, salt); // também criptografa a recovery key

    const novoUsuario = {
        id: id,
        username: username,
        email: email,
        password: passwordBcrypt,
        recKey: recKeyBcrypt
    };

    usuarios.push(novoUsuario);

    fs.writeFileSync(caminho, JSON.stringify(usuarios, null, 2));

    const info = {
        feedback: 'Tudo certo. Usuário cadastrado com sucesso!',
        recKey: recKey // devolve em pacote sem criptografia (método inseguro /!\)
    }

    res.status(200).send(info);
});

app.get('/session', async (req, res) => {
    let token = req.get('Authorization');
    
    token = token.split(' ')[1];

    if(token == null) return res.status(401).send('Acesso negado.'); // se o token for nulo ou indefinido

    jwt.verify(token, process.env.TOKEN, (error) => {
        if(error) return res.status(403).send('Token inválido ou expirado.'); // se o token for inválido
    });

    return res.status(200).send('Token validado!');
})

function gerarRecKey () {
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    return numeroAleatorio.toString();
}

app.post('/lost-account', async (req, res) => {
    const {recKey, email, password} = req.body; // "desconstrói" o corpo da requisição em suas partes (é um objeto)

    const caminho = path.join(__dirname, '.', 'db', 'usuarios.json'); // busca o banco de dados de usuários
    let usuarios = JSON.parse(fs.readFileSync(caminho, {encoding: 'utf8', flag: 'r'})); // faz a LEITURA do banco de dados de usuários

    for(let usuario of usuarios){
        if(usuario.email === email){ // se achar o e-mail
            const recKeyValidada = await bcrypt.compare(recKey, usuario.recKey); // verifica se a senha coincide
            if(recKeyValidada){
                // faz uma senha criptografada
                const salt = await bcrypt.genSalt(12);
                const passwordBcrypt = await bcrypt.hash(password, salt); // transforma a senha num hash

                const novoUsuario = {
                    id: usuario.id, // mesmo id
                    username: usuario.username, // mesmo nome de usuário
                    email: email,
                    password: passwordBcrypt,
                    recKey: usuario.recKey // mesma recovery key
                };

                usuarios = usuarios.filter(user => user.id !== usuario.id) // filtra o antigo

                usuarios.push(novoUsuario);

                usuarios.sort((a, b) => a.id - b.id); // ordena em ordem crescente pelo id

                fs.writeFileSync(caminho, JSON.stringify(usuarios, null, 2));
                
                return res.status(200).send('Senha alterada com sucesso!'); // se validou, devolve o token
            }else return res.status(422).send('E-mail ou recovery key incorretos.');
        }
    }

    return res.status(409).send(`Usuário com e-mail ${email} não existe.`);
});