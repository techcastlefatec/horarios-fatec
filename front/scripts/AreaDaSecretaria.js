// Redirecionamento dos botões para as páginas
document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll("#fundobotao button");
  
    botoes[0].addEventListener("click", () => {
      window.location.href = "http://localhost:3000/pages/CadastroDeTurmas.html";
    });
  
    botoes[1].addEventListener("click", () => {
      window.location.href = "http://localhost:3000/pages/CadastroDeProfessores.html";
    });
  
    botoes[2].addEventListener("click", () => {
      window.location.href = "http://localhost:3000/pages/materias.html";
    });
  
    // Eventos principais da página
    carregarSelects(); // carrega os dados dos selects
    document.querySelector('.form-cadastro-aula').addEventListener('submit', cadastrarAula);
    document.getElementById('selecionar-turma-form').addEventListener('submit', exibirAulas);
  });
  
  const API_BASE = 'http://localhost:3000/api';
  
  // Carregar dados nos selects (cursos, professores, materias, salas, horários fixos, turmas)
  async function carregarSelects() {
    await preencherSelect('curso', '/cursos');
    await preencherSelect('professor', '/professores');
    await preencherSelect('materia', '/materias');
    await preencherSelect('sala', '/salas');
    await preencherSelect('turma', '/turmas');
    preencherHorarios(); // Preenche manualmente os horários
  }
  
  // Preencher select com dados da API
  async function preencherSelect(idSelect, rota) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    const res = await fetch(`${API_BASE}${rota}`);
    const dados = await res.json();
  
    dados.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id || item.nome || item.codigo;
      option.textContent = item.nome || item.descricao || item.codigo;
      select.appendChild(option);
    });
  }
  
  // Preenche o select de horários com dados fixos
  function preencherHorarios() {
    const horarios = [
      { id: 1, horario: '18:45' },
      { id: 2, horario: '19:35' },
      { id: 3, horario: '20:25' },
      { id: 4, horario: '21:25' },
      { id: 5, horario: '22:15' },
      { id: 6, horario: '07:30' },
      { id: 7, horario: '08:20' },
      { id: 8, horario: '09:20' },
      { id: 9, horario: '10:10' },
      { id: 10, horario: '11:10' },
      { id: 11, horario: '12:00' }
    ];
  
    const select = document.getElementById('horario');
    if (!select) return;
    horarios.forEach(h => {
      const option = document.createElement('option');
      option.value = h.id;
      option.textContent = h.horario;
      select.appendChild(option);
    });
  }
  
  // Cadastrar nova aula
  async function cadastrarAula(e) {
    e.preventDefault();
  
    const novaAula = {
      curso_id: document.getElementById('curso').value,
      turma: document.getElementById('turma').value,
      professor_id: document.getElementById('professor').value,
      materia_id: document.getElementById('materia').value,
      sala_id: document.getElementById('sala').value,
      horario_id: document.getElementById('horario').value,
      dia: document.getElementById('dia').value
    };
  
    const res = await fetch(`${API_BASE}/aulas`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(novaAula)
    });
  
    if (res.ok) {
      alert('Aula cadastrada com sucesso!');
      e.target.reset();
    } else {
      alert('Erro ao cadastrar aula.');
    }
  }
  
  // Exibir aulas por turma/curso/turno
  async function exibirAulas(e) {
    e.preventDefault();
  
    const curso = document.getElementById('curso-select').value;
    const turma = document.getElementById('turma-select').value;
    const turno = document.getElementById('turno-select').value;
  
    const res = await fetch(`${API_BASE}/public/quadro-public?curso=${curso}&turma=${turma}&turno=${turno}`);
    const grade = await res.json();
  
    const tbody = document.querySelector('.tabela-aulas tbody');
    tbody.innerHTML = '';
  
    const horarios = {};
  
    grade.forEach(aula => {
      if (!horarios[aula.horario]) {
        horarios[aula.horario] = {
          horario: aula.horario,
          Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '', Sábado: ''
        };
      }
  
      horarios[aula.horario][aula.dia] = `${aula.materia} (${aula.professor}) - Sala ${aula.sala}`;
    });
  
    Object.values(horarios).forEach(linha => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${linha.horario}</td>
        <td>${linha.Segunda || ''}</td>
        <td>${linha.Terça || ''}</td>
        <td>${linha.Quarta || ''}</td>
        <td>${linha.Quinta || ''}</td>
        <td>${linha.Sexta || ''}</td>
        <td>${linha.Sábado || ''}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  