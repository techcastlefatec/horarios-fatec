document.addEventListener("DOMContentLoaded", async () => {
    const toggleButtons = document.querySelectorAll(".toggle-button");

    // Busca turmas da API e preenche os menus
    try {
        const response = await fetch("http://localhost:3000/api/turmas");
        const turmas = await response.json();

        // Agrupa turmas por curso_id
        const turmasPorCurso = turmas.reduce((acc, turma) => {
            if (!acc[turma.curso_id]) acc[turma.curso_id] = [];
            acc[turma.curso_id].push(turma);
            return acc;
        }, {});

        // Preenche os menus de semestres para cada curso
        document.querySelectorAll(".semestre-menu").forEach(ul => {
            const cursoId = ul.dataset.cursoId;
            const turmasCurso = turmasPorCurso[cursoId];

            if (turmasCurso) {
                ul.innerHTML = ""; // Limpa conteúdo anterior
                turmasCurso.forEach(turma => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    a.href = `pages/QuadroDeHorarios.html?id=${turma.id}`;
                    a.textContent = turma.nome.toUpperCase();
                    li.appendChild(a);
                    ul.appendChild(li);
                });
            }
        });
    } catch (error) {
        console.error("Erro ao carregar turmas da API:", error);
    }

    // Comportamento do botão toggle
    toggleButtons.forEach(button => {
        const menu = button.nextElementSibling;

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            // Fecha todos os menus abertos
            document.querySelectorAll(".semestre-menu").forEach(m => {
                if (m !== menu) m.style.display = "none";
            });
            document.querySelectorAll(".toggle-button").forEach(b => {
                if (b !== button) b.classList.remove("aberto");
            });

            // Alterna visibilidade e seta
            const isOpen = menu.style.display === "block";
            menu.style.display = isOpen ? "none" : "block";
            button.classList.toggle("aberto", !isOpen);
        });
    });

    // Fecha menus ao clicar fora
    document.addEventListener("click", () => {
        document.querySelectorAll(".semestre-menu").forEach(menu => {
            menu.style.display = "none";
        });
        document.querySelectorAll(".toggle-button").forEach(button => {
            button.classList.remove("aberto");
        });
    });

    // Define o ano letivo dinamicamente
    const anoAtual = new Date().getFullYear();
    document.getElementById("ano-letivo").textContent = anoAtual;
});
