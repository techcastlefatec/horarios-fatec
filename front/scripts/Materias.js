// URL base da API para as matérias
const API_URL = '/api/materias'; // Certifique-se de que seu backend use este prefixo ou ajuste-o.

// Elemento para exibir mensagens de feedback ao usuário
const mensagemFeedback = document.getElementById('mensagem-feedback');

// Espera o carregamento completo do DOM antes de executar os scripts
document.addEventListener('DOMContentLoaded', () => {
  carregarMaterias(); // Carrega a lista de matérias ao iniciar a página

  // Associa o envio do formulário de cadastro à função de cadastrar nova matéria
  document.getElementById('formCadastro').addEventListener('submit', cadastrarMateria);
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
 * CRUD - CREATE: Cadastrar nova matéria
 * Esta função envia os dados do formulário para o servidor
 * e cria uma nova matéria no banco de dados.
 ==============================================*/
async function cadastrarMateria(e) {
  e.preventDefault(); // Impede o envio tradicional do formulário

  // Coleta os valores digitados no formulário
  const nome = document.getElementById('nome').value.trim();
  const carga = document.getElementById('carga').value.trim();

  // Validação básica no front-end
  if (!nome) {
    exibirMensagem('O nome da matéria é obrigatório.', 'erro');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, carga })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao cadastrar matéria.');
    }

    exibirMensagem('Matéria cadastrada com sucesso!', 'sucesso');
    document.getElementById('formCadastro').reset(); // Limpa o formulário
    carregarMaterias(); // Recarrega a lista de matérias
  } catch (error) {
    console.error('Erro ao cadastrar matéria:', error);
    exibirMensagem(`Erro ao cadastrar matéria: ${error.message}`, 'erro');
  }
}

/** ============================================
 * CRUD - READ: Carregar todas as matérias
 * Esta função busca na API todas as matérias cadastradas
 * e exibe os dados em uma tabela HTML.
 ==============================================*/
async function carregarMaterias() {
  const tbody = document.getElementById('listaMaterias');
  tbody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

  try {
    const res = await fetch(API_URL); // Faz requisição GET para buscar as matérias
    if (!res.ok) {
      throw new Error('Erro ao carregar matérias.');
    }
    const materias = await res.json(); // Converte a resposta para JSON

    // Itera sobre cada matéria e cria uma linha na tabela
    materias.forEach(materia => {
      const tr = document.createElement('tr');
      tr.dataset.id = materia.id; // Armazena o ID da matéria no elemento <tr>

      // Renderiza a linha com os dados da matéria
      tr.innerHTML = `
        <td>${materia.id}</td>
        <td data-field="nome">${materia.nome}</td>
        <td data-field="carga">${materia.carga || 'N/A'}</td>
        <td class="acoes-celula">
          <button onclick="iniciarEdicaoMateria(this)" class="edit-btn">✏️ Editar</button>
          <button onclick="excluirMateria(${materia.id})" class="delete-btn">🗑️ Excluir</button>
        </td>
      `;
      tbody.appendChild(tr); // Adiciona a linha na tabela
    });

    if (materias.length === 0) {
      exibirMensagem('Nenhuma matéria cadastrada ainda.', 'info');
    }

  } catch (error) {
    console.error('Erro ao carregar matérias:', error);
    exibirMensagem(`Erro ao carregar matérias: ${error.message}`, 'erro');
  }
}

/** ============================================
 * CRUD - UPDATE: Iniciar edição inline
 * Esta função transforma a linha da tabela em campos editáveis.
 * @param {HTMLButtonElement} button O botão "Editar" clicado.
 ==============================================*/
async function iniciarEdicaoMateria(button) {
  const tr = button.closest('tr'); // Encontra a linha (<tr>) pai do botão
  const materiaId = tr.dataset.id; // Pega o ID da matéria

  // Impede que múltiplas linhas sejam editadas simultaneamente
  if (document.querySelector('tr.editing')) {
    exibirMensagem('Já existe uma linha em edição. Salve ou cancele antes de editar outra.', 'info');
    return;
  }

  tr.classList.add('editing'); // Adiciona classe para estilização e controle de estado

  // Busca os dados da matéria para garantir que temos os valores mais recentes
  try {
    const res = await fetch(`${API_URL}/${materiaId}`);
    if (!res.ok) {
      throw new Error('Erro ao buscar dados da matéria para edição.');
    }
    const materia = await res.json();

    // Transforma as células em campos de input
    tr.querySelector('[data-field="nome"]').innerHTML = `<input type="text" value="${materia.nome}" class="editable-input" />`;
    tr.querySelector('[data-field="carga"]').innerHTML = `<input type="text" value="${materia.carga || ''}" class="editable-input" />`;
    
    // Altera os botões na célula de ações
    const acoesCelulas = tr.querySelector('.acoes-celula');
    acoesCelulas.innerHTML = `
      <button onclick="salvarEdicaoMateria(this)" class="save-btn">✅ Salvar</button>
      <button onclick="cancelarEdicaoInline(this)" class="cancel-btn">❌ Cancelar</button>
    `;
  } catch (error) {
    console.error('Erro ao iniciar edição:', error);
    exibirMensagem(`Erro ao iniciar edição: ${error.message}`, 'erro');
    tr.classList.remove('editing'); // Remove a classe de edição em caso de erro
    carregarMaterias(); // Recarrega para restaurar a linha
  }
}

/** ============================================
 * CRUD - UPDATE: Salvar edição inline
 * Esta função coleta os dados dos campos editáveis
 * e envia para a API para atualização.
 * @param {HTMLButtonElement} button O botão "Salvar" clicado.
 ==============================================*/
async function salvarEdicaoMateria(button) {
  const tr = button.closest('tr');
  const materiaId = tr.dataset.id;

  // Coleta os valores dos inputs da linha
  const nome = tr.querySelector('[data-field="nome"] input').value.trim();
  const carga = tr.querySelector('[data-field="carga"] input').value.trim();

  // Validação simples
  if (!nome) {
    exibirMensagem('O nome da matéria é obrigatório para salvar.', 'erro');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${materiaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: materiaId, nome, carga })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar matéria.');
    }

    exibirMensagem('Matéria atualizada com sucesso!', 'sucesso');
    tr.classList.remove('editing'); // Remove a classe de edição
    carregarMaterias(); // Recarrega a tabela para exibir os dados atualizados
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
  carregarMaterias(); // Simplesmente recarrega a tabela para descartar as mudanças não salvas
}

/** ============================================
 * CRUD - DELETE: Excluir matéria
 * Esta função pergunta ao usuário se deseja excluir a matéria
 * e envia uma requisição DELETE para a API.
 * @param {number} id O ID da matéria a ser excluída.
 ==============================================*/
async function excluirMateria(id) {
  // Use window.confirm para este exemplo, mas idealmente, substitua por um modal customizado.
  if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir matéria.');
      }
      exibirMensagem('Matéria excluída com sucesso!', 'sucesso');
      carregarMaterias(); // Recarrega a tabela após a exclusão
    } catch (error) {
      console.error('Erro ao excluir matéria:', error);
      exibirMensagem(`Erro ao excluir matéria: ${error.message}`, 'erro');
    }
  }
}