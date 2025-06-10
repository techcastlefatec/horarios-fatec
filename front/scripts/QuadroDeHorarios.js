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

  fetch(`/api/public/quadro-public/${idCurso}`)
    .then((res) => res.json())
    .then((dados) => {
      if (!dados || dados.length === 0) return;

      const turno = dados[0].periodo.toLowerCase();
      const faixasHorarias = [];

      dados.forEach((aula) => {
        const faixa = `${aula.hora_inicio} - ${aula.hora_fim}`;
        if (!faixasHorarias.includes(faixa)) {
          faixasHorarias.push(faixa);
        }
      });

      faixasHorarias.sort((a, b) => {
        const [aInicio] = a.split(" - ");
        const [bInicio] = b.split(" - ");
        return aInicio.localeCompare(bInicio);
      });

      const materiasUnicasMobile = new Set();

      faixasHorarias.forEach((faixa) => {
        const linha = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = faixa;
        th.classList.add("col-horario");
        linha.appendChild(th);

        diasDaSemana.forEach((dia) => {
          const td = document.createElement("td");

          const aula = dados.find(
            (item) =>
              item.dia_semana === dia &&
              `${item.hora_inicio} - ${item.hora_fim}` === faixa
          );

          if (aula) {
            td.innerHTML = `
              <strong>${aula.materia}</strong>
              <br><span class="professor">${aula.professor}</span>
              <br><em>${aula.sala}</em>
            `;

            // Adiciona na lista mobile se for único
            const chave = `${aula.materia} - ${aula.professor}`;
            if (!materiasUnicasMobile.has(chave)) {
              materiasUnicasMobile.add(chave);

              const p = document.createElement("p");
              p.innerHTML = `<strong>${aula.materia}</strong><br><span class="professor">${aula.professor}</span>`;
              divProfessoresMobile.appendChild(p);
            }
          }

          linha.appendChild(td);
        });

        tabelaCorpo.appendChild(linha);
      });
    })
    .catch((err) => {
      console.error("Erro ao carregar dados:", err);
    });

  // Zoom manual via escala
  const zoomWrapper = document.getElementById("zoom-wrapper");
  let zoomLevel = 1;

  document.getElementById("zoom-in").addEventListener("click", () => {
    zoomLevel += 0.1;
    zoomWrapper.style.transform = `scale(${zoomLevel})`;
    zoomWrapper.style.transformOrigin = "top center";
  });

  document.getElementById("zoom-out").addEventListener("click", () => {
    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    zoomWrapper.style.transform = `scale(${zoomLevel})`;
    zoomWrapper.style.transformOrigin = "top center";
  });
});
