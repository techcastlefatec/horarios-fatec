const form = document.getElementById('formProfessor');
const lista = document.getElementById('listaProfessores');
let professores = [];
let paginaAtual = 1;
const porPagina = 10;

let modoEdicao = false;
let idEdicao = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const file = form.foto.files[0];

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('email', email);

  if (file) {
    const extensao = file.name.split('.').pop();
    const nomeFormatado = nome.toLowerCase().replace(/\s+/g, '_');
    const nomeArquivo = `${nomeFormatado}_${Date.now()}.${extensao}`;
    formData.append('foto', file, nomeArquivo);
    formData.append('fotoNome', nomeArquivo);
  }

  try {
    let res;
    if (modoEdicao && idEdicao !== null) {
      res = await fetch(`http://localhost:3000/api/professores/${idEdicao}`, {
        method: 'PUT',
        body: formData
      });

      if (res.ok) {
        alert('Professor atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar professor.');
      }
    } else {
      res = await fetch('http://localhost:3000/api/professores', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Professor cadastrado com sucesso!');
      } else {
        alert('Erro ao cadastrar professor.');
      }
    }

    form.reset();
    form.querySelector('button[type="submit"]').textContent = 'Salvar';
    modoEdicao = false;
    idEdicao = null;

    carregarProfessores();
  } catch (err) {
    console.error('Erro:', err);
    alert('Erro na requisição.');
  }
});

async function carregarProfessores() {
  try {
    const res = await fetch('http://localhost:3000/api/professores');
    professores = await res.json();
    exibirProfessores();
  } catch (err) {
    console.error(err);
  }
}

function exibirProfessores() {
  lista.innerHTML = '';
  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;
  const page = professores.slice(inicio, fim);

  for (const p of page) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nome}</td>
      <td>${p.email}</td>
      <td>
        <button onclick="editarProfessor(${p.id})">Editar</button>
        <button onclick="excluirProfessor(${p.id})">Excluir</button>
      </td>
    `;
    lista.appendChild(tr);
  }

  gerarPaginacao();
}

function gerarPaginacao() {
  const paginacaoDiv = document.getElementById('paginacao');
  paginacaoDiv.innerHTML = '';
  const totalPaginas = Math.ceil(professores.length / porPagina);

  const criarBtn = (text, page) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = page === paginaAtual;
    btn.onclick = () => {
      paginaAtual = page;
      exibirProfessores();
    };
    paginacaoDiv.appendChild(btn);
  };

  if (paginaAtual > 1) {
    criarBtn('<<', 1);
    criarBtn('<', paginaAtual - 1);
  }

  for (let i = 1; i <= totalPaginas; i++) {
    criarBtn(i, i);
  }

  if (paginaAtual < totalPaginas) {
    criarBtn('>', paginaAtual + 1);
    criarBtn('>>', totalPaginas);
  }
}

async function excluirProfessor(id) {
  if (!confirm('Tem certeza que deseja excluir este professor?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/professores/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      professores = professores.filter(p => p.id !== id);
      exibirProfessores();
    } else {
      alert('Erro ao excluir.');
    }
  } catch (err) {
    console.error(err);
    alert('Erro na exclusão.');
  }
}

function editarProfessor(id) {
  const prof = professores.find(p => p.id === id);
  if (!prof) return;

  document.getElementById('nome').value = prof.nome;
  document.getElementById('email').value = prof.email;

  modoEdicao = true;
  idEdicao = id;

  form.querySelector('button[type="submit"]').textContent = 'Atualizar';
}

carregarProfessores();