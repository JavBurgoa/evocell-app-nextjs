import { Client } from '@elastic/elasticsearch'
var fs = require("fs")
require('dotenv').config({ path: __dirname + '/.env.local' })

// ############## Config
export const config = {
    api: {
      bodyParser: {
        sizeLimit: '1kb',
      },
    },
  }

//####### Funcitons
export async function connectToElasticsearch() {
    if (
      !process.env.ESS_USERNAME ||
      !process.env.ESS_PASSWORD
    ) {
      return 'ERR_ENV_NOT_DEFINED'
    }
    return new Client({
        node: process.env.ESS_URL,
        auth: {
          username: process.env.ESS_USERNAME,
          password: process.env.ESS_PASSWORD || "changeme",
        },
        tls: {
            ca: fs.readFileSync('./ca.pem'),
            rejectUnauthorized: false
          }, // ssl desn't work somehow
    })
  }


export async function ElasticSearch(client, gene, retrieveField){
    // Searches a string in the elasticserch cluster. ou can choose to search with an exact or substring pattern.

    // Attributes
    // ---------
    // client: Elasticsearch client logged in
    // gene: String. whatever you want to search in the elasticsearchi index
    // retrieveField. String, "gene" or "trees". If gene then the search will include substring search, otherwise it will be a exact search

    //########################

    // async function countDocuments(client){
    //     let count = await client.cat.indices()
    //     console.log(count)
    // }

    // countDocuments(client).catch((e) => console.log(e))
    //########################

    if(retrieveField ==  "trees"){
        // Exact search
        var body = {
            "query": {
                "bool": {
                    "must": [{
                        "term": {"gene.keyword": gene}
                    }]
                }
            },
        }

    }else if(retrieveField ==  "gene"){
        
        // Only do wildcard if search has enough length
        
        if(gene.length > 2){
            gene = "*" + gene + "*"
        }

        var body = {
            size: 100,
            query: {
                "query_string" : {"default_field" : "gene", 
                                  "query" : gene,
                                  "analyzer": "default"}
            }
        }
        // Search with substrings
        
    }

    
    // Search !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    var result = await client.search({
        index: 'trees',
        body: body
    })
    console.log(result)
    return(result)

}


// ####### Final function (will be exectued when recieving a POST)
export default async function searchES(req, res) {
try {
    const client = await connectToElasticsearch()

    // get hther you want to retrieve genes or trees
    var req = req.body.split("__")
    var gene = req[0]
    var retrieveField = req[1]

    // Modifications done to the search query
    gene = gene.replace("\|", " ")

    // search in genes
    const body = await ElasticSearch(client, gene, retrieveField)

    console.log(body)
    // Retrieve gene or its correspondent tree
    let hits = body.hits.hits
    let results = []

    hits.forEach((item) => {
        results.push(item._source[retrieveField]) // retrieve gene or trees
    })

    // For trees, pseparate them
    if(retrieveField == "trees"){
        console.log(results)
        results = results[0].split("|")
    }
    return res.send(results)
    
} catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message })
}
}

