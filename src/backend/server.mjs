import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Set up storage engine for multer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads directory exists
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch(err => cb(err, uploadDir));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

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
      .replace(/\\/g, '')
      .replace(/"require\(([^)]+)\)\.default"/g, 'require($1).default');

    menuDataString += ';\n\nmodule.exports = menuData;';

    await fs.writeFile('/root/menu-manager-2/src/data/menuData.ts', menuDataString);
    res.status(200).send('Menu saved successfully.');
  } catch (error) {
    console.error("Error saving menu:", error);
    res.status(500).send('Error saving menu.');
  }
});

// Endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileUrl = `http://185.128.40.41:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
