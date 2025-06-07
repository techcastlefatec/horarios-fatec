// função utilitária para pegar parâmetros da URL
function obterParametroURL(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

// obtém o ID do professor da URL
const idProfessor = obterParametroURL('id');

// referências aos elementos HTML
const nomeElemento = document.querySelector('#nome');
const emailElemento = document.querySelector('#email');
const cursosElemento = document.querySelector('#cursos');
const materiasElemento = document.querySelector('#disciplinas');
const turmasElemento = document.querySelector('#turmas');
const imagemElemento = document.querySelector('.profile-img');

// função para buscar e exibir os dados do professor
async function buscarDadosProfessor() {
    try {
        const resposta = await fetch(`http://localhost:3000/api/public/professores-public/${idProfessor}`);
        if (!resposta.ok) {
            throw new Error('Professor não encontrado');
        }

        const professor = await resposta.json();

        // preenche os dados na página
        nomeElemento.innerHTML = `<strong>Nome:</strong><br>Prof. ${professor.nome}`;
        emailElemento.innerHTML = `<strong>Email Institucional:</strong><br>${professor.email || 'Não informado'}`;
        cursosElemento.innerHTML = `<strong>Curso(s):</strong><br>${professor.curso || 'Não informado'}`;
        materiasElemento.innerHTML = `<strong>Disciplina(s):</strong><br>${(professor.materias || []).join(', ')}`;
        turmasElemento.innerHTML = `<strong>Turma(s):</strong><br>${(professor.turmas || []).join(', ')}`;

        if (
    professor.foto &&
    typeof professor.foto === 'string' &&
    professor.foto.trim() !== '' &&
    !professor.foto.toLowerCase().includes('foto-perfil') &&  // previne casos como no print
    professor.foto.trim().length > 10
) {
    imagemElemento.src = professor.foto;
}

    } catch (erro) {
        console.error('Erro ao buscar dados do professor:', erro);
        document.querySelector('.container').innerHTML = '<p>Erro ao carregar dados do professor.</p>';
    }
}

// comando de execução
buscarDadosProfessor();
