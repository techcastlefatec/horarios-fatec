// --- Constantes e Referências DOM ---
// Lista de IDs a ignorar nas interações visuais (elementos que não são clicáveis/selecionáveis no SVG)
const idsIgnoradosSvg = ['null', 'null-1', 'null-2', 'null-3', 'null-4', 'null-5', 'null-6', 'null-7', 'null-8', 'null-9', 'null-10'];

// Lista de IDs que representam ambientes, mas não são salas de aula válidas para exibir aulas
const idsNaoSalaDeAula = ['3','40', '39']; // Exemplo: Banheiros, Copa, etc.

// Mapeamento dos valores do select para os caminhos dos arquivos SVG
const caminhosSvg = {
    'terreo': './mapas/terreo.html',
    'primeiro': './mapas/primeiroandar.html',
    'segundo': './mapas/segundoandar.html',
};

// Referências aos elementos do DOM
const andarSelect = document.getElementById("andar");
const svgContainer = document.getElementById("svg-container");
const currentSalaNameSpan = document.getElementById("current-sala-name");
const aulasContentDiv = document.getElementById("aulas-content");

// --- Funções Principais ---

/**
 * Carrega e exibe o SVG do andar selecionado no container.
 * Limpa o estado da exibição de aulas ao carregar um novo mapa.
 * @param {string} andarValor - O valor do andar (ex: 'terreo', 'primeiro').
 */
async function carregarESelecionarSVG(andarValor) {
    const caminhoDoSvg = caminhosSvg[andarValor];

    if (!caminhoDoSvg) {
        console.error(`Caminho SVG não encontrado para o andar: ${andarValor}`);
        svgContainer.innerHTML = '<p style="color: red;">Mapa não disponível para este andar.</p>';
        return;
    }

    try {
        const response = await fetch(caminhoDoSvg);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o SVG: ${response.statusText}`);
        }
        const svgContent = await response.text();

        // Limpa o contêiner e insere o novo SVG
        svgContainer.innerHTML = svgContent;

        // Reseta o conteúdo das aulas e o nome da sala ao carregar um novo mapa
        resetarExibicaoAulas();

        // Aplica as interações aos elementos do SVG recém-carregado
        aplicarInteracoesSVG();

    } catch (error) {
        console.error('Erro ao carregar e exibir SVG:', error);
        svgContainer.innerHTML = '<p style="color: red;">Não foi possível carregar o mapa.</p>';
    }
}

/**
 * Aplica classes e event listeners aos elementos interativos dentro do SVG.
 */
function aplicarInteracoesSVG() {
    const svg = svgContainer.querySelector("svg");
    if (!svg) {
        console.warn("SVG não encontrado no container para aplicar interações.");
        return;
    }

    const elementosInterativos = svg.querySelectorAll("rect, path, text");

    elementosInterativos.forEach(el => {
        const id = el.id;
        if (!id) return;

        // Adiciona classes para estilo e identifica elementos a ignorar interatividade do clique
        if (idsIgnoradosSvg.includes(id)) {
            el.classList.add("ignorar-interacao");
        } else if (el.tagName.toLowerCase() !== 'text') { // Evita que texto puro seja interativo se não for sala
            el.classList.add("elemento-interativo");
        }

        // Remove listener anterior para evitar duplicação e adiciona o novo
        el.removeEventListener("click", handleElementClick);
        el.addEventListener("click", handleElementClick);
    });
}

/**
 * Lida com o clique em um elemento interativo do SVG.
 * @param {Event} event - O evento de clique.
 */
async function handleElementClick(event) {
    let targetElement = event.currentTarget;
    let elementId = targetElement.id;

    // Se o clique foi em um elemento <text>, tenta encontrar a forma correspondente com o mesmo ID
    if (targetElement.tagName.toLowerCase() === 'text') {
        const correspondingShape = document.getElementById(elementId);
        if (correspondingShape && (correspondingShape.tagName.toLowerCase() === 'rect' || correspondingShape.tagName.toLowerCase() === 'path')) {
            targetElement = correspondingShape;
        } else {
            // Se o texto não corresponde a uma forma clicável, ignora o clique
            return;
        }
    }

    // Ignora elementos com IDs na lista de ignorados
    if (idsIgnoradosSvg.includes(elementId)) {
        return;
    }

    const svg = svgContainer.querySelector("svg");
    if (!svg) return;

    // Remove a seleção de elementos anteriores
    svg.querySelectorAll(".elemento-selecionado").forEach(e => {
        e.classList.remove("elemento-selecionado");
    });

    // Adiciona a classe de seleção ao elemento clicado (se não for texto puro)
    if (targetElement.tagName.toLowerCase() !== 'text') {
        targetElement.classList.add("elemento-selecionado");
    }

    // Inicia o processo de busca de nome e aulas
    await processarSelecaoSala(elementId);
}

/**
 * Processa a seleção de uma sala, buscando seu nome e, se for uma sala de aula válida, suas aulas.
 * @param {string} salaId - O ID da sala selecionada.
 */
async function processarSelecaoSala(salaId) {
    currentSalaNameSpan.textContent = 'Carregando...';
    aulasContentDiv.innerHTML = '<p class="no-aulas-message">Carregando informações...</p>';

    try {
        // 1. Tenta carregar o nome da sala primeiro
        const salaData = await obterDetalhesSala(salaId);
        currentSalaNameSpan.textContent = salaData.nome || salaId; // Exibe o nome ou o ID como fallback

        // 2. Verifica se o ID está na lista de "não salas de aula"
        if (idsNaoSalaDeAula.includes(salaId)) {
            aulasContentDiv.innerHTML = '<p class="no-aulas-message" style="color: orange;">Escolha um ambiente válido (não é uma sala de aula).</p>';
            return; // Interrompe o processo, não busca aulas
        }

        // 3. Se for uma sala de aula válida, busca as aulas
        await buscarAulasPorSala(salaId);

    } catch (error) {
        console.error('Erro ao processar seleção da sala:', error);
        currentSalaNameSpan.textContent = 'Erro ao carregar nome';
        aulasContentDiv.innerHTML = `<p class="no-aulas-message" style="color: red;">Erro: ${error.message || 'Não foi possível carregar as informações do ambiente.'}</p>`;
    }
}

/**
 * Obtém os detalhes de uma sala (incluindo o nome) da API.
 * @param {string} salaId - O ID da sala.
 * @returns {Promise<Object>} - Um objeto contendo os detalhes da sala.
 */
async function obterDetalhesSala(salaId) {
    const url = `/api/public/salas-public/${salaId}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.mensagem || `Erro ao buscar detalhes da sala ${salaId}.`);
    }
    return data;
}

/**
 * Busca e exibe as aulas para uma sala específica na API.
 * @param {string} salaId - O ID da sala para buscar as aulas.
 */
async function buscarAulasPorSala(salaId) {
    const url = `/api/public/salas-public/${salaId}/aulas-hoje`;
    aulasContentDiv.innerHTML = '<p class="no-aulas-message">Buscando aulas...</p>'; // Mensagem de carregamento específico para aulas

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            // Se a API retornar um erro mas com mensagem de "Nenhuma aula...", trate-a como sucesso.
            if (response.status === 404 && data.mensagem === "Nenhuma aula nesta sala hoje") {
                 aulasContentDiv.innerHTML = '<p class="no-aulas-message">Nenhuma aula nesta sala hoje.</p>';
                 return;
            }
            throw new Error(data.mensagem || 'Erro desconhecido ao buscar aulas.');
        }

        if (Array.isArray(data) && data.length > 0) {
            let htmlAulas = '';
            data.forEach(aula => {
                // Certifica-se que hora_inicio e hora_fim existem antes de usar substring
                const horaInicioFormatada = aula.hora_inicio ? aula.hora_inicio.substring(0, 5) : 'N/A';
                const horaFimFormatada = aula.hora_fim ? aula.hora_fim.substring(0, 5) : 'N/A';

                htmlAulas += `
                    <div class="aula-item">
                        <p><strong>Matéria:</strong> ${aula.materia || 'N/A'}</p>
                        <p><strong>Professor:</strong> ${aula.professor || 'A Definir'}</p>
                        <p><strong>Horário:</strong> ${horaInicioFormatada} - ${horaFimFormatada}</p>
                        <p><strong>Turma:</strong> ${aula.turma || 'N/A'} (${aula.curso || 'N/A'})</p>
                    </div>
                `;
            });
            aulasContentDiv.innerHTML = htmlAulas;
        } else {
            // Caso a resposta seja 200 OK, mas o array de aulas esteja vazio ou não seja um array
            aulasContentDiv.innerHTML = '<p class="no-aulas-message">Nenhuma aula nesta sala hoje.</p>';
        }

    } catch (error) {
        console.error('Erro ao buscar aulas:', error);
        aulasContentDiv.innerHTML = `<p class="no-aulas-message" style="color: red;">Erro ao carregar aulas: ${error.message}</p>`;
    }
}

/**
 * Reseta o conteúdo das aulas e o nome da sala para o estado inicial.
 */
function resetarExibicaoAulas() {
    aulasContentDiv.innerHTML = '<p class="no-aulas-message">Selecione uma sala para ver as aulas.</p>';
    currentSalaNameSpan.textContent = 'Nenhum';
}

// --- Event Listeners ---

// Evento de mudança no select do andar
andarSelect.addEventListener("change", function () {
    const valorSelecionado = this.value;
    carregarESelecionarSVG(valorSelecionado);
});

// Carregar o Térreo por padrão ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
    andarSelect.value = 'terreo';
    carregarESelecionarSVG('terreo');
});