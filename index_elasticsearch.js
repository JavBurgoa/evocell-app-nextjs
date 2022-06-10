var elastic = require("@elastic/elasticsearch")
require('dotenv').config({ path: `.env.local` })
var Minio = require('minio');
// Run to avoid unuseful warnings: npm config set strict-ssl=false

// ##### Functions ##### //

async function createIndex(dictio, idx, client) {
    //Add a new index to a elasticsearch client
    for (var key in dictio){
        var value = dictio[key];
        console.log("value: " + value)
        console.log("key: " + key)

        // Add to index
        await client.index({
                    index: idx,
                    body: {
                      "gene": key,
                      "trees": value
                    }
                  })
            }
    
    client.indices.putMapping({
        index: idx,
        body: {
            properties: {
              "gene": { type:"keyword"}
              }
        }
    })
    // await client.index({
    //     index: "game",
    //     body: {
    //       character: 'Ned Stark',
    //     quote: 'Winter is coming.'
    //     }
    //   })
    
      await client.indices.refresh({index: idx})
}

async function deleteIndex(idx, client){
    // Delete all documents with a particular index in a client
    await client.indices.delete({
        index: idx
        })
}

async function countDocuments(client){
    let count = await client.cat.indices()
    console.log(count)
}


function getFile(bucket, name) {
	    const buf = []
	    return new Promise((resolve, reject) => {
	        minioClient.getObject(bucket, name, (err, stream) => {
	            if (err) {
	                return reject(err)
	            }
	            stream.on('data', (chunk) => buf.push(chunk))
	            stream.on('end', () => {
	                resolve(buf.toString('ASCII'))
	            })
	        })
	    })
}


async function searchElastic(client, search, idx, field){
const body = await client.search({
    index: idx,
    body: {
        "query": {
            "query_string" : {
                "default_field" : "gene", 
                "query" : search}
        }
    }
  })

  let hits = body.hits.hits
  let results =[]
  hits.forEach((item) => {
    results.push(item._source.gene)
  })
  return results
  //return body.hits.hits
}
// ##### Make clients ##### //

var minioClient = new Minio.Client({
    endPoint: 's3.embl.de',
    port: 443,
    useSSL: true, // enabled if using port 443, disabled if uing 80 (port 80 does not work with this embl instance)
    accessKey: process.env.AWS_ACCESS_KEY_ID, // in env.local
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
});

console.log(process.env.ESS_URL, process.env.ESS_USERNAME, process.env.ESS_PASSWORD, process.env.ESS_CERTIFICATE)

// https://stackoverflow.com/questions/62792477/cant-connect-to-elasticsearch-with-node-js-on-kubernetes-self-signed-certifica
// ssl is fundamental for elasticsearch in kubernetes

// found rthis aswell https://7thzero.com/blog/using-nodejs-to-connect-to-elasticsearch-with-a-private-certificate-authority
//https://discuss.elastic.co/t/elastcsearch-client-javascript-connection-error/300894/4
var ElastiClient = new elastic.Client({
    host: process.env.ESS_URL,
    node:process.env.ESS_URL,
    auth: {
      username: process.env.ESS_USERNAME,
      password: process.env.ESS_PASSWORD,
    },
    ssl: {
        ca: process.env.ESS_CERTIFICATE,
        rejectUnauthorized: true,
      },
});



// ##### Update Elasticsearch ##### //

// Get dictionary
// let TreesGenes = getFile("evocell", "searchDict30K.JSON")
// TreesGenes.then((e) => {
//    let treesgenes = JSON.parse(e)
//    //deleteIndex("trees", ElastiClient).catch((e) => console.log(e))
//    //createIndex(treesgenes, "trees", ElastiClient).catch((e) => console.log(e))
//    //countDocuments(ElastiClient).catch((e) => console.log(e))
// })
console.log("a ver")
// ElastiClient.ping({
//     // ping usually has a 3000ms timeout
//     requestTimeout: Infinity,
//     // undocumented params are appended to the query string
//     hello: "elasticsearch!"
//   }, function (error) {
//     if (error) {
//       console.trace('elasticsearch cluster is down!');
//     } else {
//       console.log('All is well');
//     }
//   });


// searchElastic(client=ElastiClient, search="6526.TR21018_C0_G1_I1.P1", idx="trees").then((e) => {
//     console.log(e);
//     console.log(e.length);
//     console.log()})
//searchElastic(client=ElastiClient, search="Ned", idx="game").then((e) => console.log(e))
ElastiClient.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: Infinity,
    // undocumented params are appended to the query string
    hello: "elasticsearch!"
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });
// // Update Elasticsearch
//
//createIndex("game-of-thrones", "a", ElastiClient).catch((e) => console.log(e))

//deleteIndex("game-of-thrones").catch((e) => console.log(e))
//createIndex("game-of-thrones").catch((e) => console.log(e))