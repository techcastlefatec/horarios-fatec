// Função para baixar o relatório de aulas por sala

function baixarRelatorio(formato) {
  const dia = document.getElementById('dia').value;
  const mensagem = document.getElementById('mensagem');

  if (!dia) {
    mensagem.textContent = 'Por favor, selecione um dia da semana.';
    mensagem.style.color = 'red';
    return;
  }

  mensagem.textContent = '';

  const url = `/api/aulas/por-sala?dia_semana=${dia}&formato=${formato}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao gerar relatório.');
      return response.blob();
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `aulas-${dia}.${formato}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      mensagem.textContent = error.message;
      mensagem.style.color = 'red';
    });
}


// Função para inserir aulas a partir de um arquivo Excel


document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('arquivo');
  const mensagem = document.getElementById('mensagem-upload');
  const file = input.files[0];

  if (!file) {
    mensagem.textContent = 'Selecione um arquivo.';
    mensagem.style.color = 'red';
    return;
  }

  const formData = new FormData();
  formData.append('arquivo', file);

  try {
    const response = await fetch('/api/uploads/upload-aulas', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.erros?.length) {
      mensagem.innerHTML = `<strong>Alguns erros:</strong><br>` + data.erros.map(e => `Linha ${e.linha}: ${e.motivo}`).join('<br>');
      mensagem.style.color = 'red';
    } else {
      mensagem.textContent = `Aulas importadas com sucesso: ${data.inseridos.length}`;
      mensagem.style.color = 'green';
    }
  } catch (error) {
    mensagem.textContent = 'Erro ao enviar arquivo';
    mensagem.style.color = 'red';
  }
});