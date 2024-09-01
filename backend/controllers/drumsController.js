const Drums = require('../models/Drums');

exports.getAllDrums = async (req, res) => {
  try {
    const drums = await Drums.find();
    if (!drums || drums.length === 0) {
      return res.status(404).json({ error: 'No drums found' });
    }
    const paths = drums.map(drums => drums.path);
    res.json({ paths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
