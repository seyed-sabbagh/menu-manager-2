import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';


const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/save-menu', async (req, res) => {
  try {
    const menuData = req.body;
    const menuDataString = `const menuData = ${JSON.stringify(menuData)};\n\nmodule.exports = menuData;`;
    await fs.writeFile('src/data/menuData.ts', menuDataString);
    res.status(200).send('Menu saved successfully.');
  } catch (error) {
    console.error("Error saving menu:", error);
    res.status(500).send('Error saving menu.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
