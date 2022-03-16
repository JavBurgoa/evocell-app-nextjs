var Minio = require('minio');

export const getStaticPaths = async () => {
    // Function to make arrays out of Streams (I don't know how to getStaticProps() export streams)
    const toArray = async function (stream) {
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


    // Fetch info
    var minioClient = new Minio.Client({
	    endPoint: 's3.embl.de',
	    port: 443,
	    useSSL: true, // enabled if using port 443, disabled if uing 80 (port 80 does not work with this embl instance)
	    accessKey: process.env.AWS_ACCESS_KEY_ID, // in env.local
	    secretKey: process.env.AWS_SECRET_ACCESS_KEY
	});

    var miniObjects = minioClient.listObjects('evocell', 'outputs',  true)

	var miniObjects = await toArray(miniObjects)
    var miniObjects = miniObjects.filter(dict => dict.name.endsWith(".JSON"))


    // Make dynamic routes names and add them to return()
    var paths = miniObjects.map(function(e){
		return{
                params: { dataset: e.name.split('/')[1] + "-" + e.name.split('/')[2] } // Pick the name of the folder after Datasets/ (the species names)}
        } 
	})

    return {
        paths,
        fallback: false
    }
}







// Send data of each specific dataset to the webpage. This depends on the "params" returned on getStaticPaths() 
export const getStaticProps = async (context) => {

	//#####################
	//###### FUNCTIONS
	//#####################
	// Function to make arrays out of Streams (I don't know how to getStaticProps() export streams)
	const toArray = async function (stream) {
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

	// Get data within file in Minio database
	function getJSON(bucket, name) {
	    const buf = []
	    return new Promise((resolve, reject) => {
	        minioClient.getObject(bucket, name, (err, stream) => {
	            if (err) {
	                return reject(err)
	            }
	            stream.on('data', (chunk) => buf.push(chunk))
	            stream.on('end', () => {
	                resolve(JSON.parse(buf.toString('ASCII')))
	            })
	        })
	    })
	}

	//#####################
	//#### CONNECT MINIO
	//#####################

	// Instantiate the minio client with the endpoint and access keys as shown below.
	var minioClient = new Minio.Client({
	    endPoint: 's3.embl.de',
	    port: 443,
	    useSSL: true, // enabled if using port 443, disabled if uing 80 (port 80 does not work with this embl instance)
	    accessKey: process.env.AWS_ACCESS_KEY_ID, // in env.local
	    secretKey: process.env.AWS_SECRET_ACCESS_KEY
	});


	//###################
	//###### GET DATA
	//###################

	// Get all species names
	// list all objects in Stream format
	var miniObjects = minioClient.listObjects('evocell', 'outputs',  true);
    var miniObjects = await toArray(miniObjects);
    

    // Pick only the path pertinent to the species (outputs the path in variable "jsonPath")
    var id = context.params.dataset.replace("-", "/");

    for(var j=0; j < miniObjects.length; j++ ){
        var potentialPath = miniObjects[j].name
        // Checkif is metadata file
        if(potentialPath.endsWith("\.JSON")){

            // Check if the JSON belongs to the species and dataset getStaticPaths is looking for
            var potentialPath = potentialPath.split("/")
            potentialPath.shift() //erase first element ("/outputs/")
            potentialPath.pop() // erase last element ("/dataset_name/")
            potentialPath = potentialPath.join("/")
            
            if(potentialPath === id){
                //Put in variable the path to the JSON in Minio
                var jsonPath = miniObjects[j].name
            }

        }
    };

    // Finally get the data from minio using the correct path
	var metaData = await getJSON('evocell', jsonPath)
    console.log(metaData)
            return {
                props: {metaData}
            }
        
    };



const Details = ({metaData}) =>{
    return(
        
        <div>
        <p onClick={() => console.log({metaData})}><h1>Holaaaa!</h1></p>
        <p>{metaData.title}</p>
        <p>{metaData.abstract}</p>
        <p>{metaData.geo_series}</p>

        </div>
    )
}

export default Details;