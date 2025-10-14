"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
const API_URL = "http://localhost:5000/funcionario";
// Função para buscar funcionários
function listaFuncionarios() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(API_URL);
        const funcionarios = yield response.json();
        const tabela = document.getElementById("tabelaFuncionarios");
        if (tabela) {
            tabela.innerHTML = "";
            funcionarios.forEach((funcionario) => {
                const linha = tabela.insertRow();
                linha.innerHTML = `
                <td>${funcionario.cod}</td>
                <td>${funcionario.nome}</td>
                <td>R$ ${String(Number(funcionario.salario).toFixed(2)).replace('.', ',')}</td>
                <td>
                    <button onclick="editarFuncionario(${funcionario.cod})">Editar</button>
                    <button onclick="deletarFuncionario(${funcionario.cod})">Excluir</button>
                </td>
            `;
            });
        }
    });
}
// Função para adicionar ou atualizar um funcionário
(_a = document.getElementById("criaProduto")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const nomeInput = document.getElementById("nome");
    const salarioInput = document.getElementById("salario");
    const botao = document.getElementById("botao");
    if (!nomeInput || !salarioInput || !botao)
        return;
    const nome = nomeInput.value;
    const salario = parseFloat(salarioInput.value);
    if (funcionarioEmEdicao) {
        // Atualiza funcionário
        yield fetch(`${API_URL}/${funcionarioEmEdicao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, salario })
        });
        funcionarioEmEdicao = null;
    }
    else {
        // Cria novo funcionário
        yield fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, salario })
        });
    }
    botao.innerText = "Adicionar Novo Funcionário";
    document.getElementById("criaProduto").reset();
    yield listaFuncionarios();
}));
// Função para deletar um funcionário
function deletarFuncionario(cod) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`${API_URL}/${cod}`, { method: "DELETE" });
        yield listaFuncionarios();
    });
}
// Função para editar um funcionário
let funcionarioEmEdicao = null;
function editarFuncionario(cod) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/${cod}`);
        const funcionario = yield response.json();
        const nomeInput = document.getElementById("nome");
        const salarioInput = document.getElementById("salario");
        const botao = document.getElementById("botao");
        if (nomeInput && salarioInput && botao) {
            nomeInput.value = funcionario.nome;
            salarioInput.value = funcionario.salario.toString();
            funcionarioEmEdicao = funcionario.cod;
            botao.innerText = "Atualizar Funcionário";
        }
    });
}
listaFuncionarios();
