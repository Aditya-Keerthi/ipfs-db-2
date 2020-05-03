var express = require('express');
var router = express.Router();
const IPFS = require('ipfs-api');
const ipfs = new IPFS ({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

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

const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; // set random initialisation vector
// const fetch = require('../fetch');
const createMasterDB = () => {
    let obj = {
      id : Math.floor(Math.random() * 100000)
    }
    let buffer = Buffer.from(JSON.stringify(obj));
  
    const hashObj = new Promise((resolve, reject) => {
  
      ipfs.files.add(buffer, async (err, res) => {
        if (err) {
          console.log(err)
        }
  
        const hash = await res[0].hash;
        // console.log(hash)
        const e = encrypt(hash)
  
        resolve(e)
  
      })
  
    })
  
    return hashObj
  
    // hashObj;
  
    // hashObj.then((res) => {
    //   console.log(encrypt(res));
    // })
  
  }

/* GET users listing. */
router.get('/', function(req, res, next) {
    createMasterDB().then((result) => {
         // result is the encrypted private key
        res.send(result);

    })
});

module.exports = router;
