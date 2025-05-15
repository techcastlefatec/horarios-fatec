const seletor = document.getElementById('andar');
const svgContainer = document.getElementById('svg-container');
const info = document.getElementById('info');

let activeRect = null;
let activeText = null;

function resetActive() {
  if (activeRect) activeRect.classList.remove('active-rect');
  if (activeText) activeText.classList.remove('active-text');
}

function setActive(element) {
  resetActive();
  if (element.tagName === 'rect') {
    activeRect = element;
    const correspondingText = document.querySelector(`#${element.id.replace('rect', 'text')}`);
    if (correspondingText) {
      activeText = correspondingText;
      activeText.classList.add('active-text');
    }
  } else if (element.tagName === 'text') {
    activeText = element;
    const correspondingRect = document.querySelector(`#${element.id.replace('text', 'rect')}`);
    if (correspondingRect) {
      activeRect = correspondingRect;
      activeRect.classList.add('active-rect');
    }
  }

  if (activeRect) activeRect.classList.add('active-rect');
  if (activeText) activeText.classList.add('active-text');

  info.textContent = `Selecionado: ${element.id}`;
}

function aplicarInteracoes(svg) {
  const rects = svg.querySelectorAll('rect');
  const texts = svg.querySelectorAll('text');

  rects.forEach(rect => {
    rect.addEventListener('click', () => setActive(rect));
  });

  texts.forEach(text => {
    text.addEventListener('click', () => setActive(text));
  });
}

function mostrarMapa(idTemplate) {
  const template = document.getElementById(`template-${idTemplate}`);
  const clone = document.importNode(template.content, true);

  svgContainer.innerHTML = '';
  svgContainer.appendChild(clone);

  const svg = svgContainer.querySelector('svg');
  if (svg) aplicarInteracoes(svg);
}

seletor.addEventListener('change', () => {
  mostrarMapa(seletor.value);
});

// Mostrar o primeiro andar selecionado ao carregar
document.addEventListener('DOMContentLoaded', () => {
  mostrarMapa(seletor.value);
});
