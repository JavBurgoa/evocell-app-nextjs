var Minio = require('minio');

export async function connectToMinio(){
    if (
        !process.env.AWS_ACCESS_KEY_ID ||
        !process.env.AWS_SECRET_ACCESS_KEY
      ) {
          return 'ERR_ENV_NOT_DEFINED'
    }

    // If env defined:
    return new Minio.Client({
        endPoint: 's3.embl.de',
        port: 443,
        useSSL: true, // enabled if using port 443, disabled if uing 80 (port 80 does not work with this embl instance)
        accessKey: process.env.AWS_ACCESS_KEY_ID, // in env.local
        secretKey: process.env.AWS_SECRET_ACCESS_KEY
    });    
}



export async function toArray (stream) {
    const array = [];
        try {
            for await (const item of stream) {
                array.push(item);
            }
        }
        catch (ex) {
            //const error = new StreamToArrayError_1.StreamToArrayError(ex.message, array);
            throw ex;
        }
        return array;
};

// Define function to get all objects from the minio outputs/ folder
export async function getAllObjects(bucket, folder, minioClient){
    // this function retrieves all objects paths in a given bucket and folder

    var miniObjects = minioClient.listObjects(bucket, folder,  true)
    var miniObjects = await toArray(miniObjects)

    return(miniObjects)
}

export function selectH5ADs(miniObjects){
    // Uses output of getAllObjects. It filters all paths to objects that don't have the .h5ad extension
    var h5adPaths = []
    for(var i = 0; i < miniObjects.length; i++){
        var path = miniObjects[i]["name"]

        if(path.endsWith(".h5ad")){
            h5adPaths.push(path)
        }
    }

    return(h5adPaths)
}

export function chooseH5AD(miniObjects, species, identifier){
    // Uses output of selectH5ADs. It chooses one of the paths based on Species and identifier
    const id = species + "/" + identifier

    for(var j=0; j < miniObjects.length; j++ ){

        // Check if the JSON belongs to the species and dataset getStaticPaths is looking for
        var potentialPath = miniObjects[j].split("/")
        potentialPath.shift() //erase first element ("/outputs/")
        potentialPath.pop() // erase last element ("/dataset_name.extension")
        potentialPath = potentialPath.join("/")
        
        if(potentialPath === id){
            //Put in variable the path to the JSON in Minio
            var finalPath = miniObjects[j]
        }
        
    }

    
    return(finalPath)

}

// Define function to get Minio downloadable URLs from private bucket 
export function getH5AD_URLs(bucket, name, minioClient){
     var URL = []
     new Promise((resolve, reject) => {
            minioClient.presignedGetObject(bucket, name, 60*2, function(err, presignedUrl) {
                  if (err) return console.log(err)
                  
                  resolve(URL.push(presignedUrl))
            })
        }
      )

     return(URL)
      
}  

//################ Final function #################//
// Define function that gathers all previous functions and then gets URL and sends it back to the client that made the POST req	
export async function asyncCall(req, res) {
    let minioClient = connectToMinio()
    var miniObjects = await getAllObjects("evocell", "outputs", minioClient)
    miniObjects = selectH5ADs(miniObjects)
    finalPath = chooseH5AD(miniObjects, req.body.species, req.body.identifier)
    
    // Return url if the path exists, if not return a message
    if(finalPath === undefined){
        var result = "NotFound"
    }else{
        var result = await getH5AD_URLs('evocell', finalPath);
        result = result[0]
    }
     
    res.json({
        status: 'success',
        body: result
    })
}


//################ Exectute when recieving a POST message #################//
export default asyncCall();
