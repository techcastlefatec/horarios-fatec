document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll("#fundobotao button");

    // Associa cada botão ao seu respectivo link
    botoes[0].addEventListener("click", () => {
        window.location.href = "http://localhost:3000/pages/CadastroDeTurmas.html";
    });

    botoes[1].addEventListener("click", () => {
        window.location.href = "http://localhost:3000/pages/CadastroDeProfessores.html";
    });

    botoes[2].addEventListener("click", () => {
        window.location.href = "http://localhost:3000/pages/materias.html";
    });
});