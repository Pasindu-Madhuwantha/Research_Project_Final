const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mp3FolderPath = process.env.mp3FolderPath;

exports.playMp3 = (req, res) => {
  const mp3File = req.query.file;

  const filePath = path.join(mp3FolderPath, mp3File);

  // Ensure the requested file is within the allowed directory
  if (!filePath.startsWith(mp3FolderPath)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Stream the MP3 file to the client
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
};
