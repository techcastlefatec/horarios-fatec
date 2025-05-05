// Criamos uma lista de carrosséis, cada um com um ID e um conjunto de imagens
const carrosels = [
    { id: "carrosel-dsm", images: ["../images/dsm1.png", "images/dsm2.png", "images/dsm3.png"] },
    { id: "carrosel-marh", images: ["../images/marh1.png", "images/marh2.png", "images/marh3.png"] },
    { id: "carrosel-geo", images: ["../images/geo1.png", "images/geo2.png", "images/geo3.png"] }
];

// Para cada carrossel na lista, criamos a estrutura e funcionalidade
for (let i = 0; i < carrosels.length; i++) {
    let index = 0; // Índice para acompanhar qual imagem está sendo exibida
    const carrosel = document.getElementById(carrosels[i].id); // Obtém o elemento HTML correspondente ao carrossel
    
    // Criamos um contêiner para armazenar os elementos do carrossel
    const container = document.createElement("div");
    
    // Função que atualiza a imagem exibida no carrossel
    function updateImage() {
        imgElement.src = carrosels[i].images[index]; // Atualiza a imagem com base no índice atual
    }
    
    // Criamos o botão de "voltar" para navegar para a imagem anterior
    const botaoVoltar = document.createElement("button");
    botaoVoltar.innerHTML = "<"; // Define o texto do botão como "<" (seta para esquerda)
    botaoVoltar.classList.add("carrosel-btn", "voltar-btn"); // Adiciona classes CSS para estilização
    botaoVoltar.onclick = function () {
        // Atualiza o índice para exibir a imagem anterior
        index = (index - 1 + carrosels[i].images.length) % carrosels[i].images.length;
        updateImage(); // Chama a função para atualizar a imagem mostrada
    };

    // Criamos o botão de "avançar" para navegar para a próxima imagem
    const botaoAvancar = document.createElement("button");
    botaoAvancar.innerHTML = ">"; // Define o texto do botão como ">" (seta para direita)
    botaoAvancar.classList.add("carrosel-btn", "avancar-btn"); // Adiciona classes CSS para estilização
    botaoAvancar.onclick = function () {
        // Atualiza o índice para exibir a próxima imagem
        index = (index + 1) % carrosels[i].images.length;
        updateImage(); // Chama a função para atualizar a imagem mostrada
    };

      // Criamos o elemento de imagem que exibirá as imagens do carrossel
      const elementoImagem = document.createElement("img");
      elementoImagem.src = carrosels[i].images[index]; // Define a imagem inicial
      elementoImagem.classList.add("carrosel-img"); // Adiciona classe CSS para estilização
      elementoImagem.onclick = function () {
          // Define um link ao clicar na imagem (atualmente, apenas recarrega a página)
          window.location.href = "#";
      };

    
    // Adicionamos os elementos ao contêiner na ordem correta
    container.appendChild(botaoVoltar); // Botão de voltar
    container.appendChild(elementoImagem); // Imagem do carrossel
    container.appendChild(botaoAvancar); // Botão de avançar
    
    // Adicionamos o contêiner ao carrossel correspondente na página
    carrosel.appendChild(container);
};
