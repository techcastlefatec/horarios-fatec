document.addEventListener("DOMContentLoaded", () => {
  fetch('/pages/header-footer.html')
    .then(res => res.text())
    .then(data => {
      const temp = document.createElement('div');
      temp.innerHTML = data;
      const header = temp.querySelector('header');
      const footer = temp.querySelector('footer');
      document.body.prepend(header);
      document.body.appendChild(footer);

      // Espera o DOM atualizar para garantir que o botão exista
      setTimeout(() => {
        const btnToggle = document.getElementById("menu-toggle-nav");
        if (btnToggle) {
          btnToggle.addEventListener("click", () => {
            const menu = document.getElementById("menu-mobile-nav");
            if (menu) {
              menu.classList.toggle("show");
            }
          });
        }
      }, 0);
    });
});
