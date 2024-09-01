const express = require('express');
const router = express.Router();
const vinylController = require('../controllers/vinylController');
const drumsController = require('../controllers/drumsController');
const weatherController = require('../controllers/weatherController');
const uploadController = require('../controllers/uploadController');
const receiveDataController = require('../controllers/receiveDataController');
const receiveFinalPathController = require('../controllers/receiveFinalPathController');
const playlistController = require('../controllers/playlistController');
const playController = require('../controllers/playController');
const downloadController = require('../controllers/downloadController');


// Vinyl routes
router.get('/api/vinyls', vinylController.getAllVinyls);

// Drums routes
router.get('/api/drums', drumsController.getAllDrums);

// Weather routes
router.get('/api/weather', weatherController.getAllWeather);

// Upload routes
router.post('/upload', uploadController.uploadFile);

// Receive Data routes
router.post('/receive-data', receiveDataController.receiveData);

// Receive Final Path routes
router.post('/receive-final-path', receiveFinalPathController.receiveFinalPath);

// Playlist routes
router.get('/api/playlist', playlistController.getPlaylist);

// Play routes
router.get('/api/play', playController.playMp3);

// Download routes
router.get('/api/download', downloadController.downloadMp3);

module.exports = router;
