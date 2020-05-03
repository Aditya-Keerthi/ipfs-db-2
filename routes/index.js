var express = require('express');
var router = express.Router();
const path = require('path')

/* GET home page. */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/iApp.js'));
});

module.exports = router;
