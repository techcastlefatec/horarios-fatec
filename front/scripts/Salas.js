// Lista de IDs a ignorar nas interações
const idsIgnorados = ['rect20', 'path1', 'path1-3']; // adicione aqui os que quiser ignorar

document.getElementById("andar").addEventListener("change", function () {
  const valor = this.value;
  const template = document.getElementById(`template-${valor}`);
  const svgContainer = document.getElementById("svg-container");

  if (template && svgContainer) {
    svgContainer.innerHTML = '';
    svgContainer.appendChild(template.content.cloneNode(true));
    aplicarInteracoes();
  }
});

// Função para aplicar interações após carregar SVG
function aplicarInteracoes() {
  const svg = document.querySelector("#svg-container svg");

  if (!svg) return;

  const elementos = svg.querySelectorAll("rect, path");

  elementos.forEach(el => {
    const id = el.id;

    // Apenas aplica se o elemento tiver ID
    if (!id) return;

    // Adiciona classes para controle visual
    el.classList.add("retangulo-interativo");

    if (idsIgnorados.includes(id)) {
      el.classList.add("ignorar-interacao");
      return;
    }

    // Evento de clique
    el.addEventListener("click", () => {
      if (idsIgnorados.includes(id)) return;

      // Remove seleção anterior
      svg.querySelectorAll(".retangulo-selecionado").forEach(e => {
        e.classList.remove("retangulo-selecionado");
      });

      // Marca como selecionado
      el.classList.add("retangulo-selecionado");

      // Mostra ID no console
      console.log("Elemento clicado com ID:", id);
    });
  });
}

// Executa quando o SVG for carregado dinamicamente
document.getElementById("andar").addEventListener("change", () => {
  setTimeout(aplicarInteracoes, 50); // espera o template ser aplicado
});

// Também aplicar na carga inicial (se já tiver SVG no DOM)
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(aplicarInteracoes, 50);
});
