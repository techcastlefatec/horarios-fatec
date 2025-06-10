// Lista de IDs a ignorar nas interações visuais e de clique
const idsIgnorados = ['null', 'null-1', 'null-2', 'null-3', 'null-4', 'null-5', 'null-6', 'null-7', 'null-8', 'null-9', 'null-10'];

// Mapeamento dos valores do select para os caminhos dos arquivos SVG
const caminhosSvg = {
    'terreo': './mapas/terreo.html',
    'primeiro': './mapas/primeiroandar.html',
    'segundo': './mapas/segundoandar.html',
};

// Referências aos elementos do DOM
const andarSelect = document.getElementById("andar");
const svgContainer = document.getElementById("svg-container");
const salaInfoDiv = document.getElementById("sala-info"); // Novo: referência para o contêiner de nome da sala
const currentSalaNameSpan = document.getElementById("current-sala-name"); // Novo: referência para o span do nome da sala
const aulasContentDiv = document.getElementById("aulas-content");

// Função assíncrona para carregar e exibir o SVG
async function carregarESelecionarSVG(andarValor) {
    const caminhoDoSvg = caminhosSvg[andarValor];

    if (!caminhoDoSvg) {
        console.error(`Caminho SVG não encontrado para o andar: ${andarValor}`);
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

        // Limpa o conteúdo das aulas e o nome da sala ao carregar um novo mapa
        aulasContentDiv.innerHTML = '<p class="no-aulas-message">Selecione uma sala para ver as aulas.</p>';
        currentSalaNameSpan.textContent = 'Nenhuma'; // Reseta o nome da sala

        // Após a inserção, aplique as interações
        aplicarInteracoes();

    } catch (error) {
        console.error('Erro ao carregar e exibir SVG:', error);
        svgContainer.innerHTML = '<p style="color: red;">Não foi possível carregar o mapa.</p>';
    }
}

// Função para aplicar interações após carregar SVG
function aplicarInteracoes() {
    const svg = svgContainer.querySelector("svg");

    if (!svg) {
        console.warn("SVG não encontrado no container para aplicar interações.");
        return;
    }

    const elementosInterativos = svg.querySelectorAll("rect, path, text");

    elementosInterativos.forEach(el => {
        const id = el.id;

        if (!id) return;

        if (el.tagName.toLowerCase() !== 'text' && !idsIgnorados.includes(id)) {
            el.classList.add("elemento-interativo");
        } else if (idsIgnorados.includes(id)) {
            el.classList.add("ignorar-interacao");
        }

        el.removeEventListener("click", handleClick);
        el.addEventListener("click", handleClick);
    });
}

// Função de callback para o evento de clique
async function handleClick(event) {
    let targetElement = event.currentTarget;
    let elementId = targetElement.id;

    if (targetElement.tagName.toLowerCase() === 'text') {
        const correspondingShape = document.getElementById(elementId);
        if (correspondingShape && (correspondingShape.tagName.toLowerCase() === 'rect' || correspondingShape.tagName.toLowerCase() === 'path')) {
            targetElement = correspondingShape;
        } else {
            return;
        }
    }

    if (idsIgnorados.includes(elementId)) {
        return;
    }

    const svg = svgContainer.querySelector("svg");
    if (!svg) return;

    svg.querySelectorAll(".elemento-selecionado").forEach(e => {
        e.classList.remove("elemento-selecionado");
    });

    if (targetElement.tagName.toLowerCase() !== 'text') {
        targetElement.classList.add("elemento-selecionado");
    }

    // Apenas para depuração, pode ser removido
    console.log("Elemento clicado com ID:", elementId);

    // Agora, faça a requisição para a API e exiba as aulas e o nome da sala
    await buscarAulasPorSala(elementId);
}

// Função para buscar aulas na API e exibir
async function buscarAulasPorSala(salaId) {
    const url = `http://localhost:3000/api/public/salas-public/${salaId}/aulas-hoje`;
    aulasContentDiv.innerHTML = '<p class="no-aulas-message">Carregando aulas...</p>'; // Mensagem de carregamento
    currentSalaNameSpan.textContent = 'Carregando...'; // Mensagem de carregamento para o nome da sala

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || 'Erro desconhecido ao buscar aulas.');
        }

        if (data.mensagem && data.mensagem === "Nenhuma aula nesta sala hoje") {
            aulasContentDiv.innerHTML = '<p class="no-aulas-message">Nenhuma aula nesta sala hoje.</p>';
            // Se não há aulas, mas a sala é reconhecida, exibe o nome se disponível.
            // Assumimos que 'data' ainda pode ter 'sala_nome' se a API retornar.
            // Se a API SEMPRE retornar 'sala_nome' mesmo sem aulas, use data.sala_nome aqui.
            // Para este caso, vamos supor que o nome da sala virá apenas quando há aulas.
            // Caso contrário, você pode precisar de um endpoint separado para obter o nome da sala pelo ID.
            // Por enquanto, vamos manter o nome da sala como 'N/A' ou o ID.
            // Melhor: Se a API retorna `sala_nome` na resposta de "Nenhuma aula", use-o.
            // Senão, uma requisição separada para o nome da sala seria ideal.
            // Para simplificar, vou tentar extrair da primeira aula se houver, ou exibir o ID.
             if (data.sala_nome) {
                currentSalaNameSpan.textContent = data.sala_nome;
            } else {
                // Se a API não retorna o nome da sala quando não há aulas,
                // poderíamos fazer outra requisição para obter o nome da sala pelo ID,
                // ou exibir o ID como fallback.
                currentSalaNameSpan.textContent = salaId; // Fallback para o ID
            }

        } else if (Array.isArray(data) && data.length > 0) {
            let htmlAulas = '';
            // Pega o nome da sala da primeira aula (assumindo que todas as aulas são da mesma sala)
            const salaNome = data[0].sala_nome || salaId; // Fallback para o ID se sala_nome não vier
            currentSalaNameSpan.textContent = salaNome;

            data.forEach(aula => {
                htmlAulas += `
                    <div class="aula-item">
                        <p><strong>Matéria:</strong> ${aula.materia}</p>
                        <p><strong>Professor:</strong> ${aula.professor}</p>
                        <p><strong>Horário:</strong> ${aula.hora_inicio.substring(0, 5)} - ${aula.hora_fim.substring(0, 5)}</p>
                        <p><strong>Turma:</strong> ${aula.turma} (${aula.curso})</p>
                    </div>
                `;
            });
            aulasContentDiv.innerHTML = htmlAulas;
        } else {
            aulasContentDiv.innerHTML = '<p class="no-aulas-message" style="color: orange;">Formato de resposta inesperado da API ou sem aulas.</p>';
            currentSalaNameSpan.textContent = 'Erro'; // Indica erro
            console.error('Formato de resposta inesperado ou array vazio:', data);
        }

    } catch (error) {
        console.error('Erro ao buscar aulas:', error);
        aulasContentDiv.innerHTML = `<p class="no-aulas-message" style="color: red;">Erro ao carregar aulas: ${error.message}</p>`;
        currentSalaNameSpan.textContent = 'Erro'; // Indica erro
    }
}

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