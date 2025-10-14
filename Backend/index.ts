import express, { Express, Request, Response } from 'express';
import mysql, { Connection, QueryError, RowDataPacket, OkPacket } from 'mysql2';
import cors from 'cors';

const app: Express = express();
app.use(express.json());
app.use(cors());

interface Funcionario {
  cod: number;
  nome: string;
  salario: number;
}

/* Configuração do banco de dados (O banco deve existir) 
 *
 * Caso o banco não exista, execute o comando: 
 * CREATE DATABASE funcionarioDB;
 *
*/

const db: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "funcionarioDB",
});

// Conectando ao banco
db.connect((err: QueryError | null) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL!");
  }
});

// CRUD dos funcionários

// Método POST para adicionar um funcionário    
app.post("/funcionario", (req: Request, res: Response) => {
  const { nome, salario } = req.body as { nome: string; salario: number };
  db.query(
    "INSERT INTO funcionario (nome, salario) VALUES (?, ?)",
    [nome, salario],
    (err: QueryError | null, result: OkPacket) => {
      if (err) return res.status(500).send(err);
      res.send({ cod: result.insertId, nome, salario });
    }
  );
});

// Método GET para listar todos os funcionários    
app.get("/funcionario", (req: Request, res: Response) => {
  db.query(
    "SELECT * FROM funcionario",
    (err: QueryError | null, results: RowDataPacket[]) => {
      if (err) return res.status(500).send(err);
      res.json(results as Funcionario[]);
    }
  );
});

// Método GET para listar um funcionário pelo código
app.get("/funcionario/:cod", (req: Request, res: Response) => {
  db.query(
    "SELECT * FROM funcionario WHERE cod = ?",
    [req.params.cod],
    (err: QueryError | null, results: RowDataPacket[]) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send("Funcionário não encontrado!");
      res.json(results[0] as Funcionario);
    }
  );
});

// Método PUT para atualizar um funcionário pelo código
app.put("/funcionario/:cod", (req: Request, res: Response) => {
  const { nome, salario } = req.body as { nome: string; salario: number };
  db.query(
    "UPDATE funcionario SET nome = ?, salario = ? WHERE cod = ?",
    [nome, salario, req.params.cod],
    (err: QueryError | null, result: OkPacket) => {
      if (err) return res.status(500).send(err);
      res.send("Funcionário atualizado com sucesso!");
    }
  );
});

// Método DELETE para remover um funcionário pelo código
app.delete("/funcionario/:cod", (req: Request, res: Response) => {
  db.query(
    "DELETE FROM funcionario WHERE cod = ?",
    [req.params.cod],
    (err: QueryError | null, result: OkPacket) => {
      if (err) return res.status(500).send(err);
      res.send("Funcionário deletado!");
    }
  );
});

// Iniciar o servidor
if (process.env.NODE_ENV !== "test") {
  const PORT: number = 5000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

export default app;