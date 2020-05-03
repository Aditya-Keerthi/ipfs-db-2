const IPFS = require('ipfs-api');
const ipfs = new IPFS ({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const IV = "5183666c72eec9e4"; // set random initialisation vector

// console.log(crypto.randomBytes(16).toString('hex'));

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

console.log(
  decrypt('LgT5+a2gH1vIjqgUJIarh6+eTXz3y5/sBqE1aBu8HB+8ExfW4AKMM20rmfwFowDC')
)

// console.log(decrypt('gNT443SyptdfkQVE66112P6kE8yp7plUnPR7wIC++gZBERGHdYU/zLeUIo8ADZz4'))

// console.log(decrypt('zGO3mTtgGHiHHHcz/sikEc4m+IxOkH5nxUiL016F2oOZ75uYyhHpafXobhB+gA=='))

const createMasterDB = () => {
  let obj = {
    asd: "QmbJWAESqCsf4RFCqEY7jecCashj8usXiyDNfKtZCwwzGb"

  }
  let buffer = Buffer.from(JSON.stringify(obj));

  const hashObj = new Promise((resolve, reject) => {

    ipfs.files.add(buffer, async (err, res) => {
      if (err) {
        console.log(err)
      }

      const hash = await res[0].hash;
      console.log(hash)
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

const get = async hash => {
  const url = 'https://gateway.ipfs.io/ipfs/' + hash;
  
  try {
    const response = await require("axios").get(url);
    return response.data

  } catch (error) {
    console.log(error);
  }

};

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

  const masterDBHash = new Promise((resolve, reject) => {

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
  return masterDBHash
  // return get(prevHash).then(async (res) => {

  // })

}

const setValues = async (docTitle, key, obj) => {
  let hash = '';

  const objHash = decrypt(key);
  const masterDB = await get(objHash)

  let updatedMasterDB = masterDB;

  // const keys = Object.keys(obj);
  // const values = Object.values(obj);
  // let updated_obj = {

  // };
  
  // for (let i=0; i < keys.length; i++) {
  //   updated_obj[keys[i]] = values[i]
  // }
  
  let buffer = Buffer.from(JSON.stringify(obj));

  const masterDBHash = new Promise((resolve, reject) => {

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

  const MDBHash = await masterDBHash;

  return MDBHash;
  
}

const query = async (key, dir) => {
  const MDBHash = decrypt(key);

  const directory = dir.split(".")
  // console.log(directory, MDBHash);
  console.log(directory)

  const masterDB = await get(MDBHash);
  // console.log(masterDB[directory[0]])
  const documentHash = masterDB[directory[0]];
  const document = await get(documentHash);
  console.log(document);
  const value = document[directory[1]]
  return value

}
console.log(encrypt('QmQEedAceSQQSYYdfkjSXz2bRsYAamXEijhYCxb3rVKDwz'));
// get('QmUrKwW6wCVVUj6w7jLu6rf4j6wkcwsu1CxxJB3dZ6mhas').then((res) => {
//   console.log("////////////////////////////////", res);
// })

// createMasterDB().then((res) => {
//   console.log(res)
// });

// updateValues("asd", 'LgT5+a2gH1vIjqgUJIarh6+eTXz3y5/sBqE1aBu8HB+8ExfW4AKMM20rmfwFowDC', {
//   asd: "hihimarkosupdate",
//   sdhaisdha: "Asdasd"
// }).then((res) => {console.log(decrypt(res))})

// createMasterDB().then((res) => {
//   console.log(res)
// });

// console.log(
//   query('6Kf79et102ed4UkDUC9Sstb4zyvjkDTTfVsAlBbOAufJcxG9LhcaqkGEv6eicX0R', 'asdasdr.werd').then((res) => {console.log(res)})
// )

// createMasterDB().then((res) => {console.log(res)})

// updateValues('QmZg1Vf1QAUX9UWrzs3JB8fqacoeF3Ca5PdvHzeqtZ111Q', {
//   asditya: "spelled it wrong"
// }).then((res) => {console.log(res)})

// setValues('QmZg1Vf1QAUX9UWrzs3JB8fqacoeF3Ca5PdvHzeqtZ111Q', {
//   new: "new"
// }).then((res) => {console.log(res)})

// updateFiles('QmUrKwW6wCVVUj6w7jLu6rf4j6wkcwsu1CxxJB3dZ6mhas', )

query('uLbvulOxLBKkwKiX9R3m4M5hnTE4p5jXIJIsqeCz/VyALiUXcuBjpEmp5WFRS3st', "asd.sdhaisdha").then((res) => {console.log(res)})

module.exports = { get, encrypt, decrypt} ;