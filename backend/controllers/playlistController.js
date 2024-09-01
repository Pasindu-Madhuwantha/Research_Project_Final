const fs = require('fs');

require('dotenv').config();
const mp3FolderPath = process.env.mp3FolderPath;

exports.getPlaylist = async (req, res) => {
  try {
    const mp3Files = await fs.promises.readdir(mp3FolderPath);
    const playlist = mp3Files.filter(file => file.endsWith('.mp3'));
    res.json({ playlist });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
