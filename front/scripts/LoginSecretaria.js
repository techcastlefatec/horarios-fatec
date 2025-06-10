const API_URL = '/api/users/login';

document.querySelector(".loginadm-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Impede o envio do formulário
    await login();
});

async function login() {
    const email = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Login bem-sucedido:', data);
            //alert(data.mensagem); // ou redirecione o usuário
            window.location.href = "/pages/AreaDaSecretaria.html";

        } else {
            console.warn('⚠️ Erro no login:', data.error);
            alert(data.error);
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        alert('Erro na requisição ao servidor.');
    }
}
