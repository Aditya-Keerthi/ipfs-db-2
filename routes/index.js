var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/iApp.js'));
});

module.exports = router;
