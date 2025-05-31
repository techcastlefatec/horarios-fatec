document.addEventListener('DOMContentLoaded', () => {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('curso');
    const fotoInput = document.getElementById('uploadFoto');
    const salvarBtn = document.querySelector('.form-bottom button');
    const imagensPath = 'images/professores/'; // Ajuste conforme estrutura do seu front
  
    salvarBtn.addEventListener('click', async (e) => {
      e.preventDefault();
  
      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const fotoFile = fotoInput.files[0];
  
      if (!nome || !email || !fotoFile) {
        alert('Preencha todos os campos e selecione uma imagem.');
        return;
      }
  
      // Validação de tipo de imagem
      const tiposPermitidos = ['image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(fotoFile.type)) {
        alert('Apenas imagens JPG ou PNG são permitidas.');
        return;
      }
  
      // Geração de nome único para imagem
      const timestamp = Date.now();
      const extensao = fotoFile.name.split('.').pop();
      const nomeImagem = `${nome.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.${extensao}`;
  
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('foto', nomeImagem);         // Nome do arquivo enviado ao backend
      formData.append('imagem', fotoFile);         // Arquivo em si
  
      try {
        const response = await fetch('/api/professores', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          alert('Professor cadastrado com sucesso!');
          nomeInput.value = '';
          emailInput.value = '';
          fotoInput.value = '';
          carregarProfessores(); // Atualiza a lista, se desejar implementar
        } else {
          alert('Erro ao cadastrar professor. Verifique os dados e tente novamente.');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    // Elementos do formulário
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('curso'); // se mudar no HTML, mude aqui tbm
    const fotoInput = document.getElementById('uploadFoto');
    const salvarBtn = document.querySelector('.form-bottom button');
  
    // Containers para lista e paginação
    const listaContainer = document.getElementById('listaProfessores');
    const paginacaoContainer = document.getElementById('paginacao');
  
    // Variáveis para paginação
    let professores = [];
    const professoresPorPagina = 10;
    let paginaAtual = 1;
  
    // Função para carregar professores do backend
    async function carregarProfessores() {
      try {
        const res = await fetch('/api/professores');
        if (!res.ok) throw new Error('Erro ao buscar professores');
        professores = await res.json();
        paginaAtual = 1; // resetar pagina para 1 ao recarregar lista
        exibirProfessores(paginaAtual);
        criarPaginacao();
      } catch (err) {
        listaContainer.innerHTML = '<p>Erro ao carregar professores.</p>';
        console.error(err);
      }
    }
  
    // Exibir professores da página atual
    function exibirProfessores(pagina) {
      const inicio = (pagina - 1) * professoresPorPagina;
      const fim = inicio + professoresPorPagina;
      const professoresPagina = professores.slice(inicio, fim);
  
      if (professoresPagina.length === 0) {
        listaContainer.innerHTML = '<p>Nenhum professor cadastrado.</p>';
        paginacaoContainer.innerHTML = '';
        return;
      }
  
      listaContainer.innerHTML = `
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color:#eee;">
              <th>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${professoresPagina.map(p => `
              <tr>
                <td><img src="images/professores/${p.foto}" alt="Foto de ${p.nome}" width="50" /></td>
                <td>${p.nome}</td>
                <td>${p.email}</td>
                <td><button data-id="${p.id}" class="btn-excluir">Excluir</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
  
      // Adicionar evento para os botões excluir
      document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          excluirProfessor(id);
        });
      });
    }
  
    // Criar botões de paginação
    function criarPaginacao() {
      const totalPaginas = Math.ceil(professores.length / professoresPorPagina);
      if (totalPaginas <= 1) {
        paginacaoContainer.innerHTML = '';
        return;
      }
  
      let html = '';
  
      if (paginaAtual > 1) {
        html += `<button onclick="mudarPagina(1)"><<</button> `;
        html += `<button onclick="mudarPagina(${paginaAtual - 1})"><</button> `;
      }
  
      for (let i = 1; i <= totalPaginas; i++) {
        html += `<button onclick="mudarPagina(${i})" ${i === paginaAtual ? 'disabled' : ''}>${i}</button> `;
      }
  
      if (paginaAtual < totalPaginas) {
        html += `<button onclick="mudarPagina(${paginaAtual + 1})">></button> `;
        html += `<button onclick="mudarPagina(${totalPaginas})">>></button>`;
      }
  
      paginacaoContainer.innerHTML = html;
    }
  
    // Alterar página e atualizar a exibição
    window.mudarPagina = function (pagina) {
      paginaAtual = pagina;
      exibirProfessores(paginaAtual);
      criarPaginacao();
    };
  
    // Excluir professor via API
    async function excluirProfessor(id) {
      if (!confirm('Deseja realmente excluir este professor?')) return;
  
      try {
        const res = await fetch(`/api/professores/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao excluir');
  
        alert('Professor excluído com sucesso!');
        carregarProfessores();
      } catch (err) {
        alert('Erro ao excluir professor.');
        console.error(err);
      }
    }
  
    // Enviar formulário para cadastrar novo professor
    salvarBtn.addEventListener('click', async (e) => {
      e.preventDefault();
  
      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim();
      const fotoFile = fotoInput.files[0];
  
      if (!nome || !email || !fotoFile) {
        alert('Preencha todos os campos e selecione uma imagem.');
        return;
      }
  
      const tiposPermitidos = ['image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(fotoFile.type)) {
        alert('Apenas imagens JPG ou PNG são permitidas.');
        return;
      }
  
      const timestamp = Date.now();
      const extensao = fotoFile.name.split('.').pop();
      const nomeImagem = `${nome.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.${extensao}`;
  
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('foto', nomeImagem);
      formData.append('imagem', fotoFile);
  
      try {
        const res = await fetch('/api/professores', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Erro no cadastro');
  
        alert('Professor cadastrado com sucesso!');
        nomeInput.value = '';
        emailInput.value = '';
        fotoInput.value = '';
        carregarProfessores();
      } catch (err) {
        alert('Erro ao cadastrar professor.');
        console.error(err);
      }
    });
  
    // Carrega lista ao iniciar
    carregarProfessores();
  });