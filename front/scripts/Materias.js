const apiBase = "/api/materias";
const form = document.getElementById("formMateria");
const lista = document.getElementById("listaMaterias");
const paginacao = document.getElementById("paginacao");
const mensagem = document.getElementById("mensagem");

let materias = [];
let paginaAtual = 1;
const itensPorPagina = 10;

// 🟩 Função para cadastrar uma matéria
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const novaMateria = {
    nome: formData.get("nome"),
    carga: formData.get("carga")
  };

  try {
    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaMateria)
    });

    if (!res.ok) throw new Error("Erro ao cadastrar");
    mostrarMensagem("Matéria cadastrada com sucesso!", "success");
    form.reset();
    await carregarMaterias();
  } catch (err) {
    mostrarMensagem("Erro: " + err.message, "error");
  }
});

// 🟩 Função para carregar matérias
async function carregarMaterias() {
  try {
    const res = await fetch(apiBase);
    materias = await res.json();
    renderizarMaterias();
    renderizarPaginacao();
  } catch (err) {
    mostrarMensagem("Erro ao carregar matérias", "error");
  }
}

// 🟩 Renderiza a lista da página atual
function renderizarMaterias() {
  lista.innerHTML = "";

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const materiasPagina = materias.slice(inicio, fim);

  if (materiasPagina.length === 0) {
    lista.innerHTML = "<p>Nenhuma matéria cadastrada.</p>";
    return;
  }

  const tabela = document.createElement("table");
  tabela.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Carga Horária</th>
      <th>Ações</th>
    </tr>
  `;

  materiasPagina.forEach((mat) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${mat.nome}</td>
      <td>${mat.carga}</td>
      <td>
        <button onclick="excluirMateria(${mat.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });

  lista.appendChild(tabela);
}

// 🟩 Função para excluir matéria
async function excluirMateria(id) {
  if (!confirm("Tem certeza que deseja excluir esta matéria?")) return;

  try {
    const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir");
    await carregarMaterias();
  } catch (err) {
    mostrarMensagem("Erro ao excluir matéria", "error");
  }
}

// 🟩 Renderiza paginação
function renderizarPaginacao() {
  paginacao.innerHTML = "";

  const totalPaginas = Math.ceil(materias.length / itensPorPagina);

  if (totalPaginas <= 1) return;

  const btnAnterior = criarBotao("«", () => mudarPagina(paginaAtual - 1));
  btnAnterior.disabled = paginaAtual === 1;
  paginacao.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
  const btn = criarBotao(i, () => mudarPagina(i));
  if (i === paginaAtual) {
    btn.classList.add("ativo"); // Aplica estilo ativo
  }
  paginacao.appendChild(btn);
}

  const btnProximo = criarBotao("»", () => mudarPagina(paginaAtual + 1));
  btnProximo.disabled = paginaAtual === totalPaginas;
  paginacao.appendChild(btnProximo);
}

function criarBotao(texto, onClick) {
  const btn = document.createElement("button");
  btn.textContent = texto;
  btn.addEventListener("click", onClick);
  return btn;
}

function mudarPagina(novaPagina) {
  paginaAtual = novaPagina;
  renderizarMaterias();
  renderizarPaginacao();
}

// 🟩 Mostrar mensagem
function mostrarMensagem(msg, tipo) {
  mensagem.textContent = msg;
  mensagem.style.color = tipo === "success" ? "green" : "red";
  setTimeout(() => mensagem.textContent = "", 3000);
}

// 🟩 Inicializar
carregarMaterias();
