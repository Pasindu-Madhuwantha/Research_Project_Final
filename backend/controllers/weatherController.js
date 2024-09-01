const Weather = require('../models/Weather');

exports.getAllWeather = async (req, res) => {
  try {
    const weather = await Weather.find();
    if (!weather || weather.length === 0) {
      return res.status(404).json({ error: 'No weather found' });
    }
    const paths = weather.map(weather => weather.path);
    res.json({ paths });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
