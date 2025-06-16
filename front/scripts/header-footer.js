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

      // Espera o DOM ser atualizado antes de acessar os elementos do header inserido
      setTimeout(() => {
        // Configura o botão de menu mobile
        const btnToggle = document.getElementById("menu-toggle-nav");
        if (btnToggle) {
          btnToggle.addEventListener("click", () => {
            const menu = document.getElementById("menu-mobile-nav");
            if (menu) {
              menu.classList.toggle("show");
            }
          });
        }

        // Verifica a sessão para mostrar menus
        fetch('/api/users/session')
          .then(res => res.json())
          .then(data => {
            const menusLogado = document.querySelectorAll(".menu-logado");
            const menusDeslogado = document.querySelectorAll(".menu-deslogado");

            if (data.usuario) {
              menusLogado.forEach(el => el.style.display = "block");
              menusDeslogado.forEach(el => el.style.display = "none");
            } else {
              menusLogado.forEach(el => el.style.display = "none");
              menusDeslogado.forEach(el => el.style.display = "block");
            }
          });

        // Configura todos os botões de logout
        const logoutButtons = document.querySelectorAll(".btn-logout");
        logoutButtons.forEach(button => {
          button.addEventListener("click", async function (e) {
            e.preventDefault(); // evita redirecionamento imediato do <a>
            try {
              const response = await fetch("/api/users/logout", {
                method: "POST"
              });

              if (response.ok) {
                window.location.href = "/"; // Redireciona após logout
              } else {
                alert("Erro ao fazer logout.");
              }
            } catch (error) {
              console.error("❌ Erro na requisição de logout:", error);
              alert("Erro ao tentar sair.");
            }
          });
        });

      }, 0); // fim do setTimeout
    });
});
