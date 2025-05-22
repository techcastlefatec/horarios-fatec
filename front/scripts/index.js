document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".toggle-button");

    toggleButtons.forEach(button => {
        const menu = button.nextElementSibling;

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            // Fecha todos os menus e remove a classe 'aberto'
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

    // Fecha todos os menus ao clicar fora
    document.addEventListener("click", () => {
        document.querySelectorAll(".semestre-menu").forEach(menu => {
            menu.style.display = "none";
        });
        document.querySelectorAll(".toggle-button").forEach(button => {
            button.classList.remove("aberto");
        });
    });
});