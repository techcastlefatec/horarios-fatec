    // URL base da API para as turmas
    const API_URL = 'http://localhost:3000/api/public/quadro-public';

    // Espera o carregamento completo do DOM antes de executar os scripts
    document.addEventListener('DOMContentLoaded', () => {
        carregarQuadroDeHorarios(); // Carrega a lista de turmas ao iniciar a pÃ¡gina
    });

    async function carregarQuadroDeHorarios() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let id = urlParams.get('id');

        console.log(id);

        // ERRO CORRIGIDO AQUI: Usando template literals para construir a URL
        const res = await fetch(`${API_URL}/${id}`); // Faz requisiÃ§Ã£o GET para buscar as turmas
        const horarios = await res.json();  // Converte a resposta para JSON

        const tbody = document.getElementById('listarHorarios');
        tbody.innerHTML = ''; // Limpa a tabela antes de preencher com os novos dados

        // Itera sobre cada turma e cria uma linha na tabela
        horarios.forEach(horario => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${horario.dia_semana}</td>
                <td>${horario.hora_inicio}</td>
                <td>${horario.hora_fim}</td>
                <td>${horario.materia}</td>
                <td>${horario.professor}</td>
            `;

            tbody.appendChild(tr); // Adiciona a linha na tabela
        });
    }