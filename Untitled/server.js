const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Endpoint to save menu data
app.post('/save-menu', (req, res) => {
  const menuData = req.body;
  const jsonData = JSON.stringify(menuData, null, 2); // Prettify JSON data
  fs.writeFile('menuData.json', jsonData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving menu data.');
    } else {
      console.log('Menu data saved successfully.');
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
