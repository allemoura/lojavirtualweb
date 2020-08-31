const db = require('../models/index');
const Gerente = db.Gerente;

const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    async create(req, res) {
        try {
            const {nome, email, senha} = req.body;
            const hashed = await bcrypt.hash(senha, 15);
            // add verificação de email duplicado
            const gerente = await Gerente.create({
                email,
                senha: hashed, 
                nome
            });
            return res.status(201).json(gerente.id);

        } catch (error) {
            return res.status(500).send({
                mensagem: "Erro ao cadastrar gerente: " + error
            });
        }
    },
    async update(req, res) {
        try {
            const gerente = await Gerente.findByPk(req.params.id);
            const valores = req.body;

            if (!gerente) {
                return res.status(404).send({ error: "gerente nao encontrado." });
            }
            if (req.user_id == gerente.id) {
                await gerente.update(valores)
                return res.status(200).send({ msg: "Atualizado com sucesso." });
            }
            return res.status(401).send({ msg: "Permissão negada." });
            
        } catch (error) {
            return res.status(500).send({ msg: "Nao foi possivel atualizar: " + error });
        }
    },
    async show(req, res) {
        try {
            const gerente = await Gerente.findByPk(req.params.id);

            if (!gerente) {
                return res.status(404).send({ error: "gerente não cadastrado." });
            }
            if (req.user_id == gerente.id) {
                return res.status(200).send(); // dto
            }
            return res.status(401).send({ msg: "Permissão negada." });

        } catch (error) {
            return res.status(500).send({ msg: "Não foi possível buscar: " + error });
        }
    },
    async delete(req ,res) {
        try {
            const gerente = Gerente.findByPk(req.params.id);
            
            if (!gerente) {
                return res.status(404).send({ error: "gerente não cadastrado." });
            }

            if (req.user_id == gerente.id) {
                await Gerente.destroy({
                    where: {id : req.params.id},
                });
                return res.status(200).send({ msg: "Removido com sucesso." });
            }
            return res.status(401).send({ mensagem: "Permissão negada." });

        } catch (error) {
            return res.status(500).send({ msg: "Nao foi possivel remover: " + error });
        }
    },
};