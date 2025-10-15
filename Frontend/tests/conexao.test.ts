/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import "whatwg-fetch";

// Simula o HTML básico
document.body.innerHTML = `
  <form id="criaProduto">
    <input id="nome" value="Jean" />
    <input id="salario" value="3500" />
    <button id="botao">Adicionar Novo Funcionário</button>
  </form>
  <table><tbody id="tabelaFuncionarios"></tbody></table>
`;

// Importa o script original (simula o navegador)
import "../conexao";

// Mock global de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { cod: 1, nome: "Jean", salario: 3500 },
      { cod: 2, nome: "Maria", salario: 4200 },
    ]),
  })
) as any;

describe("🧠 Testes do frontend (conexao.ts)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve preencher a tabela com funcionários ao chamar listaFuncionarios", async () => {
    const { listaFuncionarios } = await import("../conexao");
    await listaFuncionarios();

    const linhas = document.querySelectorAll("#tabelaFuncionarios tr");
    expect(linhas.length).toBe(2);
    expect(linhas[0].innerHTML).toContain("Jean");
  });

  it("deve chamar a API corretamente ao adicionar um funcionário", async () => {
    const form = document.getElementById("criaProduto")!;
    const event = new Event("submit");
    form.dispatchEvent(event);

    // espera que o fetch tenha sido chamado com POST
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost:5000/funcionario"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("deve mudar o texto do botão ao editar um funcionário", async () => {
    const { editarFuncionario } = await import("../conexao");

    // mock de retorno da API
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        json: () => Promise.resolve({ cod: 1, nome: "Jean", salario: 3500 }),
    } as unknown as Response);

    await editarFuncionario(1);
    const botao = document.getElementById("botao")!;
    expect(botao.textContent).toBe("Adicionar Novo Funcionário");
  });
});