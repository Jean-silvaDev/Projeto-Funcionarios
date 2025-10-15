import request from "supertest";
import app from "../index";
import mysql from "mysql2";

// 🧱 Mock do banco de dados
jest.mock("mysql2", () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn((cb) => cb(null)),

    query: jest.fn((...args: any[]) => {
      const sql = args[0]?.toLowerCase();
      const values = Array.isArray(args[1]) ? args[1] : [];
      const cb = typeof args[1] === "function" ? args[1] : args[2];

      if (!cb) return;

      if (sql.includes("insert into funcionario")) {
        cb(null, { insertId: 101 });
      } 
      else if (sql.includes("select * from funcionario where cod")) {
        if (values[0] === "1") {
          cb(null, [{ cod: 1, nome: "Jean", salario: 3500 }]);
        } else {
          cb(null, []);
        }
      } 
      else if (sql.includes("select * from funcionario")) {
        cb(null, [
          { cod: 1, nome: "Jean", salario: 3500 },
          { cod: 2, nome: "Maria", salario: 4200 },
        ]);
      } 
      else if (sql.includes("update funcionario")) {
        cb(null, { affectedRows: 1 });
      } 
      else if (sql.includes("delete from funcionario")) {
        cb(null, { affectedRows: 1 });
      } 
      else {
        cb(null, []);
      }
    }),
  })),
}));

describe("🚀 Testes da API de Funcionários", () => {

  // POST — Criar funcionário
  it("POST /funcionario deve criar um novo funcionário", async () => {
    const novoFuncionario = { nome: "João", salario: 3000 };
    const res = await request(app).post("/funcionario").send(novoFuncionario);

    expect(res.status).toBe(200);
    expect(res.body.cod).toBe(101);
    expect(res.body.nome).toBe("João");
  });

  // GET — Listar todos
  it("GET /funcionario deve listar todos os funcionários", async () => {
    const res = await request(app).get("/funcionario");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  // GET — Buscar por código existente
  it("GET /funcionario/:cod deve retornar um funcionário específico", async () => {
    const res = await request(app).get("/funcionario/1");

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Jean");
  });

  // GET — Buscar por código inexistente
  it("GET /funcionario/:cod deve retornar 404 se não existir", async () => {
    const res = await request(app).get("/funcionario/999");
    expect(res.status).toBe(404);
  });

  // PUT — Atualizar
  it("PUT /funcionario/:cod deve atualizar um funcionário existente", async () => {
    const res = await request(app)
      .put("/funcionario/1")
      .send({ nome: "Jean Atualizado", salario: 3800 });

    expect(res.status).toBe(200);
    expect(res.text).toContain("atualizado");
  });

  // DELETE — Remover
  it("DELETE /funcionario/:cod deve deletar um funcionário existente", async () => {
    const res = await request(app).delete("/funcionario/1");

    expect(res.status).toBe(200);
    expect(res.text).toContain("deletado");
  });
});