const Vinyl = require('../models/Vinyl');

exports.getAllVinyls = async (req, res) => {
  try {
    const vinyls = await Vinyl.find();
    if (!vinyls || vinyls.length === 0) {
      return res.status(404).json({ error: 'No vinyls found' });
    }
    const paths = vinyls.map(vinyl => vinyl.path);
    res.json({ paths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
