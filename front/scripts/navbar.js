document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
  
    // Abre/fecha o menu ao clicar no botão
    toggle.addEventListener("click", (event) => {
      event.stopPropagation(); // impede que o clique propague para o body
      navLinks.classList.toggle("show");
    });
  
    // Impede o fechamento se clicar dentro do menu
    navLinks.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  
    // Fecha o menu se clicar fora
    document.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
  