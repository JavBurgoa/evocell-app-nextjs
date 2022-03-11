var Minio = require('minio');
import Image from 'next/image';
import downImage from "/public/down.png" // download button image
import Script from 'next/script'
import {speciesExists} from "/static/indexFunctions"

// Main datasheet home page
const Home = ({ metaData }) => {
	// List all JSON files given our structure
	const columns = ['species', 'title', 'ontogenic_stage', "tissue_type"]
    
	return (
	<>
        <Script src = "/static/indexScript.js"/>

		<table className="Datasheetable">
		  <thead>
			<tr>
				<th className="speciesHeader">Species</th>
				<th className="paperHeader">Paper</th>
				<th>Ontogenic stage</th>
                <th>Tissue</th>
				<th className="downloadHeader">Download</th>
			</tr>
		  </thead>
          
		  <tbody>
          
			{metaData.map( array => <>
                                    <tr className = {array["species"]}>

                                            { columns.map( col => <td key = {col}>{array[col]}</td>) }

                                            <td className = "buttonContainer">
                                                <button onClick={(e) => alert("Download")}>
                                                    <Image
                                                    src = {downImage}
                                                    alt = "Download"
                                                    width = {20}
                                                    height = {20}
                                                    />
                                                </button>
                                                
                                            </td>
                                            
                                    </tr>
                                    
							   </>
					)
			}
		</tbody>
		</table>
	</>

	)
};

export default Home;
//#### To make a download link: After set the policy of specific bucket to download in minio server, we can get the resource public url as follow:
//var publicUrl = minioClient.protocol + '//' + minioClient.host + ':' + minioClient.port + '/' + minioBucket + '/' + obj.name
//https://github.com/minio/minio-js/issues/588

// Get Data to put it in previous HTML (Home)
// ================================================================//


// Get all JSONs content into a single array
// Also, if this code below does not exist, import fs on the top gives an error




//S3
export async function getStaticProps() {

	// Minio
	//##############################################################################################################//
	//##############################################################################################################/

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

	// create function startsWith because it doesnt exist, evaluates whther a string starts with
	String.prototype.startsWith = function(str){ return this.indexOf(str) == 0; }
	
	function keep_only_Datasets(species){
		//This function takes the array of paths and eliminates all files beginning in anything other than "Datasets".
		// This is necessary becauese we don't want to show in the datasheet anything that is not within the Datasets folder in Minio
		var out = []
		species.map(function(path){
			if(path.name.startsWith("Dataset")){
				out.push(path)
			}
		})

		return(out)  
	}
	
	// Eliminate Duplicates inside array
	let eliminateDups = (names) => names.filter((v,i) => names.indexOf(v) === i);

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


	//Function to get presigned URLs for later download of h5ad files
	function getH5AD_URLs(bucket, name) {
	    return new Promise((resolve, reject) => {
	        minioClient.presignedUrl('GET', bucket, name, 60*30, function(err, presignedUrl) {
  				if (err) return console.log(err)
  				
  				resolve(presignedUrl)
			})
	    }
	  )
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
	var miniObjects = minioClient.listObjects('evocell', 'outputs',  true)

	var miniObjects = await toArray(miniObjects)
	//var species = keep_only_Datasets(species) # Notcesary since we add 'Datasets' to minioClient.listObjects()
	
	// Get species names (with '_')
	var species = miniObjects.map(function(e){
		return e.name.split('/')[1] // Pick the name of the folder afte Datasets/ (the species names)
	})  
	
	var species = eliminateDups(species)
	

	// Get all metadata from JSON files in Minio
	var metaData = []
	for(var i = 0; i < miniObjects.length; i++){
        
        // Get JSON files paths
        var path = miniObjects[i]["name"]
        if(path.endsWith(".JSON")){

            // Get dictionary from dataset
		    var dat = await getJSON('evocell', "/" + path)
            
            // Add paper dataset identifier (1_1, 3_2, etc.)
            dat.identifier = path.split("/")[2];

            // Add UCSC hyperklink?

            // put keys in dat["custom"] out of the custom key
            var dat= Object.assign({}, dat, dat["custom"]);
            delete dat["custom"];

            // Add to array
		    metaData.push(dat)
        }

	}

    console.log(metaData)

	//##################################
	//#### PRE SIGNED URLS FOR DOWNLOAD
	//##################################
	//take a look at URL generator demo, maybe it's differernt than this:
	//var h5adURLs = []
	//for(var sp in species){
	//	var dat = await getH5AD_URLs('evocell', species[sp] + '/' + species[sp] + '.h5ad')
	//	h5adURLs.push(dat)
	//}

	//console.log(h5adURLs[1])

	return {
		props: {metaData}
	}

};

//=================================================================//