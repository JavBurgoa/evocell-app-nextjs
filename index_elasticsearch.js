var elastic = require("@elastic/elasticsearch")
require('dotenv').config({ path: `.env.local` })
var Minio = require('minio');
const fs = require('fs');
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
                    "trees": value,
                    // Here maybe a mapping to keyword
                    }
        })

        // Somehow we need keywords but this is not the way:
        // client.indices.putMapping({
        //     index: idx,
        //     body: {
        //         properties: {
        //           "gene": { type:"keyword"},
        //           "trees":{ type:"keyword"},
        //         }
        //     }
        // })
    }
    
    
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
                "query" : search,
                "analyzer": "default"}
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


// Test analyzer
async function analyze(client, analyzer, text){
    client.indices.analyze({
        "analyzer" : analyzer,
        "text" : text
      })
}

// ##### Make clients ##### //

var minioClient = new Minio.Client({
    endPoint: 's3.embl.de',
    port: 443,
    useSSL: true, // enabled if using port 443, disabled if uing 80 (port 80 does not work with this embl instance)
    accessKey: process.env.AWS_ACCESS_KEY_ID, // in env.local
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
});


var ElastiClient = new elastic.Client({
    node: process.env.ESS_URL,
    auth: {
      username: process.env.ESS_USERNAME,
      password: process.env.ESS_PASSWORD || "changeme",
    },
    tls: {
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: false
      },
    // ssl doesn't work somehow
});



// ##### Update Elasticsearch ##### //

//Get dictionary
let TreesGenes = getFile("evocell", "searchDict30K.JSON")
TreesGenes.then((e) => {
   let treesgenes = JSON.parse(e)
   //deleteIndex("trees", ElastiClient).catch((e) => console.log(e))
   createIndex(treesgenes, "trees", ElastiClient).catch((e) => console.log(e))
   //countDocuments(ElastiClient).catch((e) => console.log(e))
})



// searchElastic(client=ElastiClient, search="\"6359\"", idx="trees").then((e) => {
//     console.log(e);
//     console.log(e.length);
//     console.log()})
// searchElastic(client=ElastiClient, search="Ned", idx="game").then((e) => console.log(e))

// console.log(ElastiClient.indices.analyze({
//     "analyzer" : "whitespace",
//     "text" : "6359.DN217718_C1_G2_I1.P1"
//   }).then((e) => console.log(e)))



// Update Elasticsearch

//createIndex({"Vamoave3":"peroestoquedes3"}, "a", ElastiClient).catch((e) => console.log(e))
//deleteIndex("a", ElastiClient).catch((e) => console.log(e))