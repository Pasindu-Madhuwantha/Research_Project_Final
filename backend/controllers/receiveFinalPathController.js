exports.receiveFinalPath = (req, res) => {
    console.log('Received POST request at /receive-final-path');
    const { filePath2 } = req.body;
  
    if (!filePath2) {
      console.log('Missing parameters');
      return res.status(400).json({ error: 'Missing parameters' });
    }
  
    console.log('Received final mp3 filePath for server:', filePath2);
  };
  