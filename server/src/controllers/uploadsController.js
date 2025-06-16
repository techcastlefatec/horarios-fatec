const xlsx = require('xlsx');
const model = require('../models/uploadsModel');

async function processarUpload(req, res) {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const erros = [];
    const inseridos = [];

    for (const [index, linha] of data.entries()) {
      const resultado = await model.processarLinha(linha);

      if (resultado.erro) {
        erros.push({ linha: index + 2, motivo: resultado.erro }); // +2 por causa do cabeçalho
      } else {
        inseridos.push(resultado.sucesso);
      }
    }

    res.status(200).json({ inseridos, erros });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar o arquivo' });
  }
}

module.exports = { processarUpload };
