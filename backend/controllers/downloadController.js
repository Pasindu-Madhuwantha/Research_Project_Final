const fs = require('fs');
const path = require('path');
require('dotenv').config();

const mp3FolderPath = process.env.mp3FolderPath;

exports.downloadMp3 = async (req, res) => {
  const fileName = req.query.file;
  const filePath = path.join(mp3FolderPath, fileName);

  try {
    // Check if the file exists using fs.promises.access
    await fs.promises.access(filePath);

    // If the file exists, initiate download
    res.download(filePath);
  } catch (error) {
    // If the file does not exist, send a 404 response
    console.error('Error:', error);
    res.status(404).json({ error: 'File not found' });
  }
};
