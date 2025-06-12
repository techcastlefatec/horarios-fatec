document.addEventListener('DOMContentLoaded', () => {
    // === Elementos para exibir aulas por turma (já existentes) ===
    const cursoSelect = document.getElementById('curso-select');
    const turmaSelect = document.getElementById('turma-select');
    const selecionarTurmaForm = document.getElementById('selecionar-turma-form');
    const tabelaAulasBody = document.querySelector('.tabela-aulas tbody');
    const nomeCursoExibido = document.getElementById('nome-curso-exibido');
    const nomeTurmaExibido = document.getElementById('nome-turma-exibido');

    let allTurmas = []; // Variável para armazenar todas as turmas
    let allProfessores = [];
    let allMaterias = [];
    let allSalas = [];

    const horarios = [ // Horários fixos
        { id: 1, inicio: "18:45:00", fim: "19:35:00" },
        { id: 2, inicio: "19:35:00", fim: "20:25:00" },
        { id: 3, inicio: "20:25:00", fim: "21:15:00" },
        { id: 4, inicio: "21:25:00", fim: "22:15:00" },
        { id: 5, inicio: "22:15:00", fim: "23:05:00" },
        { id: 6, inicio: "07:30:00", fim: "08:20:00" },
        { id: 7, inicio: "08:20:00", fim: "09:10:00" },
        { id: 8, inicio: "09:20:00", fim: "10:10:00" },
        { id: 9, inicio: "10:10:00", fim: "11:00:00" },
        { id: 10, inicio: "11:10:00", fim: "12:00:00" },
        { id: 11, inicio: "12:00:00", fim: "12:50:00" }
    ];

    // === Elementos para Cadastro/Edição de Aula ===
    const tabCadastrar = document.getElementById('tab-cadastrar');
    const tabEditar = document.getElementById('tab-editar');
    const formCadastrarAula = document.getElementById('form-cadastrar-aula');
    const formEditarAula = document.getElementById('form-editar-aula');

    const formCadastrar = document.getElementById('form-cadastrar');
    const cadastroCursoSelect = document.getElementById('cadastro-curso');
    const cadastroTurmaSelect = document.getElementById('cadastro-turma');
    const cadastroProfessorSelect = document.getElementById('cadastro-professor');
    const cadastroMateriaSelect = document.getElementById('cadastro-materia');
    const cadastroSalaSelect = document.getElementById('cadastro-sala');
    const cadastroHorarioSelect = document.getElementById('cadastro-horario');
    const cadastroDiaSelect = document.getElementById('cadastro-dia');

    const formEditar = document.getElementById('form-editar');
    const editarAulaInputId = document.getElementById('editar-aula-input-id');
    const carregarAulaButton = document.getElementById('carregar-aula');
    const editarCursoSelect = document.getElementById('editar-curso');
    const editarTurmaSelect = document.getElementById('editar-turma');
    const editarProfessorSelect = document.getElementById('editar-professor');
    const editarMateriaSelect = document.getElementById('editar-materia');
    const editarSalaSelect = document.getElementById('editar-sala');
    const editarHorarioSelect = document.getElementById('editar-horario');
    const editarDiaSelect = document.getElementById('editar-dia');
    const cancelarEdicaoButton = document.getElementById('cancelar-edicao');

    // --- Funções Auxiliares ---

    // Função genérica para buscar dados da API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao carregar dados de ${url}:`, error);
            alert(`Não foi possível carregar dados de ${url}. Tente novamente mais tarde.`);
            return [];
        }
    }

    // Função genérica para popular selects
    function populateSelect(selectElement, data, valueKey, textKey, defaultOptionText = `Escolha um(a) ${textKey.toLowerCase()}`) {
        selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[textKey];
            selectElement.appendChild(option);
        });
    }

    // Função para popular turmas filtradas (usada nos dois formulários)
    function populateFilteredTurmas(selectElement, cursoId, selectedTurmaId = null) {
        selectElement.innerHTML = '<option value="">Escolha uma turma</option>';
        if (!cursoId) return;

        const turmasFiltradas = allTurmas.filter(turma => turma.curso_id == cursoId);
        if (turmasFiltradas.length === 0) {
            const noTurmasOption = document.createElement('option');
            noTurmasOption.value = '';
            noTurmasOption.textContent = 'Nenhuma turma encontrada para este curso';
            selectElement.appendChild(noTurmasOption);
            return;
        }

        turmasFiltradas.forEach(turma => {
            const option = document.createElement('option');
            option.value = turma.id;
            option.textContent = `${turma.nome} (${turma.periodo})`;
            if (selectedTurmaId && turma.id == selectedTurmaId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    // Função para popular horários
    function populateHorarios(selectElement, selectedHorarioId = null) {
        selectElement.innerHTML = '<option value="">Escolha um horário</option>';
        horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario.id;
            option.textContent = `${horario.inicio.substring(0, 5)} - ${horario.fim.substring(0, 5)}`;
            if (selectedHorarioId && horario.id == selectedHorarioId) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    // --- MISSAO 01 (Melhorada com o que já existia) ---
    async function carregarDadosIniciais() {
        allTurmas = await fetchData('/api/turmas');
        allProfessores = await fetchData('/api/professores');
        allMaterias = await fetchData('/api/materias');
        allSalas = await fetchData('/api/salas');

        // Popula selects do formulário de CADASTRO
        populateSelect(cadastroProfessorSelect, allProfessores, 'id', 'nome', 'Escolha um professor');
        populateSelect(cadastroMateriaSelect, allMaterias, 'id', 'nome', 'Escolha uma matéria');
        populateSelect(cadastroSalaSelect, allSalas, 'id', 'nome', 'Escolha uma sala');
        populateHorarios(cadastroHorarioSelect);

        // Popula selects do formulário de EDIÇÃO
        populateSelect(editarProfessorSelect, allProfessores, 'id', 'nome', 'Escolha um professor');
        populateSelect(editarMateriaSelect, allMaterias, 'id', 'nome', 'Escolha uma matéria');
        populateSelect(editarSalaSelect, allSalas, 'id', 'nome', 'Escolha uma sala');
        populateHorarios(editarHorarioSelect);

        // Inicializa o seletor de turmas na tela principal de exibição
        const initialCursoIdPrincipal = cursoSelect.value;
        populateFilteredTurmas(turmaSelect, initialCursoIdPrincipal);
    }

    // Event listener para mudança no select de curso (Exibir Aulas)
    cursoSelect.addEventListener('change', (event) => {
        const selectedCursoId = event.target.value;
        populateFilteredTurmas(turmaSelect, selectedCursoId);
    });

    // Event listener para mudança no select de curso (Cadastrar Aula)
    cadastroCursoSelect.addEventListener('change', (event) => {
        const selectedCursoId = event.target.value;
        populateFilteredTurmas(cadastroTurmaSelect, selectedCursoId);
    });

    // Event listener para mudança no select de curso (Editar Aula)
    editarCursoSelect.addEventListener('change', (event) => {
        const selectedCursoId = event.target.value;
        populateFilteredTurmas(editarTurmaSelect, selectedCursoId);
    });

    // --- MISSAO 02 (já existente, com pequenas refatorações) ---
    selecionarTurmaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedCursoId = cursoSelect.value;
        const selectedTurmaId = turmaSelect.value;
        const selectedCursoName = cursoSelect.options[cursoSelect.selectedIndex].textContent;
        const selectedTurmaName = turmaSelect.options[turmaSelect.selectedIndex].textContent;

        if (!selectedCursoId || !selectedTurmaId) {
            alert('Por favor, selecione um curso e uma turma para exibir a grade.');
            return;
        }

        nomeCursoExibido.textContent = selectedCursoName;
        nomeTurmaExibido.textContent = selectedTurmaName;

        tabelaAulasBody.innerHTML = ''; // Limpa o corpo da tabela

        try {
            const aulas = await fetchData(`/api/public/quadro-public/${selectedTurmaId}`);

            if (aulas.length === 0) {
                const noAulasRow = document.createElement('tr');
                noAulasRow.classList.add('mensagem-inicial');
                noAulasRow.innerHTML = '<td colspan="7">Nenhuma aula encontrada para esta turma.</td>';
                tabelaAulasBody.appendChild(noAulasRow);
                return;
            }

            aulas.forEach(aula => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${aula.id}</td>
                    <td>${aula.dia_semana}</td>
                    <td>${aula.hora_inicio.substring(0, 5)} - ${aula.hora_fim.substring(0, 5)}</td>
                    <td>${aula.materia || 'N/A'}</td>
                    <td>${aula.professor || 'N/A'}</td>
                    <td>${aula.sala || 'N/A'}</td>
                    <td><button class="botao-excluir" data-id="${aula.id}"><i class="fas fa-trash-alt"></i></button></td>
                `;
                tabelaAulasBody.appendChild(row);
            });

            // Adiciona event listeners para os botões de exclusão
            document.querySelectorAll('.botao-excluir').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const aulaId = e.currentTarget.dataset.id;
                    if (confirm(`Tem certeza que deseja excluir a aula com ID ${aulaId}?`)) {
                        try {
                            const deleteResponse = await fetch(`/api/aulas/${aulaId}`, {
                                method: 'DELETE'
                            });

                            if (!deleteResponse.ok) {
                                throw new Error(`HTTP error! status: ${deleteResponse.status}`);
                            }

                            alert('Aula excluída com sucesso!');
                            // Recarregar as aulas após a exclusão
                            selecionarTurmaForm.dispatchEvent(new Event('submit'));

                        } catch (error) {
                            console.error('Erro ao excluir aula:', error);
                            alert('Erro ao excluir a aula. Tente novamente.');
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao carregar aulas:', error);
            const errorRow = document.createElement('tr');
            errorRow.classList.add('mensagem-inicial');
            errorRow.innerHTML = '<td colspan="7">Erro ao carregar as aulas. Tente novamente mais tarde.</td>';
            tabelaAulasBody.appendChild(errorRow);
        }
    });

    // --- Nova Seção: Cadastro e Edição de Aulas ---

    // Gerenciamento de Tabs
    tabCadastrar.addEventListener('click', () => {
        tabCadastrar.classList.add('active');
        tabEditar.classList.remove('active');
        formCadastrarAula.classList.add('active');
        formEditarAula.classList.remove('active');
    });

    tabEditar.addEventListener('click', () => {
        tabEditar.classList.add('active');
        tabCadastrar.classList.remove('active');
        formEditarAula.classList.add('active');
        formCadastrarAula.classList.remove('active');
    });

    // Funções para preencher o formulário de edição
    async function fillEditForm(aulaId) {
        try {
            const aula = await fetchData(`/api/aulas/${aulaId}`); // Rota para obter detalhes de uma aula específica
            if (!aula || !aula.id) {
                alert('Aula não encontrada para o ID fornecido.');
                return;
            }

            // Preenche os campos do formulário de edição
            editarAulaInputId.value = aula.id;
            editarCursoSelect.value = aula.curso_id;
            populateFilteredTurmas(editarTurmaSelect, aula.curso_id, aula.turma_id); // Popula turmas e seleciona a correta
            editarProfessorSelect.value = aula.professor_id || '';
            editarMateriaSelect.value = aula.materia_id || '';
            editarSalaSelect.value = aula.sala_id || '';
            populateHorarios(editarHorarioSelect, aula.horario_id); // Popula horários e seleciona o correto
            editarDiaSelect.value = aula.dia_semana;

        } catch (error) {
            console.error('Erro ao carregar dados da aula para edição:', error);
            alert('Não foi possível carregar os dados da aula. Verifique o ID e tente novamente.');
        }
    }

    // Event listener para o botão "Carregar Aula"
    carregarAulaButton.addEventListener('click', () => {
        const aulaId = editarAulaInputId.value;
        if (aulaId) {
            fillEditForm(aulaId);
        } else {
            alert('Por favor, digite o ID da aula para carregar.');
        }
    });

    // Event listener para o botão "Cancelar Edição"
    cancelarEdicaoButton.addEventListener('click', () => {
        formEditar.reset(); // Limpa o formulário de edição
        populateFilteredTurmas(editarTurmaSelect, ''); // Limpa as turmas
    });


    // --- Submissão do formulário de Cadastro ---
    formCadastrar.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
            curso_id: parseInt(cadastroCursoSelect.value),
            turma_id: parseInt(cadastroTurmaSelect.value),
            professor_id: cadastroProfessorSelect.value ? parseInt(cadastroProfessorSelect.value) : null,
            materia_id: cadastroMateriaSelect.value ? parseInt(cadastroMateriaSelect.value) : null,
            sala_id: cadastroSalaSelect.value ? parseInt(cadastroSalaSelect.value) : null,
            horario_id: parseInt(cadastroHorarioSelect.value),
            dia_semana: cadastroDiaSelect.value
        };

        try {
            const response = await fetch('/api/aulas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Erro ao cadastrar aula.'}`);
            }

            const result = await response.json();
            alert('Aula cadastrada com sucesso! ID: ' + result.id);
            formCadastrar.reset(); // Limpa o formulário após o sucesso
            populateFilteredTurmas(cadastroTurmaSelect, ''); // Limpa as turmas
        } catch (error) {
            console.error('Erro ao cadastrar aula:', error);
            alert('Erro ao cadastrar aula: ' + error.message);
        }
    });

    // --- Submissão do formulário de Edição ---
    formEditar.addEventListener('submit', async (event) => {
        event.preventDefault();

        const aulaId = editarAulaInputId.value;
        if (!aulaId) {
            alert('ID da aula para edição não fornecido.');
            return;
        }

        const payload = {
            curso_id: parseInt(editarCursoSelect.value),
            turma_id: parseInt(editarTurmaSelect.value),
            professor_id: editarProfessorSelect.value ? parseInt(editarProfessorSelect.value) : null,
            materia_id: editarMateriaSelect.value ? parseInt(editarMateriaSelect.value) : null,
            sala_id: editarSalaSelect.value ? parseInt(editarSalaSelect.value) : null,
            horario_id: parseInt(editarHorarioSelect.value),
            dia_semana: editarDiaSelect.value
        };

        try {
            const response = await fetch(`/api/aulas/${aulaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Erro ao atualizar aula.'}`);
            }

            const result = await response.json();
            alert('Aula atualizada com sucesso! ID: ' + result.id);
            formEditar.reset(); // Limpa o formulário após o sucesso
            populateFilteredTurmas(editarTurmaSelect, ''); // Limpa as turmas
        } catch (error) {
            console.error('Erro ao atualizar aula:', error);
            alert('Erro ao atualizar aula: ' + error.message);
        }
    });

    // --- Inicialização ---
    carregarDadosIniciais();

    // Referências aos botões de redirecionamento
    const botaoTurma = document.getElementById('botaoTurma');
    const botaoProf = document.getElementById('botaoProf');
    const botaoMate = document.getElementById('botaoMate');

    // Adiciona event listeners para redirecionamento
    if (botaoTurma) { // Verifica se o elemento existe antes de adicionar o listener
        botaoTurma.addEventListener('click', () => {
            window.location.href = '/pages/CadastroDeTurmas.html'; // Corrigido para .html se for um arquivo
        });
    }

    if (botaoProf) {
        botaoProf.addEventListener('click', () => {
            window.location.href = '/pages/CadastroDeProfessores.html';
        });
    }

    if (botaoMate) {
        botaoMate.addEventListener('click', () => {
            window.location.href = '/pages/Materias.html';
        });
    }

});