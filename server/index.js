const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }

  const myFile = req.files.file;

  myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occurred" });
    }

    // Чтение файла JSON и отправка его содержимого
    fs.readFile(`${__dirname}/public/endpoints.json`, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occurred" });
      }

      const jsonData = JSON.parse(data);
      res.send(jsonData);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
