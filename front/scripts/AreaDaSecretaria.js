document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM para exibição de aulas
    const cursoSelectExibicao = document.getElementById('curso-select');
    const turmaSelectExibicao = document.getElementById('turma-select');
    const selecionarTurmaForm = document.getElementById('selecionar-turma-form');
    const tabelaAulasBody = document.querySelector('.tabela-aulas tbody');
    const nomeCursoExibido = document.getElementById('nome-curso-exibido');
    const nomeTurmaExibido = document.getElementById('nome-turma-exibido');

    // Referências aos elementos do DOM para os forms de Cadastro/Edição
    const tabCadastrar = document.getElementById('tab-cadastrar');
    const tabEditar = document.getElementById('tab-editar');
    const formCadastrarAula = document.getElementById('form-cadastrar-aula');
    const formEditarAula = document.getElementById('form-editar-aula');

    const formCadastroAula = document.querySelector('#form-cadastrar-aula .form-aula'); // Referência ao formulário de cadastro
    const formEdicaoAula = document.querySelector('#form-editar-aula .form-aula'); // Referência ao formulário de edição

    // Selects do formulário de CADASTRO
    const cadastroCursoSelect = document.getElementById('cadastro-curso');
    const cadastroTurmaSelect = document.getElementById('cadastro-turma');
    const cadastroProfessorSelect = document.getElementById('cadastro-professor');
    const cadastroMateriaSelect = document.getElementById('cadastro-materia');
    const cadastroSalaSelect = document.getElementById('cadastro-sala');
    const cadastroHorarioSelect = document.getElementById('cadastro-horario');
    const cadastroDiaSelect = document.getElementById('cadastro-dia');
    const submitCadastrarBtn = document.getElementById('submit-cadastrar');


    // Selects do formulário de EDIÇÃO
    const editarAulaIdInput = document.getElementById('editar-aula-id'); // Campo oculto para o ID da aula
    const editarCursoSelect = document.getElementById('editar-curso');
    const editarTurmaSelect = document.getElementById('editar-turma');
    const editarProfessorSelect = document.getElementById('editar-professor');
    const editarMateriaSelect = document.getElementById('editar-materia');
    const editarSalaSelect = document.getElementById('editar-sala');
    const editarHorarioSelect = document.getElementById('editar-horario');
    const editarDiaSelect = document.getElementById('editar-dia');
    const submitEditarBtn = document.getElementById('submit-editar');
    const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');


    // Mapeamento de cursos para seus nomes completos
    const nomesCursos = {
        '1': 'Geoprocessamento',
        '2': 'Desenvolvimento de Software MultiplatafoDrma',
        '3': 'Meio Ambiente e Recursos Hídricos'
    };

    // Variáveis globais para armazenar dados da API para os selects
    let todasAsTurmas = [];
    let todosOsProfessores = [];
    let todasAsMaterias = [];
    let todasAsSalas = [];
    let todosOsHorarios = [ // Horários fixos conforme sua sugestão
        { id: 1, inicio: "07:00:00", fim: "07:50:00" },
        { id: 2, inicio: "07:50:00", fim: "08:40:00" },
        { id: 3, inicio: "08:40:00", fim: "09:30:00" },
        { id: 4, inicio: "09:40:00", fim: "10:30:00" },
        { id: 5, inicio: "10:30:00", fim: "11:20:00" },
        { id: 6, inicio: "11:20:00", fim: "12:10:00" },
        { id: 7, inicio: "13:00:00", fim: "13:50:00" },
        { id: 8, inicio: "13:50:00", fim: "14:40:00" },
        { id: 9, inicio: "14:40:00", fim: "15:30:00" },
        { id: 10, inicio: "15:40:00", fim: "16:30:00" },
        { id: 11, inicio: "16:30:00", fim: "17:20:00" },
        { id: 12, inicio: "17:20:00", fim: "18:10:00" },
        { id: 13, inicio: "19:00:00", fim: "19:50:00" },
        { id: 14, inicio: "19:50:00", fim: "20:40:00" },
        { id: 15, inicio: "20:40:00", fim: "21:30:00" },
        { id: 16, inicio: "21:40:00", fim: "22:30:00" },
        { id: 17, inicio: "22:30:00", fim: "23:20:00" }
    ];

    // --- Funções para Interagir com a API ---

    /**
     * Função genérica para buscar dados da API.
     * @param {string} endpoint O caminho da API (ex: '/professores').
     * @returns {Promise<Array>} Uma promessa que resolve para um array de dados.
     */
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`http://localhost:3000/api${endpoint}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados de ${endpoint}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar dados de ${endpoint}:`, error);
            // alert(`Não foi possível carregar os dados de ${endpoint}. Verifique o servidor.`);
            return [];
        }
    }

    /**
     * Busca TODAS as turmas na API.
     * @returns {Promise<Array>} Uma promessa que resolve para um array de todas as turmas.
     */
    async function fetchTodasAsTurmas() {
        return await fetchData('/turmas');
    }

    /**
     * Busca as aulas de uma turma específica na API.
     * @param {number} turmaId O ID da turma.
     * @returns {Promise<Array>} Uma promessa que resolve para um array de aulas.
     */
    async function fetchAulasByTurmaId(turmaId) {
        try {
            const response = await fetch(`http://localhost:3000/api/public/quadro-public/${turmaId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || `Erro ao buscar aulas: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar aulas:', error);
            if (error.message.includes("Nenhuma aula cadastrada para esta turma")) {
                renderAulasTable([], `Nenhuma aula cadastrada para esta turma.`);
                return [];
            }
            alert(`Não foi possível carregar as aulas: ${error.message}`);
            return [];
        }
    }

    /**
     * Exclui uma aula específica na API usando o método DELETE.
     * @param {number} aulaId O ID da aula a ser excluída.
     * @returns {Promise<boolean>} Retorna true se a exclusão foi bem-sucedida, false caso contrário.
     */
    async function deleteAula(aulaId) {
        if (!confirm(`Tem certeza que deseja excluir a aula ID ${aulaId}?`)) {
            return false;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/aulas/${aulaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || `Erro ao excluir aula: ${response.statusText}`);
            }

            alert(`Aula ID ${aulaId} excluída com sucesso!`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir aula:', error);
            alert(`Não foi possível excluir a aula: ${error.message}`);
            return false;
        }
    }

    /**
     * Cria uma nova aula na API (Método POST).
     * @param {object} aulaData Os dados da nova aula.
     * @returns {Promise<boolean>} Retorna true se a criação foi bem-sucedida, false caso contrário.
     */
    async function criarAula(aulaData) {
        try {
            const response = await fetch('http://localhost:3000/api/aulas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aulaData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || `Erro ao criar aula: ${response.statusText}`);
            }

            alert('Aula cadastrada com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao criar aula:', error);
            alert(`Não foi possível cadastrar a aula: ${error.message}`);
            return false;
        }
    }

    /**
     * Atualiza uma aula existente na API (Método PUT).
     * @param {number} aulaId O ID da aula a ser atualizada.
     * @param {object} aulaData Os novos dados da aula.
     * @returns {Promise<boolean>} Retorna true se a atualização foi bem-sucedida, false caso contrário.
     */
    async function atualizarAula(aulaId, aulaData) {
        try {
            const response = await fetch(`http://localhost:3000/api/aulas/${aulaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aulaData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || `Erro ao atualizar aula: ${response.statusText}`);
            }

            alert('Aula atualizada com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar aula:', error);
            alert(`Não foi possível atualizar a aula: ${error.message}`);
            return false;
        }
    }

    // --- Funções para Manipulação do DOM (Exibição de Aulas) ---

    /**
     * Popula o dropdown de turmas (para exibição), filtrando as turmas com base no curso selecionado.
     * @param {string} cursoId O ID do curso selecionado.
     * @param {HTMLElement} selectElement O elemento select a ser preenchido (ex: turmaSelectExibicao).
     */
    function populateTurmasExibicao(cursoId, selectElement) {
        selectElement.innerHTML = '<option value="">Escolha uma turma</option>';
        if (!cursoId) {
            selectElement.innerHTML = '<option value="">Selecione um curso primeiro</option>';
            return;
        }
        const turmasFiltradas = todasAsTurmas.filter(turma => String(turma.curso_id) === cursoId);
        if (turmasFiltradas.length === 0) {
            selectElement.innerHTML = '<option value="">Nenhuma turma encontrada para este curso</option>';
            return;
        }
        turmasFiltradas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            selectElement.appendChild(option);
        });
    }

    /**
     * Renderiza a tabela de aulas com os dados fornecidos.
     * @param {Array} aulas Array de objetos de aula.
     * @param {string} [message] Mensagem opcional a ser exibida se não houver aulas.
     */
    function renderAulasTable(aulas, message = '') {
        tabelaAulasBody.innerHTML = ''; // Limpa o corpo da tabela

        if (aulas.length === 0) {
            const row = tabelaAulasBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 6;
            cell.textContent = message || 'Nenhuma aula encontrada para esta turma.';
            cell.classList.add('mensagem-inicial');
            return;
        }

        const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
        
        diasDaSemana.forEach(dia => {
            const aulasDoDia = aulas
                .filter(aula => aula.dia_semana === dia)
                .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

            if (aulasDoDia.length > 0) {
                aulasDoDia.forEach(aula => {
                    const row = tabelaAulasBody.insertRow();
                    row.insertCell(0).textContent = aula.dia_semana;
                    row.insertCell(1).textContent = `${aula.hora_inicio.substring(0, 5)} - ${aula.hora_fim.substring(0, 5)}`;
                    row.insertCell(2).textContent = aula.materia;
                    row.insertCell(3).textContent = aula.professor || 'a definir';
                    row.insertCell(4).textContent = aula.sala || 'a definir';

                    const actionsCell = row.insertCell(5);
                    actionsCell.classList.add('actions-cell');
                    
                    // Botão Excluir
                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('action-button', 'delete-button');
                    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    deleteButton.title = `Excluir aula ID: ${aula.id}`;
                    deleteButton.addEventListener('click', async () => {
                        const success = await deleteAula(aula.id);
                        if (success) {
                            const selectedTurmaId = turmaSelectExibicao.value;
                            if (selectedTurmaId) {
                                const aulasAtualizadas = await fetchAulasByTurmaId(selectedTurmaId);
                                renderAulasTable(aulasAtualizadas);
                            }
                        }
                    });
                    actionsCell.appendChild(deleteButton);

                    // Botão Editar (adicionado novamente para o fluxo de edição junto com cadastro)
                    const editButton = document.createElement('button');
                    editButton.classList.add('action-button', 'edit-button');
                    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
                    editButton.title = `Editar aula ID: ${aula.id}`;
                    editButton.addEventListener('click', () => {
                        preencherFormularioEdicao(aula); // Chama a função para preencher e exibir o form de edição
                        activateTab(tabEditar); // Ativa a aba de edição
                        // Rola para a seção do formulário se for fora da tela
                        formEditarAula.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    actionsCell.appendChild(editButton);
                });
            }
        });
    }

    // --- Funções para Manipulação do DOM (Cadastro/Edição de Aulas) ---

    /**
     * Ativa a aba e exibe o formulário correspondente.
     * @param {HTMLElement} selectedTab O botão da aba clicado.
     */
    function activateTab(selectedTab) {
        // Remove a classe 'active' de todos os botões de aba
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        // Adiciona a classe 'active' ao botão clicado
        selectedTab.classList.add('active');

        // Esconde todos os conteúdos de formulário
        document.querySelectorAll('.form-content').forEach(content => {
            content.classList.remove('active');
        });

        // Mostra o conteúdo do formulário correspondente
        if (selectedTab.id === 'tab-cadastrar') {
            formCadastrarAula.classList.add('active');
            formCadastroAula.reset(); // Limpa o formulário de cadastro ao ativá-lo
        } else if (selectedTab.id === 'tab-editar') {
            formEditarAula.classList.add('active');
        }
    }

    /**
     * Preenche um select HTML com opções baseadas em dados da API.
     * @param {HTMLElement} selectElement O elemento select a ser preenchido.
     * @param {Array} data Array de objetos com 'id' e 'nome' (ou 'sigla' para cursos).
     * @param {string} [valueField='id'] O nome da propriedade a ser usada como 'value'.
     * @param {string} [textField='nome'] O nome da propriedade a ser exibida como texto.
     * @param {string} [defaultOptionText='Escolha...'] Texto da opção padrão.
     * @param {string|number} [selectedValue=null] O valor a ser pré-selecionado.
     */
    function preencherSelect(selectElement, data, valueField = 'id', textField = 'nome', defaultOptionText = 'Escolha...', selectedValue = null) {
        selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`; // Limpa e adiciona a opção padrão
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            if (selectedValue !== null && String(item[valueField]) === String(selectedValue)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    /**
     * Preenche os selects de curso manualmente com a constante nomesCursos.
     * @param {HTMLElement} selectElement O elemento select de curso a ser preenchido.
     * @param {string|number} [selectedValue=null] O ID do curso a ser pré-selecionado.
     */
    function preencherCursoSelect(selectElement, selectedValue = null) {
        selectElement.innerHTML = '<option value="">Escolha um curso</option>';
        // Converte o objeto nomesCursos para um array para iterar
        Object.entries(nomesCursos).forEach(([id, nome]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nome; // Ou `id` se quiser 'DSM', 'MARH', 'GEO'
            if (selectedValue !== null && String(id) === String(selectedValue)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    /**
     * Preenche os selects de horário manualmente.
     * @param {HTMLElement} selectElement O elemento select de horário a ser preenchido.
     * @param {string|number} [selectedValue=null] O ID do horário a ser pré-selecionado.
     */
    function preencherHorariosSelect(selectElement, selectedValue = null) {
        selectElement.innerHTML = '<option value="">Escolha um horário</option>';
        todosOsHorarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario.id;
            option.textContent = `${horario.inicio.substring(0, 5)} - ${horario.fim.substring(0, 5)}`;
            if (selectedValue !== null && String(horario.id) === String(selectedValue)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    /**
     * Carrega todos os dados necessários e preenche os selects dos formulários.
     */
    async function carregarDadosSelects() {
        // Preencher os selects de curso manualmente (já definidos no HTML, mas garantimos a ordem)
        preencherCursoSelect(cadastroCursoSelect);
        preencherCursoSelect(editarCursoSelect);

        // Carregar dados das APIs
        todosOsProfessores = await fetchData('/professores');
        todasAsMaterias = await fetchData('/materias');
        todasAsSalas = await fetchData('/salas');

        // Preencher os selects com os dados carregados
        preencherSelect(cadastroProfessorSelect, todosOsProfessores, 'id', 'nome', 'Escolha um professor');
        preencherSelect(cadastroMateriaSelect, todasAsMaterias, 'id', 'nome', 'Escolha uma matéria');
        preencherSelect(cadastroSalaSelect, todasAsSalas, 'id', 'numero', 'Escolha uma sala');
        preencherHorariosSelect(cadastroHorarioSelect);

        // Preencher os selects do formulário de edição (inicialmente sem valores selecionados)
        preencherSelect(editarProfessorSelect, todosOsProfessores, 'id', 'nome', 'Escolha um professor');
        preencherSelect(editarMateriaSelect, todasAsMaterias, 'id', 'nome', 'Escolha uma matéria');
        preencherSelect(editarSalaSelect, todasAsSalas, 'id', 'numero', 'Escolha uma sala');
        preencherHorariosSelect(editarHorarioSelect);
    }

    /**
     * Preenche o formulário de edição com os dados de uma aula específica.
     * @param {object} aula O objeto de aula a ser editado.
     */
    function preencherFormularioEdicao(aula) {
        editarAulaIdInput.value = aula.id;
        
        // Preenche o curso e depois as turmas filtradas para esse curso
        preencherCursoSelect(editarCursoSelect, aula.curso_id);
        populateTurmasCadastroEdicao(String(aula.curso_id), editarTurmaSelect, aula.turma_id); // Passa o ID da turma para pré-selecionar

        preencherSelect(editarProfessorSelect, todosOsProfessores, 'id', 'nome', 'Escolha um professor', aula.professor_id);
        preencherSelect(editarMateriaSelect, todasAsMaterias, 'id', 'nome', 'Escolha uma matéria', aula.materia_id);
        preencherSelect(editarSalaSelect, todasAsSalas, 'id', 'numero', 'Escolha uma sala', aula.sala_id);
        preencherHorariosSelect(editarHorarioSelect, aula.horario_id);
        editarDiaSelect.value = aula.dia_semana; // Define o dia da semana

        activateTab(tabEditar); // Ativa a aba de edição
    }

    /**
     * Popula o dropdown de turmas para os formulários de cadastro/edição.
     * @param {string} cursoId O ID do curso selecionado.
     * @param {HTMLElement} selectElement O elemento select a ser preenchido (ex: cadastroTurmaSelect).
     * @param {string|number} [selectedValue=null] O ID da turma a ser pré-selecionado.
     */
    function populateTurmasCadastroEdicao(cursoId, selectElement, selectedValue = null) {
        selectElement.innerHTML = '<option value="">Escolha uma turma</option>';
        if (!cursoId) {
            selectElement.innerHTML = '<option value="">Selecione um curso primeiro</option>';
            return;
        }
        const turmasFiltradas = todasAsTurmas.filter(turma => String(turma.curso_id) === cursoId);
        if (turmasFiltradas.length === 0) {
            selectElement.innerHTML = '<option value="">Nenhuma turma encontrada para este curso</option>';
            return;
        }
        turmasFiltradas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = turma.nome;
            if (selectedValue !== null && String(turma.id) === String(selectedValue)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    // --- Listeners de Eventos ---

    // Listeners para as abas
    tabCadastrar.addEventListener('click', () => activateTab(tabCadastrar));
    tabEditar.addEventListener('click', () => activateTab(tabEditar));

    // Listener para o botão Cancelar Edição
    cancelarEdicaoBtn.addEventListener('click', () => {
        activateTab(tabCadastrar); // Volta para a aba de cadastro
        formEdicaoAula.reset(); // Limpa o formulário de edição
    });

    // Quando o curso é alterado no formulário de CADASTRO, popula as turmas
    cadastroCursoSelect.addEventListener('change', () => {
        const selectedCursoId = cadastroCursoSelect.value;
        populateTurmasCadastroEdicao(selectedCursoId, cadastroTurmaSelect);
    });

    // Quando o curso é alterado no formulário de EDIÇÃO, popula as turmas
    editarCursoSelect.addEventListener('change', () => {
        const selectedCursoId = editarCursoSelect.value;
        populateTurmasCadastroEdicao(selectedCursoId, editarTurmaSelect);
    });

    // Submissão do formulário de CADASTRO
    formCadastroAula.addEventListener('submit', async (event) => {
        event.preventDefault();

        const aulaData = {
            curso_id: parseInt(cadastroCursoSelect.value),
            turma_id: parseInt(cadastroTurmaSelect.value),
            professor_id: parseInt(cadastroProfessorSelect.value) || null, // Pode ser nulo
            materia_id: parseInt(cadastroMateriaSelect.value) || null, // Pode ser nulo
            sala_id: parseInt(cadastroSalaSelect.value) || null, // Pode ser nulo
            horario_id: parseInt(cadastroHorarioSelect.value),
            dia_semana: cadastroDiaSelect.value
        };

        const success = await criarAula(aulaData);
        if (success) {
            formCadastroAula.reset(); // Limpa o formulário após o sucesso
            // Opcional: recarregar a tabela de exibição de aulas se a turma estiver selecionada
            const currentTurmaExibicaoId = turmaSelectExibicao.value;
            if (currentTurmaExibicaoId && String(currentTurmaExibicaoId) === String(aulaData.turma_id)) {
                const aulasAtualizadas = await fetchAulasByTurmaId(currentTurmaExibicaoId);
                renderAulasTable(aulasAtualizadas);
            }
            // Mudar para o modo de edição para a aula recém-criada (opcional, mas pode ser útil)
            // fetch the newly created aula to pass to preencherFormularioEdicao if API supports it
        }
    });

    // Submissão do formulário de EDIÇÃO
    formEdicaoAula.addEventListener('submit', async (event) => {
        event.preventDefault();

        const aulaId = parseInt(editarAulaIdInput.value);
        const aulaData = {
            curso_id: parseInt(editarCursoSelect.value),
            turma_id: parseInt(editarTurmaSelect.value),
            professor_id: parseInt(editarProfessorSelect.value) || null,
            materia_id: parseInt(editarMateriaSelect.value) || null,
            sala_id: parseInt(editarSalaSelect.value) || null,
            horario_id: parseInt(editarHorarioSelect.value),
            dia_semana: editarDiaSelect.value
        };

        if (isNaN(aulaId)) {
            alert('ID da aula para edição não encontrado.');
            return;
        }

        const success = await atualizarAula(aulaId, aulaData);
        if (success) {
            // Após a atualização, voltar para a aba de cadastro e recarregar a grade de aulas
            activateTab(tabCadastrar);
            formEdicaoAula.reset();
            const currentTurmaExibicaoId = turmaSelectExibicao.value;
            if (currentTurmaExibicaoId && String(currentTurmaExibicaoId) === String(aulaData.turma_id)) {
                const aulasAtualizadas = await fetchAulasByTurmaId(currentTurmaExibicaoId);
                renderAulasTable(aulasAtualizadas);
            }
        }
    });

    // --- Inicialização ---
    async function initialize() {
        todasAsTurmas = await fetchTodasAsTurmas(); // Carrega todas as turmas
        await carregarDadosSelects(); // Carrega professores, matérias, salas e horários

        // Inicializa a exibição de aulas
        if (cursoSelectExibicao.value) {
            populateTurmasExibicao(cursoSelectExibicao.value, turmaSelectExibicao);
            nomeCursoExibido.textContent = nomesCursos[cursoSelectExibicao.value] || '';
        } else {
            renderAulasTable([], 'Selecione um curso e uma turma e clique em "Exibir" para ver a grade.');
        }

        // Garante que a aba de cadastro esteja ativa por padrão ao carregar a página
        activateTab(tabCadastrar);
    }

    initialize();

     // Referências aos botões de redirecionamento
    const botaoTurma = document.getElementById('botaoTurma');
    const botaoProf = document.getElementById('botaoProf');
    const botaoMate = document.getElementById('botaoMate');

    // Adiciona event listeners para redirecionamento
    if (botaoTurma) { // Verifica se o elemento existe antes de adicionar o listener
        botaoTurma.addEventListener('click', () => {
            window.location.href = 'http://localhost:3000/pages/CadastroDeTurmas.html'; // Corrigido para .html se for um arquivo
        });
    }

    if (botaoProf) {
        botaoProf.addEventListener('click', () => {
            window.location.href = 'http://localhost:3000/pages/CadastroDeProfessores.html';
        });
    }

    if (botaoMate) {
        botaoMate.addEventListener('click', () => {
            window.location.href = 'http://localhost:3000/pages/materias.html';
        });
    }
});