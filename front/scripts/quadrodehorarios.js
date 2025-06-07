// URL base da API para as turmas
const API_URL = 'http://localhost:3000/api/public/quadro-public';

// Espera o carregamento completo do DOM antes de executar os scripts
document.addEventListener('DOMContentLoaded', () => {
  carregarQuadroDeHorarios(); // Carrega a lista de turmas ao iniciar a página
});

async function carregarQuadroDeHorarios() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let id = urlParams.get('id');

  console.log(id);

  // Faz a requisição GET para buscar as turmas
  const res = await fetch(`${API_URL}/${id}`);
  const horarios = await res.json();  // Converte a resposta para JSON

  const tbody = document.getElementById('listarHorarios');
  tbody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

  // Agrupa os horários por dia da semana
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  diasSemana.forEach(dia => {
    // Filtra os horários pelo dia da semana
    const horariosDia = horarios.filter(horario => horario.dia_semana === dia);

    if (horariosDia.length > 0) {
      // Cria a linha para o dia
      const trDia = document.createElement('tr');
      trDia.innerHTML = `<td colspan="3" class="dia-semana">${dia}</td>`;
      tbody.appendChild(trDia);

      // Adiciona os horários do dia
      horariosDia.forEach(horario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${horario.hora_inicio} - ${horario.hora_fim}</td>
          <td>${horario.materia}</td>
          <td>${horario.professor}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  });
}
