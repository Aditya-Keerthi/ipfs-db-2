var express = require('express');
var router = express.Router();
const IPFS = require('ipfs-api');
const ipfs = new IPFS ({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; // set random initialisation vector

const get = async hash => {
    const url = 'https://gateway.ipfs.io/ipfs/' + hash;
    
    try {
      const response = await require("axios").get(url);
      return response.data
  
    } catch (error) {
      console.log(error);
    }
  
  };

var encrypt = ((val) => {
    let cipher = require('crypto').createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  });
  
  var decrypt = ((encrypted) => {
    let decipher = require('crypto').createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  });

/* GET users listing. */
router.post('/encrypted', async function(req, res, next) {
    newHash = await decrypt(req.body.hash);
    await get(newHash)
    .then( (finalResult) => {
        console.log(newHash)
        // res.send(finalResult);
        res.send(newHash);
    })
    .catch(err => {
        console.log(err)
        res.send(err)
    })
});

router.post('/decrypted', async function(req, res, next) {
    await get(req.body.hash).then( (finalResult) => {
        res.send(finalResult);
    })
});

router.post('/hasher', async function(req, res, next) {
    finalResult = await encrypt(req.body.hash)
    res.send(finalResult);
});

module.exports = router;   
