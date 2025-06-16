// front/scripts/LoginSecretaria.js
const API_URL = '/api/users/login'; // Caminho relativo para o endpoint de login

document.querySelector(".loginadm-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    await login(); // Chama a função de login
});

async function login() {
    const email = document.getElementById('usuario').value; // Obtém o email do campo
    const senha = document.getElementById('senha').value; // Obtém a senha do campo

    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Define o método da requisição como POST
            headers: {
                'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
            },
            body: JSON.stringify({ email, senha }), // Converte os dados para JSON e os envia no corpo
            credentials: 'include' // <--- ADICIONE ESTA LINHA para enviar cookies de sessão
        });

        const data = await response.json(); // Analisa a resposta JSON do servidor

        if (response.ok) { // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
            console.log('✅ Login bem-sucedido:', data);
            // Redireciona para a página da área da secretaria em caso de sucesso
            window.location.href = "/pages/AreaDaSecretaria.html";

        } else {
            // Se a resposta não foi ok, exibe o erro retornado pelo servidor
            console.warn('⚠️ Erro no login:', data.error);
            displayMessage(data.error, 'error'); 
        }
    } catch (error) {
        // Captura erros de rede ou outros erros na requisição
        console.error('❌ Erro na requisição:', error);
        displayMessage('Erro na requisição ao servidor. Verifique sua conexão.', 'error');
    }
}

// Função auxiliar para exibir mensagens (substitui alert())
function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer'); // Crie uma div com esse ID no seu HTML
    if (!messageContainer) {
        console.error('Elemento #messageContainer não encontrado para exibir a mensagem.');
        alert(message); 
        return;
    }

    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`; 
    messageContainer.style.display = 'block'; 

    setTimeout(() => {
        messageContainer.style.display = 'none';
        messageContainer.textContent = '';
    }, 5000); 
}
