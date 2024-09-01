const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /mid/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Please upload a .mid file.");
  }
}).single('midiFile');

exports.uploadFile = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).json({ error: err });
    }

    console.log('Received POST request to /upload');
    console.log('Received file:', req.file);

    const midiFilePath = req.file.path;
    const weatherSound = req.body.weatherSound;
    const drumsSound = req.body.drumsSound;
    const vinylSound = req.body.vinylSound;

    weatherSoundGlobal = weatherSound;
    drumsSoundGlobal = drumsSound;
    vinylSoundGlobal = vinylSound;

    console.log(weatherSound)
    console.log(drumsSound)
    console.log(vinylSound)

    console.log('Starting Python script execution...');
    const pythonPath = process.env.pythonPath;
    const pythonProcess = spawn(pythonPath, ['script.py', midiFilePath]);

    let generatedLofiFile = '';
    let responseSent = false;

    pythonProcess.stdout.on('data', (data) => {
      generatedLofiFile += data.toString();
      console.log('Python Script stdout:', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python Script Warning:', data.toString());
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

  });
};
