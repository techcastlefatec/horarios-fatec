document.addEventListener("DOMContentLoaded", () => {
  const tabelaCorpo = document.getElementById("tabela-corpo");
  const divProfessoresMobile = document.getElementById("professores-mobile");

  const urlParams = new URLSearchParams(window.location.search);
  const idCurso = urlParams.get("id");

  if (!idCurso) {
    console.error("ID do curso não especificado na URL. Ex: ?id=1");
    return;
  }

  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const cores = ['#fce8a5', '#d5edb9', '#a5e1e9', '#cabdf3', '#f8cadc', '#ffb4bf', '#f6aa90', '#a3e7d6', '#ebf3e7'];
  const professorCorMap = new Map();
  let corIndex = 0;

  fetch(`/api/public/quadro-public/${idCurso}`)
    .then((res) => res.json())
    .then((dados) => {
      if (!dados || dados.length === 0) return;

      // Primeiro, vamos formatar os horários de todas as aulas para remover os segundos
      const dadosFormatados = dados.map(aula => ({
        ...aula,
        hora_inicio: aula.hora_inicio ? aula.hora_inicio.substring(0, 5) : '', // Pega apenas HH:MM
        hora_fim: aula.hora_fim ? aula.hora_fim.substring(0, 5) : '',   // Pega apenas HH:MM
        // Formata o nome do professor: se for nulo/vazio/espaços, vira "A Definir"
        // para exibir, mas a lógica de cor será separada.
        professor: aula.professor && aula.professor.trim() !== '' ? aula.professor : 'A Definir'
      }));

      const horaiosUnicosSet = new Set();
      dadosFormatados.forEach((aula) => {
        if (aula.hora_inicio && aula.hora_fim) {
          horaiosUnicosSet.add(JSON.stringify({ inicio: aula.hora_inicio, fim: aula.hora_fim }));
        }
      });

      const faixasHorarias = Array.from(horaiosUnicosSet).map(item => JSON.parse(item));

      faixasHorarias.sort((a, b) => {
        return a.inicio.localeCompare(b.inicio);
      });

      const materiasUnicasMobile = new Set();

      faixasHorarias.forEach((faixa) => {
        const linha = document.createElement("tr");

        // Célula para a hora de Início (já formatada)
        const thInicio = document.createElement("th");
        thInicio.textContent = faixa.inicio;
        thInicio.classList.add("col-horario");
        linha.appendChild(thInicio);

        // Célula para a hora de Fim (já formatada)
        const thFim = document.createElement("th");
        thFim.textContent = faixa.fim;
        thFim.classList.add("col-horario");
        linha.appendChild(thFim);

        diasDaSemana.forEach((dia) => {
          const td = document.createElement("td");

          // Encontra a aula usando os horários já formatados
          const aula = dadosFormatados.find(
            (item) =>
              item.dia_semana === dia &&
              item.hora_inicio === faixa.inicio &&
              item.hora_fim === faixa.fim
          );

          if (aula) {
            // Sempre preenche a célula com os dados da aula, inclusive "A Definir" se for o caso
            td.innerHTML = `
              <strong>${aula.materia}</strong>
              <br><span class="professor">${aula.professor}</span>
              <br><em>${aula.sala}</em>
            `;

            // Lógica para aplicar a cor de fundo
            // A cor só será aplicada se o professor NÃO for "A Definir" (case-insensitive)
            if (aula.professor.toLowerCase() !== 'a definir') {
              if (!professorCorMap.has(aula.professor)) {
                professorCorMap.set(aula.professor, cores[corIndex]);
                corIndex = (corIndex + 1) % cores.length;
              }
              td.style.backgroundColor = professorCorMap.get(aula.professor);
            } else {
              // Se o professor for "A Definir", a célula fica branca
              td.style.backgroundColor = 'white';
            }

            // Adiciona na lista mobile se for uma matéria/professor único
            // Nota: se aula.professor for "A Definir", essa chave também será adicionada
            // no Set, evitando repetição de "Materia - A Definir"
            const chave = `${aula.materia} - ${aula.professor}`;
            if (!materiasUnicasMobile.has(chave)) {
              materiasUnicasMobile.add(chave);

              const p = document.createElement("p");
              p.innerHTML = `<strong>${aula.materia}</strong>
              <br><span class="professor">${aula.professor}</span>
              <br><span class=label-lista><strong>ambiente: </strong></span><em>${aula.sala}</em>`;
              p.style.backgroundColor = td.style.backgroundColor; // Mesma cor da célula
              p.classList.add("professor-mobile");
              divProfessoresMobile.appendChild(p);
            }
          } else {
            // Se não houver aula para aquele slot, a célula fica branca
            td.style.backgroundColor = 'white';
          }

          linha.appendChild(td);
        });

        tabelaCorpo.appendChild(linha);

        const cursoNome = document.getElementById("curso-nome");
        if (cursoNome) {
          cursoNome.textContent = dadosFormatados[0].curso || "Curso não especificado";
        }

        const turmaNome = document.getElementById("turma-nome");
        if (turmaNome) {
          turmaNome.textContent = dadosFormatados[0].turma || "Turma não especificada";
        }

        const periodoNome = document.getElementById("periodo-nome");
        if (periodoNome) {
          periodoNome.textContent = dadosFormatados[0].periodo || "Período não especificado";
        }
      
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar dados:", err);
    });
});