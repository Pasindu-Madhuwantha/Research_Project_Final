const { spawn } = require('child_process');
require('dotenv').config();

exports.receiveData = (req, res) => {
  console.log('Received POST request at /receive-data');
  const { filePath } = req.body;

  if (!filePath) {
    console.log('Missing parameters');
    return res.status(400).json({ error: 'Missing parameters' });
  }

  console.log('Received filePath for server:', filePath);
  console.log('Received weatherSound:', weatherSoundGlobal);
  console.log('Received drumsSound:', drumsSoundGlobal);
  console.log('Received vinylSound:', vinylSoundGlobal);

  const pythonPath = process.env.pythonPath;
  const scriptPath = process.env.scriptPath;

  const pythonProcess = spawn(pythonPath, [scriptPath, filePath, weatherSoundGlobal, drumsSoundGlobal, vinylSoundGlobal]);

  let pythonOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    console.log('Python Script stdout:', data.toString());
    pythonOutput += data.toString();
  });

  // pythonProcess.stderr.on('data', (data) => {
  //   console.error('Python Script Warning:', data.toString());
  //   res.status(500).json({ error: 'Internal Server Error' });
  // });

  pythonProcess.on('close', (code) => {
    console.log(`Python script closed with code ${code}`);
    if (code !== 0) {
      return res.status(500).json({ error: 'Python script encountered an error' });
    }
    // Send the python output back to the client
    res.json({ success: true, message: 'Data received and processed successfully.', pythonOutput });
  });
};
