const db = require('../models/index');
const Loja = db.Loja;
const Gerente = db.Gerente;
const Cliente = db.Cliente;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    async login(req, res) {
        try {
            const { tipo, email, senha } = req.body;

            if (!email) {
                return res.status(400).send('Campo "Email" obrigatorio.');
                
            } else if (!senha) {
                return res.status(400).send('Campo "Senha" obrigatorio.')
            }
            
            switch (tipo) {
                case "loja":
                    const loja = await Loja.findOne({where: {email: email}});
                    if (!loja) {
                        return res.status(401).send({msg: "Email incorreto."});
                    }
                    return validaSenha(senha, loja, res);
                case "gerente":
                    const gerente = await Gerente.findOne({where: {email: email}});
                    if (!gerente) {
                        return res.status(401).send({msg: "Email incorreto."});  
                    }
                    return validaSenha(senha, gerente, res);
                case "cliente":
                    const cliente = await Cliente.findOne({where: {email: email}});
                    if (!cliente) {
                        return res.status(401).send({msg: "Email incorreto."});
                    }
                    return validaSenha(senha, cliente, res);
            }
            return res.status(401).send({msg: "Usuário não cadastrado."});

        } catch (error) {
            return res.status(500).send({msg: "Erro: " + error});
        }
    },
};

async function validaSenha(senha, usuario, res) {
    
    const match = await bcrypt.compare(senha, usuario.senha);
        
    if (match) {
        let meuToken = jwt.sign({id: usuario.id}, process.env.SECRET, {expiresIn: '24h'});
        return res.status(200).send(meuToken);
    } else { return res.status(401).send({msg: "Senha incorreta"}); }
}