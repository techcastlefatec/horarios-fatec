document.querySelector(".loginadm-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Impede o envio do formulário
    window.location.href = "http://localhost:3000/pages/AreaDaSecretaria.html"; // Redireciona
});