const gridContainer = document.querySelector('.professores-grid'); 

// Parâmetros de paginação
const itensPorPagina = 12;
let paginaAtual = 1;
let professores = [];

// Função para buscar todos os professores
async function buscarProfessores() {
    try {
        const resposta = await fetch('http://localhost:3000/api/public/professores-public'); 
        professores = await resposta.json();
        renderizarProfessores();
        criarPaginacao();
    } catch (erro) {
        console.error('Erro ao buscar professores:', erro);
        gridContainer.innerHTML = "<p>Erro ao carregar os professores.</p>"; 
    }
}

// Função para renderizar os professores na página
function renderizarProfessores() {
    gridContainer.innerHTML = '';

    // Filtra os professores válidos ANTES da paginação
    const professoresValidos = professores.filter(prof => prof.nome !== 'a definir');

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const paginaProfessores = professoresValidos.slice(inicio, fim);

    paginaProfessores.forEach((prof) => {
        const link = document.createElement('a');
        link.className = 'prof-card';
        link.href = `/pages/telaProfessor.html?id=${prof._id || prof.id}`;
        link.innerHTML = `<div class="icon">&#128100;</div><p>Prof. ${prof.nome}</p>`; 
        gridContainer.appendChild(link);
    });
}

// Função para criar a navegação de páginas
function criarPaginacao() {
    const paginacao = document.createElement("div");
    paginacao.className = 'paginacao'; 

    const professoresValidos = professores.filter(prof => prof.nome !== 'a definir');
    const totalPaginas = Math.ceil(professoresValidos.length / itensPorPagina);
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaAtual) btn.classList.add('ativo'); 
        btn.addEventListener('click', () => {
            paginaAtual = i;
            renderizarProfessores();
            criarPaginacao();
        });
        paginacao.appendChild(btn);
    }

    // Remove paginação anterior se houver e adiciona a nova
    const existente = document.querySelector(".paginacao");
    if (existente) existente.remove();
    gridContainer.parentElement.appendChild(paginacao);
}

// Chamada inicial
buscarProfessores();
