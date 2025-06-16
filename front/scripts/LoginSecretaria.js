// Script para gerenciar o login da secretaria
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
            body: JSON.stringify({ email, senha }) // Converte os dados para JSON e os envia no corpo
        });

        const data = await response.json(); // Analisa a resposta JSON do servidor

        if (response.ok) { // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
            console.log('✅ Login bem-sucedido:', data);
            // Redireciona para a página da área da secretaria em caso de sucesso
            window.location.href = "/pages/AreaDaSecretaria.html";

        } else {
            // Se a resposta não foi ok, exibe o erro retornado pelo servidor
            console.warn('⚠️ Erro no login:', data.error);
            // Usa um modal customizado ou div para a mensagem de erro ao invés de alert()
            // (Conforme as instruções, evitar alert() em iframes)
            displayMessage(data.error, 'error'); 
        }
    } catch (error) {
        // Captura erros de rede ou outros erros na requisição
        console.error('❌ Erro na requisição:', error);
        // Usa um modal customizado ou div para a mensagem de erro
        displayMessage('Erro na requisição ao servidor. Verifique sua conexão.', 'error');
    }
}

// Função auxiliar para exibir mensagens (substitui alert())
function displayMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer'); // Crie uma div com esse ID no seu HTML
    if (!messageContainer) {
        console.error('Elemento #messageContainer não encontrado para exibir a mensagem.');
        // Fallback para alert() se não houver um container, mas preferível evitar
        alert(message); 
        return;
    }

    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`; // Adiciona classes para estilização (ex: .message.error)
    messageContainer.style.display = 'block'; // Mostra a mensagem

    // Opcional: Esconder a mensagem após alguns segundos
    setTimeout(() => {
        messageContainer.style.display = 'none';
        messageContainer.textContent = '';
    }, 5000); // Esconde após 5 segundos
}