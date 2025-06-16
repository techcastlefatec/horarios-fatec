// URL base da API para as turmas
const API_URL = '/api/turmas'; // Certifique-se de que seu backend use este prefixo ou ajuste-o.

// Mapeamento de IDs de curso para suas siglas
const cursoSiglas = {
  1: 'GEO', // Exemplo: Adicione as siglas corretas para seus cursos
  2: 'DSM',
  3: 'MARH',
  // Adicione mais mapeamentos conforme necessário
};

// Elemento para exibir mensagens de feedback ao usuário
const mensagemFeedback = document.getElementById('mensagem-feedback');

// Espera o carregamento completo do DOM antes de executar os scripts
document.addEventListener('DOMContentLoaded', () => {
  carregarTurmas(); // Carrega a lista de turmas ao iniciar a página

  // Associa o envio do formulário de cadastro à função de cadastrar nova turma
  document.getElementById('formCadastro').addEventListener('submit', cadastrarTurma);
});

/**
 * Exibe uma mensagem de feedback para o usuário.
 * @param {string} mensagem O texto da mensagem.
 * @param {string} tipo O tipo da mensagem ('sucesso', 'erro', 'info').
 */
function exibirMensagem(mensagem, tipo) {
  mensagemFeedback.textContent = mensagem;
  mensagemFeedback.className = 'mensagem ' + tipo; // Adiciona classe para estilização
  setTimeout(() => {
    mensagemFeedback.textContent = '';
    mensagemFeedback.className = 'mensagem';
  }, 5000); // Remove a mensagem após 5 segundos
}

/** ============================================
 * CRUD - CREATE: Cadastrar nova turma
 * Esta função envia os dados do formulário para o servidor
 * e cria uma nova turma no banco de dados.
 ==============================================*/
async function cadastrarTurma(e) {
  e.preventDefault(); // Impede o envio tradicional do formulário

  // Coleta os valores digitados no formulário
  const nome = document.getElementById('nome').value.trim();
  const periodo = document.getElementById('periodo').value.trim();
  const curso_id = parseInt(document.getElementById('curso_id').value);

  // Validação básica no front-end
  if (!nome || !periodo || isNaN(curso_id)) {
    exibirMensagem('Preencha todos os campos obrigatórios (Nome, Período, ID do Curso válido).', 'erro');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, periodo, curso_id })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao cadastrar turma.');
    }

    exibirMensagem('Turma cadastrada com sucesso!', 'sucesso');
    document.getElementById('formCadastro').reset(); // Limpa o formulário
    carregarTurmas(); // Recarrega a lista de turmas
  } catch (error) {
    console.error('Erro ao cadastrar turma:', error);
    exibirMensagem(`Erro ao cadastrar turma: ${error.message}`, 'erro');
  }
}

/** ============================================
 * CRUD - READ: Carregar todas as turmas
 * Esta função busca na API todas as turmas cadastradas
 * e exibe os dados em uma tabela HTML.
 ==============================================*/
async function carregarTurmas() {
  try {
    const res = await fetch(API_URL); // Faz requisição GET para buscar as turmas
    if (!res.ok) {
      throw new Error('Erro ao carregar turmas.');
    }
    const turmas = await res.json(); // Converte a resposta para JSON

    const tbody = document.getElementById('listaTurmas');
    tbody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

    // Itera sobre cada turma e cria uma linha na tabela
    turmas.forEach(turma => {
      const tr = document.createElement('tr');
      tr.dataset.id = turma.id; // Armazena o ID da turma no elemento <tr>

      // Renderiza a linha com os dados da turma
      tr.innerHTML = `
        <td>${turma.id}</td>
        <td data-field="nome">${turma.nome}</td>
        <td data-field="periodo">${turma.periodo}</td>
        <td data-field="curso_id">${turma.curso_id}</td>
        <td>${cursoSiglas[turma.curso_id] || '---'}</td>
        <td class="acoes-celula">
          <button onclick="iniciarEdicao(this)" class="edit-btn">✏️ Editar</button>
          <button onclick="excluirTurma(${turma.id})" class="delete-btn">🗑️ Excluir</button>
        </td>
      `;
      tbody.appendChild(tr); // Adiciona a linha na tabela
    });
  } catch (error) {
    console.error('Erro ao carregar turmas:', error);
    exibirMensagem(`Erro ao carregar turmas: ${error.message}`, 'erro');
  }
}

/** ============================================
 * CRUD - UPDATE: Iniciar edição inline
 * Esta função transforma a linha da tabela em campos editáveis.
 * @param {HTMLButtonElement} button O botão "Editar" clicado.
 ==============================================*/
async function iniciarEdicao(button) {
  const tr = button.closest('tr'); // Encontra a linha (<tr>) pai do botão
  const turmaId = tr.dataset.id; // Pega o ID da turma

  // Impede que múltiplas linhas sejam editadas simultaneamente
  if (document.querySelector('tr.editing')) {
    exibirMensagem('Já existe uma linha em edição. Salve ou cancele antes de editar outra.', 'info');
    return;
  }

  tr.classList.add('editing'); // Adiciona classe para estilização e controle de estado

  // Busca os dados da turma para garantir que temos os valores mais recentes
  try {
    const res = await fetch(`${API_URL}/${turmaId}`);
    if (!res.ok) {
      throw new Error('Erro ao buscar dados da turma para edição.');
    }
    const turma = await res.json();

    // Transforma as células em campos de input
    tr.querySelector('[data-field="nome"]').innerHTML = `<input type="text" value="${turma.nome}" class="editable-input" />`;
    tr.querySelector('[data-field="periodo"]').innerHTML = `<input type="text" value="${turma.periodo}" class="editable-input" />`;
    tr.querySelector('[data-field="curso_id"]').innerHTML = `<input type="number" value="${turma.curso_id}" class="editable-input" />`;

    // Altera os botões na célula de ações
    const acoesCelulas = tr.querySelector('.acoes-celula');
    acoesCelulas.innerHTML = `
      <button onclick="salvarEdicao(this)" class="save-btn">✅ Salvar</button>
      <button onclick="cancelarEdicaoInline(this)" class="cancel-btn">❌ Cancelar</button>
    `;
  } catch (error) {
    console.error('Erro ao iniciar edição:', error);
    exibirMensagem(`Erro ao iniciar edição: ${error.message}`, 'erro');
    tr.classList.remove('editing'); // Remove a classe de edição em caso de erro
    carregarTurmas(); // Recarrega para restaurar a linha
  }
}

/** ============================================
 * CRUD - UPDATE: Salvar edição inline
 * Esta função coleta os dados dos campos editáveis
 * e envia para a API para atualização.
 * @param {HTMLButtonElement} button O botão "Salvar" clicado.
 ==============================================*/
async function salvarEdicao(button) {
  const tr = button.closest('tr');
  const turmaId = tr.dataset.id;

  // Coleta os valores dos inputs da linha
  const nome = tr.querySelector('[data-field="nome"] input').value.trim();
  const periodo = tr.querySelector('[data-field="periodo"] input').value.trim();
  const curso_id = parseInt(tr.querySelector('[data-field="curso_id"] input').value);

  // Validação simples
  if (!nome || !periodo || isNaN(curso_id)) {
    exibirMensagem('Preencha todos os campos obrigatórios para salvar.', 'erro');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${turmaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: turmaId, nome, periodo, curso_id })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar turma.');
    }

    exibirMensagem('Turma atualizada com sucesso!', 'sucesso');
    tr.classList.remove('editing'); // Remove a classe de edição
    carregarTurmas(); // Recarrega a tabela para exibir os dados atualizados
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    exibirMensagem(`Erro ao salvar edição: ${error.message}`, 'erro');
  }
}

/** ============================================
 * Cancelar edição inline
 * Esta função reverte a linha da tabela ao estado de exibição.
 * @param {HTMLButtonElement} button O botão "Cancelar" clicado.
 ==============================================*/
async function cancelarEdicaoInline(button) {
  const tr = button.closest('tr');
  tr.classList.remove('editing'); // Remove a classe de edição
  carregarTurmas(); // Simplesmente recarrega a tabela para descartar as mudanças não salvas
}

/** ============================================
 * CRUD - DELETE: Excluir turma
 * Esta função pergunta ao usuário se deseja excluir a turma
 * e envia uma requisição DELETE para a API.
 * @param {number} id O ID da turma a ser excluída.
 ==============================================*/
async function excluirTurma(id) {
  // Substituí o 'confirm' nativo por uma lógica de modal customizável,
  // pois 'confirm' não funciona em alguns ambientes ou é considerado má prática em UX.
  // Para simplificar, neste exemplo, vamos simular a confirmação.
  // Em uma aplicação real, você usaria um modal HTML/CSS/JS para isso.

  if (window.confirm('Tem certeza que deseja excluir esta turma?')) { // Use window.confirm para este exemplo
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir turma.');
      }
      exibirMensagem('Turma excluída com sucesso!', 'sucesso');
      carregarTurmas(); // Recarrega a tabela após a exclusão
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      exibirMensagem(`Erro ao excluir turma: ${error.message}`, 'erro');
    }
  }
}