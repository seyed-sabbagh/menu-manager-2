import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const convertPictureUrlToRequire = (menuData) => {
  const convert = (item) => {
    if (item.pictureUrl) {
      const pictureUrl = item.pictureUrl.replace(/\\/g, 'ff'); // Remove all backslashes from the path
      item.pictureUrl = `require("${pictureUrl}").default`;
    }
    return item;
  };

  for (const category in menuData) {
    if (Array.isArray(menuData[category])) {
      menuData[category] = menuData[category].map(convert);
    }
  }

  return menuData;
};

app.post('/save-menu', async (req, res) => {
  try {
    let menuData = req.body;
    menuData = convertPictureUrlToRequire(menuData); // Convert picture URLs

    // Serialize menuData to string with custom replacer to handle require statements
    let menuDataString = 'const menuData = ';
    menuDataString += JSON.stringify(menuData, null, 2)
      .replace(/\\/g,'')
      .replace(/"require\(([^)]+)\)\.default"/g, 'require($1).default');
      
    menuDataString += ';\n\nmodule.exports = menuData;';

    await fs.writeFile('/Users/fapna/restaurant-manager/menu-manager 2/src/data/menuData.ts', menuDataString);
    res.status(200).send('Menu saved successfully.');
  } catch (error) {
    console.error("Error saving menu:", error);
    res.status(500).send('Error saving menu.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
