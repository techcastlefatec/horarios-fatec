document.addEventListener("DOMContentLoaded", () => {
  const nomeEl = document.getElementById("nome");
  const emailEl = document.getElementById("email");
  const fotoEl = document.getElementById("foto-professor");
  const cursosEl = document.getElementById("cursos");
  const disciplinasEl = document.getElementById("disciplinas");
  const turmasEl = document.getElementById("turmas");

  // Pega o ID da URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    nomeEl.innerHTML += " Não encontrado (ID ausente)";
    return;
  }

  async function carregarProfessor() {
    try {
      const resposta = await fetch(`/api/public/professores-public/${id}`);
      if (!resposta.ok) throw new Error("Erro ao buscar professor");

      const professor = await resposta.json();

      // Preenche os dados no HTML
      nomeEl.innerHTML = `<strong>Nome:</strong> ${professor.nome}`;
      emailEl.innerHTML = `<strong>Email Institucional:</strong> ${professor.email || "Não informado"}`;
      fotoEl.src = `../images/professores/${professor.foto}`;

      // Cursos
      if (professor.cursos?.length) {
        cursosEl.innerHTML = `<p><strong>Curso(s):</strong> ${professor.cursos.join(", ")}</p>`;
      }

      // Disciplinas (materias)
      if (professor.materias?.length) {
        disciplinasEl.innerHTML = `<p><strong>Disciplinas:</strong> ${professor.materias.join(", ")}</p>`;
      }

      // Turmas
      if (professor.turmas?.length) {
        turmasEl.innerHTML = `<p><strong>Turmas:</strong> ${professor.turmas.join(", ")}</p>`;
      }

    } catch (erro) {
      console.error("Erro ao carregar professor:", erro);
      nomeEl.innerHTML += " (erro ao carregar)";
    }
  }

  carregarProfessor();
});

