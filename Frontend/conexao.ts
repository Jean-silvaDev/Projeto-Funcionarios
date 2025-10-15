const API_URL: string = "http://localhost:5000/funcionario";

interface Funcionario {
    cod: number;
    nome: string;
    salario: number;
}

// Função para buscar funcionários
async function listaFuncionarios(): Promise<void> {
    const response: Response = await fetch(API_URL);
    const funcionarios: Funcionario[] = await response.json();

    const tabela: HTMLTableElement | null = document.getElementById("tabelaFuncionarios") as HTMLTableElement;
    if (tabela) {
        tabela.innerHTML = "";

        funcionarios.forEach((funcionario: Funcionario) => {
            const linha: HTMLTableRowElement = tabela.insertRow();
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
}

// Função para adicionar ou atualizar um funcionário
document.getElementById("criaProduto")?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const nomeInput: HTMLInputElement | null = document.getElementById("nome") as HTMLInputElement;
    const salarioInput: HTMLInputElement | null = document.getElementById("salario") as HTMLInputElement;
    const botao: HTMLButtonElement | null = document.getElementById("botao") as HTMLButtonElement;

    if (!nomeInput || !salarioInput || !botao) return;

    const nome: string = nomeInput.value;
    const salario: number = parseFloat(salarioInput.value);

    if (funcionarioEmEdicao) {
        // Atualiza funcionário
        await fetch(`${API_URL}/${funcionarioEmEdicao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, salario })
        });
        funcionarioEmEdicao = null;
    } else {
        // Cria novo funcionário
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, salario })
        });
    }

    botao.innerText = "Adicionar Novo Funcionário";
    (document.getElementById("criaProduto") as HTMLFormElement).reset();
    await listaFuncionarios();
});

// Função para deletar um funcionário
async function deletarFuncionario(cod: number): Promise<void> {
    await fetch(`${API_URL}/${cod}`, { method: "DELETE" });
    await listaFuncionarios();
}

// Função para editar um funcionário
let funcionarioEmEdicao: number | null = null;

async function editarFuncionario(cod: number): Promise<void> {
    const response: Response = await fetch(`${API_URL}/${cod}`);
    const funcionario: Funcionario = await response.json();

    const nomeInput: HTMLInputElement | null = document.getElementById("nome") as HTMLInputElement;
    const salarioInput: HTMLInputElement | null = document.getElementById("salario") as HTMLInputElement;
    const botao: HTMLButtonElement | null = document.getElementById("botao") as HTMLButtonElement;

    if (nomeInput && salarioInput && botao) {
        nomeInput.value = funcionario.nome;
        salarioInput.value = funcionario.salario.toString();
        funcionarioEmEdicao = funcionario.cod;
        botao.innerText = "Atualizar Funcionário";
    }
}

if (typeof window !== "undefined") {
  listaFuncionarios();
}

export { listaFuncionarios, editarFuncionario, deletarFuncionario };