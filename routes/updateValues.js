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

const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; // set random initialisation vector

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

const updateValues = async (docTitle, key, obj) => {
    let hash = '';
  
    const objHash = decrypt(key);
    const masterDB = await get(objHash)
    const prevHash = masterDB[docTitle];
  
    let updatedMasterDB = masterDB;
  
    const res = await get(prevHash);
  
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    let updated_obj = res;
    
    for (let i=0; i < keys.length; i++) {
      updated_obj[keys[i]] = values[i]
    }
    
    let buffer = Buffer.from(JSON.stringify(updated_obj));
  
    return new Promise((resolve, reject) => {
  
      ipfs.files.add(buffer, async (err, res) => {
        if (err) {
          console.log(err)
        }
  
        // console.log(res[0].hash)
        hash = await res[0].hash
        // console.log(url)
  
        updatedMasterDB[docTitle] = hash;
        let buffer = Buffer.from(JSON.stringify(updatedMasterDB));
  
        resolve(
  
          new Promise((resolve, reject) => {
  
            ipfs.files.add(buffer, async (err, res) => {
              if (err) {
                console.log(err)
              }
  
              const updatedMasterDBHash = await res[0].hash
  
              resolve(encrypt(updatedMasterDBHash));
  
            })
  
          })
  
        )
        
      })
  
    })
  
    // masterDBHash.then((res) => {console.log(res)})
    // return masterDBHash
    // return get(prevHash).then(async (res) => {
  
    // })
  
}

router.post('/', async function(req, res, next) {
  console.log(req.body.doctitle);
    await updateValues(req.body.doctitle, req.body.key, req.body.obj).then((result) => {
        res.send(result);
    })

});

module.exports = router;
