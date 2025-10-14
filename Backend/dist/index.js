"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql2_1 = __importDefault(require("mysql2"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
/* Configuração do banco de dados (O banco deve existir)
 *
 * Caso o banco não exista, execute o comando:
 * CREATE DATABASE funcionarioDB;
 *
*/
const db = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "funcionarioDB",
});
// Conectando ao banco
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
    }
    else {
        console.log("Conectado ao MySQL!");
    }
});
// CRUD dos funcionários
// Método POST para adicionar um funcionário    
app.post("/funcionario", (req, res) => {
    const { nome, salario } = req.body;
    db.query("INSERT INTO funcionario (nome, salario) VALUES (?, ?)", [nome, salario], (err, result) => {
        if (err)
            return res.status(500).send(err);
        res.send({ cod: result.insertId, nome, salario });
    });
});
// Método GET para listar todos os funcionários    
app.get("/funcionario", (req, res) => {
    db.query("SELECT * FROM funcionario", (err, results) => {
        if (err)
            return res.status(500).send(err);
        res.json(results);
    });
});
// Método GET para listar um funcionário pelo código
app.get("/funcionario/:cod", (req, res) => {
    db.query("SELECT * FROM funcionario WHERE cod = ?", [req.params.cod], (err, results) => {
        if (err)
            return res.status(500).send(err);
        if (results.length === 0)
            return res.status(404).send("Funcionário não encontrado!");
        res.json(results[0]);
    });
});
// Método PUT para atualizar um funcionário pelo código
app.put("/funcionario/:cod", (req, res) => {
    const { nome, salario } = req.body;
    db.query("UPDATE funcionario SET nome = ?, salario = ? WHERE cod = ?", [nome, salario, req.params.cod], (err, result) => {
        if (err)
            return res.status(500).send(err);
        res.send("Funcionário atualizado com sucesso!");
    });
});
// Método DELETE para remover um funcionário pelo código
app.delete("/funcionario/:cod", (req, res) => {
    db.query("DELETE FROM funcionario WHERE cod = ?", [req.params.cod], (err, result) => {
        if (err)
            return res.status(500).send(err);
        res.send("Funcionário deletado!");
    });
});
// Iniciar o servidor
if (process.env.NODE_ENV !== "test") {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}
exports.default = app;
