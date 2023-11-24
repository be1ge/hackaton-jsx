const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Добавляем пакет cors
const app = express();
const port = 3000;

const uploadFolder = path.join(__dirname, 'public');

// Настраиваем CORS для разрешения запросов с разных доменов и портов
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).any();

app.post('/termsDescription', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    const termsDescriptionFile = path.join(
      __dirname,
      'responses',
      'terms_description_output.json'
    );
    const termsDescriptionContent = fs.readFileSync(termsDescriptionFile);

    res.termsDescriptionContent;
  });
});

app.post('/termsExtraction', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    const termsExtractionFile = path.join(
      __dirname,
      'responses',
      'terms_extraction_output.json'
    );

    const termsExtractionContent = fs.readFileSync(termsExtractionFile);
      console.log(typeof(termsExtractionContent));
    res.json({
      termsExtraction: JSON.stringify(termsExtractionContent),
    });
  });
});

app.post('/transcribation', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    const transcribationFile = path.join(
      __dirname,
      'responses',
      'transcribation_output.json'
    );

    const transcribationContent = fs.readFileSync(transcribationFile);

    res.json({
      transcribation: JSON.parse(transcribationContent),
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
