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

const query = async (key, dir) => {
    const MDBHash = decrypt(key);
  
    const directory = dir.split(".")
    // console.log(directory, MDBHash);
  
    const masterDB = await get(MDBHash);
    // console.log(masterDB)
    // console.log(masterDB[directory[0]])
    const documentHash = masterDB[directory[0]];
    const document = await get(documentHash);
    console.log(document)
    var key = Object.keys(document)[0]  

    const value = document[key]
    console.log(key, value)
    return [key, value]
  
  }


router.post('/', async function(req, res, next) {
 
    // final_res = await query(req.body.key, req.body.dir);
    await query(req.body.key, req.body.dir).then( (final_res) => {
        console.log(final_res);
        res.send(final_res)
        
    })
    //res.send(final_res);
    // res.send(final_res);
  
});

module.exports = router;
