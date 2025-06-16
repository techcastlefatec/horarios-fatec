const model = require('../models/professoresModel');
const pool = require('../config/db');
const fs = require('fs/promises');
const path = require('path');

// CAMINHO:
const PROFESSOR_PHOTOS_DIR = path.join(__dirname, '../../../front/images/professores');


async function listar(req, res) {
  try {
    const professores = await model.listarProfessores();
    res.json(professores);
  } catch (err) {
    console.error('Erro ao listar professores:', err);
    res.status(500).json({ erro: 'Erro interno ao listar professores.' });
  }
}

async function obter(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const professor = await model.obterProfessor(client, id);
    if (!professor) {
      return res.status(404).json({ erro: 'Professor não encontrado' });
    }
    res.json(professor);
  } catch (err) {
    console.error('Erro ao obter professor:', err);
    res.status(500).json({ erro: 'Erro interno ao obter professor.' });
  } finally {
    client.release();
  }
}

async function criar(req, res) {
  const { nome, email } = req.body;
  const fotoFilename = req.file ? req.file.filename : 'default.png';

  if (!nome) {
    if (req.file) {
      try { await fs.unlink(req.file.path); } catch (unlinkErr) { console.error('Erro ao excluir arquivo após validação falha:', unlinkErr); }
    }
    return res.status(400).json({ erro: 'Nome é obrigatório para cadastrar professor.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const novoProfessor = await model.criarProfessor(client, nome, email, fotoFilename);
    
    await client.query('COMMIT');
    res.status(201).json(novoProfessor);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar professor no banco de dados:', err);
    if (req.file) {
      try { await fs.unlink(req.file.path); } catch (unlinkErr) { console.error('Erro ao excluir arquivo após rollback:', unlinkErr); }
    }
    res.status(500).json({ erro: `Erro ao criar professor: ${err.message || 'Erro desconhecido.'}` });
  } finally {
    client.release();
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, email, foto_filename_current } = req.body;

  let fotoFilenameToUpdate = foto_filename_current;

  if (req.file) {
    fotoFilenameToUpdate = req.file.filename;
  } else if (!foto_filename_current) {
    fotoFilenameToUpdate = 'default.png'; 
  }

  if (!nome) {
    if (req.file) {
      try { await fs.unlink(req.file.path); } catch (unlinkErr) { console.error('Erro ao excluir novo arquivo após validação falha:', unlinkErr); }
    }
    return res.status(400).json({ erro: 'Nome é obrigatório para atualizar professor.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const professorExistente = await model.obterProfessor(client, id);
    if (!professorExistente) {
      await client.query('ROLLBACK');
      if (req.file) { try { await fs.unlink(req.file.path); } catch (unlinkErr) { console.error('Erro ao excluir novo arquivo de professor inexistente:', unlinkErr); } }
      return res.status(404).json({ erro: 'Professor não encontrado para atualização.' });
    }

    if (req.file && professorExistente.foto && professorExistente.foto !== 'default.png') {
        const oldPhotoPath = path.join(PROFESSOR_PHOTOS_DIR, professorExistente.foto);
        try {
            await fs.unlink(oldPhotoPath);
            console.log(`Foto antiga excluída: ${oldPhotoPath}`);
        } catch (unlinkErr) {
            console.error(`Erro ao excluir foto antiga ${oldPhotoPath}:`, unlinkErr);
        }
    }

    const professorAtualizado = await model.atualizarProfessor(client, id, nome, email, fotoFilenameToUpdate);
    
    await client.query('COMMIT');
    res.status(200).json(professorAtualizado);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar professor no banco de dados:', err);
    if (req.file) {
      try { await fs.unlink(req.file.path); } catch (unlinkErr) { console.error('Erro ao excluir novo arquivo após rollback:', unlinkErr); }
    }
    res.status(500).json({ erro: `Erro ao atualizar professor: ${err.message || 'Erro desconhecido.'}` });
  } finally {
    client.release();
  }
}

async function deletar(req, res) {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const professorParaDeletar = await model.obterProfessor(client, id);
    if (!professorParaDeletar) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: 'Professor não encontrado para exclusão.' });
    }

    await model.deletarProfessor(client, id);

    if (professorParaDeletar.foto && professorParaDeletar.foto !== 'default.png') {
      const photoPath = path.join(PROFESSOR_PHOTOS_DIR, professorParaDeletar.foto);
      try {
        await fs.unlink(photoPath);
        console.log(`Foto excluída do sistema de arquivos: ${photoPath}`);
      } catch (unlinkErr) {
        console.error(`Erro ao excluir foto do professor ${id} em ${photoPath}:`, unlinkErr);
      }
    }

    await client.query('COMMIT');
    res.status(204).send();
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao deletar professor no banco de dados:', err);
    res.status(500).json({ erro: `Erro ao deletar professor: ${err.message || 'Erro desconhecido.'}` });
  } finally {
    client.release();
  }
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};