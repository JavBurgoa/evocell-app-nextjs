import { Client } from '@elastic/elasticsearch'

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
      !process.env.ESS_CLOUD_ID ||
      !process.env.ESS_CLOUD_USERNAME ||
      !process.env.ESS_CLOUD_PASSWORD
    ) {
      return 'ERR_ENV_NOT_DEFINED'
    }
    return new Client({
      cloud: {
        id: process.env.ESS_CLOUD_ID,
      },
      auth: {
        username: process.env.ESS_CLOUD_USERNAME,
        password: process.env.ESS_CLOUD_PASSWORD,
      },
    })
  }

// ####### Final function (will be exectued when recieving a POST)
export default async function searchES(req, res) {
try {
    const client = await connectToElasticsearch()
    let results = []
    console.log("searching elastic")
    const body = await client.search({
    index: 'trees',
    body: {
        "query": {
            "query_string" : {"default_field" : "gene", "query" : req.body}
        }
    }
    })

    let hits = body.hits.hits
    hits.forEach((item) => {
    results.push(item._source.gene)
    })
    return res.send(results)
} catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message })
}
}

