// URL base da API para os professores
const API_URL = '/api/professores'; // Certifique-se de que seu backend use este prefixo ou ajuste-o.

// Elemento para exibir mensagens de feedback ao usuário
const mensagemFeedback = document.getElementById('mensagem-feedback');

// Espera o carregamento completo do DOM antes de executar os scripts
document.addEventListener('DOMContentLoaded', () => {
  carregarProfessores(); // Carrega a lista de professores ao iniciar a página

  // Associa o envio do formulário de cadastro à função de cadastrar novo professor
  document.getElementById('formCadastro').addEventListener('submit', cadastrarProfessor);
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
 * CRUD - CREATE: Cadastrar novo professor
 * Esta função envia os dados do formulário (incluindo o arquivo da foto)
 * para o servidor e cria um novo professor no banco de dados.
 ==============================================*/
async function cadastrarProfessor(e) {
  e.preventDefault(); // Impede o envio tradicional do formulário

  // Coleta os valores digitados no formulário
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const fotoInput = document.getElementById('foto');
  const fotoFile = fotoInput.files[0]; // Pega o arquivo selecionado, se houver

  // Validação básica no front-end
  if (!nome) {
    exibirMensagem('O nome do professor é obrigatório.', 'erro');
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Validação simples de email
    exibirMensagem('Por favor, insira um formato de email válido.', 'erro');
    return;
  }

  // Cria um objeto FormData para enviar dados mistos (texto + arquivo)
  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('email', email);
  
  // Adiciona o arquivo de foto apenas se um arquivo foi selecionado
  if (fotoFile) {
    formData.append('foto', fotoFile); // 'foto' é o nome do campo que o Multer no backend vai esperar
  } else {
    // Se nenhum arquivo foi selecionado, podemos enviar uma string indicando para usar o padrão do banco.
    // O backend precisará interpretar isso ou o banco de dados lidará com o default.
    // Para clareza, vamos enviar uma string vazia e deixar o backend ou DB lidar com o default.
    // OU, se você tiver um comportamento específico para o 'default.png' no frontend, pode ser incluído aqui.
    // Por exemplo, formData.append('foto', 'default'); e o backend interpreta isso.
    // Para este exemplo, assumimos que o backend verá a ausência do arquivo 'foto' no formData
    // e aplicará o default, ou que você enviará um placeholder se quiser forçar o default.
    // formData.append('foto_filename', 'default.png'); // Alternativa para sinalizar o default
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      // IMPORTANTE: NÃO defina 'Content-Type' para FormData. O navegador faz isso.
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json(); // Tenta ler erro JSON do backend
      throw new Error(errorData.message || 'Erro ao cadastrar professor. Verifique o servidor.');
    }

    exibirMensagem('Professor cadastrado com sucesso!', 'sucesso');
    document.getElementById('formCadastro').reset(); // Limpa o formulário
    carregarProfessores(); // Recarrega a lista de professores
  } catch (error) {
    console.error('Erro ao cadastrar professor:', error);
    exibirMensagem(`Erro ao cadastrar professor: ${error.message}`, 'erro');
  }
}

/** ============================================
 * CRUD - READ: Carregar todos os professores
 * Esta função busca na API todos os professores cadastrados
 * e exibe os dados em uma tabela HTML.
 ==============================================*/
async function carregarProfessores() {
  const tbody = document.getElementById('listaProfessores');
  tbody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

  try {
    const res = await fetch(API_URL); // Faz requisição GET para buscar os professores
    if (!res.ok) {
      throw new Error('Erro ao carregar professores.');
    }
    const professores = await res.json(); // Converte a resposta para JSON

    // Itera sobre cada professor e cria uma linha na tabela
    professores.forEach(professor => {
      const tr = document.createElement('tr');
      tr.dataset.id = professor.id; // Armazena o ID do professor no elemento <tr>
      // Armazena o nome da foto atual para uso na edição (se não houver novo upload)
      tr.dataset.currentFoto = professor.foto || 'default.png'; 

      // URL base para as imagens de perfil (ajuste conforme a sua estrutura de pastas no servidor)
      // Exemplo: se suas fotos estiverem em 'public/images/professores/', o caminho seria /images/professores/
      const fotoFilename = professor.foto && professor.foto !== 'default.png' ? professor.foto : 'default.png';
      const fotoUrl = `/images/professores/${fotoFilename}`;
      
      tr.innerHTML = `
        <td>${professor.id}</td>
        <td data-field="nome">${professor.nome}</td>
        <td data-field="email">${professor.email || 'N/A'}</td>
        <td data-field="foto">
            <img src="${fotoUrl}" alt="Foto de ${professor.nome}" class="professor-foto"
                 onerror="this.onerror=null; this.src='https://placehold.co/50x50/cccccc/333333?text=N/A';" />
            <!-- onerror para fallback se a imagem não carregar -->
        </td>
        <td class="acoes-celula">
          <button onclick="iniciarEdicao(this)" class="edit-btn">✏️ Editar</button>
          <button onclick="excluirProfessor(${professor.id})" class="delete-btn">🗑️ Excluir</button>
        </td>
      `;
      tbody.appendChild(tr); // Adiciona a linha na tabela
    });

    if (professores.length === 0) {
      exibirMensagem('Nenhum professor cadastrado ainda.', 'info');
    }

  } catch (error) {
    console.error('Erro ao carregar professores:', error);
    exibirMensagem(`Erro ao carregar professores: ${error.message}`, 'erro');
  }
}

/** ============================================
 * CRUD - UPDATE: Iniciar edição inline
 * Esta função transforma a linha da tabela em campos editáveis,
 * incluindo uma opção de upload de arquivo para a foto.
 * @param {HTMLButtonElement} button O botão "Editar" clicado.
 ==============================================*/
async function iniciarEdicao(button) {
  const tr = button.closest('tr'); // Encontra a linha (<tr>) pai do botão
  const professorId = tr.dataset.id; // Pega o ID do professor

  // Impede que múltiplas linhas sejam editadas simultaneamente
  if (document.querySelector('tr.editing')) {
    exibirMensagem('Já existe uma linha em edição. Salve ou cancele antes de editar outra.', 'info');
    return;
  }

  tr.classList.add('editing'); // Adiciona classe para estilização e controle de estado

  // Busca os dados do professor para garantir que temos os valores mais recentes
  try {
    const res = await fetch(`${API_URL}/${professorId}`);
    if (!res.ok) {
      throw new Error('Erro ao buscar dados do professor para edição.');
    }
    const professor = await res.json();

    // Transforma as células em campos de input
    tr.querySelector('[data-field="nome"]').innerHTML = `<input type="text" value="${professor.nome}" class="editable-input" />`;
    tr.querySelector('[data-field="email"]').innerHTML = `<input type="email" value="${professor.email || ''}" class="editable-input" />`;
    
    // Para a foto: exibe a imagem atual e um input file para selecionar nova foto
    // O input file não pode ter um valor padrão de arquivo, então ele sempre começa vazio.
    // O dataset.currentFoto da <tr> irá guardar o nome da foto atual para o caso de não haver upload de uma nova.
    const currentFotoFilename = tr.dataset.currentFoto;
    tr.querySelector('[data-field="foto"]').innerHTML = `
        <img src="/images/professores/${currentFotoFilename}" alt="Foto Atual" class="professor-foto-edit-preview"
             onerror="this.onerror=null; this.src='https://placehold.co/50x50/cccccc/333333?text=N/A';">
        <input type="file" class="editable-input editable-file-input" accept="image/*" />
        <small>Mantenha vazio para não alterar a foto.</small>
    `;

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
    carregarProfessores(); // Recarrega para restaurar a linha
  }
}

/** ============================================
 * CRUD - UPDATE: Salvar edição inline
 * Esta função coleta os dados dos campos editáveis
 * (incluindo o arquivo de foto, se alterado) e envia para a API para atualização.
 * @param {HTMLButtonElement} button O botão "Salvar" clicado.
 ==============================================*/
async function salvarEdicao(button) {
  const tr = button.closest('tr');
  const professorId = tr.dataset.id;

  // Coleta os valores dos inputs da linha
  const nome = tr.querySelector('[data-field="nome"] input').value.trim();
  const email = tr.querySelector('[data-field="email"] input').value.trim();
  const fotoInput = tr.querySelector('[data-field="foto"] input[type="file"]');
  const fotoFile = fotoInput.files[0]; // O novo arquivo selecionado, se houver
  const currentFotoFilename = tr.dataset.currentFoto; // O nome da foto atual no banco

  // Validação simples
  if (!nome) {
    exibirMensagem('O nome do professor é obrigatório para salvar.', 'erro');
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    exibirMensagem('Por favor, insira um formato de email válido para salvar.', 'erro');
    return;
  }

  // Cria FormData para enviar dados mistos (texto + arquivo)
  const formData = new FormData();
  formData.append('id', professorId); // Envia o ID para a rota PUT
  formData.append('nome', nome);
  formData.append('email', email);
  
  if (fotoFile) {
    formData.append('foto', fotoFile); // Novo arquivo para upload
  } else {
    // Se nenhum novo arquivo foi selecionado, envia o nome da foto atual para o backend manter
    formData.append('foto_filename_current', currentFotoFilename); 
  }

  try {
    const response = await fetch(`${API_URL}/${professorId}`, {
      method: 'PUT',
      // IMPORTANTE: NÃO defina 'Content-Type' para FormData. O navegador faz isso.
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar professor. Verifique o servidor.');
    }

    exibirMensagem('Professor atualizado com sucesso!', 'sucesso');
    tr.classList.remove('editing'); // Remove a classe de edição
    carregarProfessores(); // Recarrega a tabela para exibir os dados atualizados
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
  carregarProfessores(); // Simplesmente recarrega a tabela para descartar as mudanças não salvas
}

/** ============================================
 * CRUD - DELETE: Excluir professor
 * Esta função pergunta ao usuário se deseja excluir o professor
 * e envia uma requisição DELETE para a API.
 * @param {number} id O ID do professor a ser excluído.
 ==============================================*/
async function excluirProfessor(id) {
  // Use window.confirm para este exemplo, mas idealmente, substitua por um modal customizado.
  if (window.confirm('Tem certeza que deseja excluir este professor?')) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao excluir professor.');
      }
      exibirMensagem('Professor excluído com sucesso!', 'sucesso');
      carregarProfessores(); // Recarrega a tabela após a exclusão
    } catch (error) {
      console.error('Erro ao excluir professor:', error);
      exibirMensagem(`Erro ao excluir professor: ${error.message}`, 'erro');
    }
  }
}