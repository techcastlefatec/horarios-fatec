// URL base da API para as turmas
const API_URL = '/api/turmas';

// Espera o carregamento completo do DOM antes de executar os scripts
document.addEventListener('DOMContentLoaded', () => {
  carregarTurmas(); // Carrega a lista de turmas ao iniciar a página

  // Associa o envio do formulário de cadastro à função de cadastrar nova turma
  document.getElementById('formCadastro').addEventListener('submit', cadastrarTurma);

  // Associa o envio do formulário de atualização à função de atualizar turma existente
  document.getElementById('formAtualizar').addEventListener('submit', atualizarTurma);
});

/** ============================================
 * CRUD - CREATE: Cadastrar nova turma
 * Esta função envia os dados do formulário para o servidor
 * e cria uma nova turma no banco de dados.
 ==============================================*/
async function cadastrarTurma(e) {
  e.preventDefault(); // Impede o envio tradicional do formulário

  // Coleta os valores digitados no formulário
  const nome = document.getElementById('nome').value;
  const periodo = document.getElementById('periodo').value;
  const curso_id = document.getElementById('curso_id').value;

  // Envia os dados para a API usando o método POST
  await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nome, periodo, curso_id })
  });

  // Limpa o formulário e recarrega a lista de turmas
  document.getElementById('formCadastro').reset();
  carregarTurmas();
}

/** ============================================
 * CRUD - READ: Carregar todas as turmas
 * Esta função busca na API todas as turmas cadastradas
 * e exibe os dados em uma tabela HTML.
 ==============================================*/
async function carregarTurmas() {
  const res = await fetch(API_URL); // Faz requisição GET para buscar as turmas
  const turmas = await res.json();  // Converte a resposta para JSON

  const tbody = document.getElementById('listaTurmas');
  tbody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

  // Itera sobre cada turma e cria uma linha na tabela
  turmas.forEach(turma => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${turma.id}</td>
      <td>${turma.nome}</td>
      <td>${turma.periodo}</td>
      <td>${turma.curso_id}</td>
      <td>
        <button onclick="prepararEdicao(${turma.id})">✏️ Editar</button>
        <button onclick="excluirTurma(${turma.id})" class="delete">🗑️ Excluir</button>
      </td>
    `;

    tbody.appendChild(tr); // Adiciona a linha na tabela
  });
}

/** ============================================
 * CRUD - UPDATE: Preencher formulário de edição
 * Esta função busca os dados da turma pelo ID
 * e preenche o formulário para edição.
 ==============================================*/
async function prepararEdicao(id) {
  const res = await fetch(`${API_URL}/${id}`); // Busca os dados da turma
  const turma = await res.json(); // Converte a resposta para objeto JS

  // Preenche os campos do formulário de edição com os dados da turma
  document.getElementById('edit_id').value = turma.id;
  document.getElementById('edit_nome').value = turma.nome;
  document.getElementById('edit_periodo').value = turma.periodo;
  document.getElementById('edit_curso_id').value = turma.curso_id;

  // Exibe o formulário de atualização e rola a tela até ele
  document.getElementById('updateSection').style.display = 'block';
  window.scrollTo(0, document.body.scrollHeight); // Rola até o final da página
}

/** ============================================
 * CRUD - UPDATE: Enviar dados atualizados
 * Esta função envia os dados editados para a API
 * e atualiza a turma no banco de dados.
 ==============================================*/
async function atualizarTurma(e) {
  e.preventDefault(); // Impede o envio tradicional do formulário

  // Coleta os dados atualizados do formulário
  const id = document.getElementById('edit_id').value;
  const nome = document.getElementById('edit_nome').value;
  const periodo = document.getElementById('edit_periodo').value;
  const curso_id = parseInt(document.getElementById('edit_curso_id').value);

  // Envia os dados atualizados via PUT
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ id, nome, periodo, curso_id })
  });

  // Limpa o formulário, oculta a seção de edição e atualiza a tabela
  document.getElementById('formAtualizar').reset();
  document.getElementById('updateSection').style.display = 'none';
  carregarTurmas();
}

/** ============================================
 * CRUD - DELETE: Excluir turma
 * Esta função pergunta ao usuário se deseja excluir a turma
 * e envia uma requisição DELETE para a API.
 ==============================================*/
async function excluirTurma(id) {
  if (confirm('Tem certeza que deseja excluir esta turma?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarTurmas(); // Recarrega a tabela após a exclusão
  }
}

/** ============================================
 * Cancelar edição
 * Esta função limpa e esconde o formulário de atualização
 * caso o usuário decida não continuar a edição.
 ==============================================*/
function cancelarEdicao() {
  document.getElementById('formAtualizar').reset();
  document.getElementById('updateSection').style.display = 'none';
}
