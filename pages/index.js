import Link from 'next/link';
var Minio = require('minio');
import Image from 'next/image'

// Main datasheet home page
const Home = ({ metaData }) => {
	// List all JSON files given our structure
	const columns = ['Species', 'Paper', 'Ontogenic_Stage', 'Number_of_cells', 'GEO_Number']
	
	const al = (e, path) => {return alert(path)} //erase
	return (
	<>
		<table>
		  <thead>
			<tr>
				<th className="speciesHeader">Species</th>
				<th className="paperHeader">Paper</th>
				<th>Ontogenic stage</th>
				<th>Number of cells</th>
				<th>GEO Number</th>
				<th className="downloadHeader">Download</th>
			</tr>
		  </thead>
		  <tbody>
			{
			metaData.map( array => <>
							   <tr>
									{columns.map( col => <td key = {col}>{array[col]}</td>) }

									<td className = "buttonContainer">
										<button onClick={(e) => alert("Download")}><Image 
																					src = "/down.png"
																					alt = "Download picture"
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
	var species = minioClient.listObjects('evocell','', true)
	var species = await toArray(species)

	// Get species names (with '_')
	var species = species.map(function(e){
		return e.name.split('/')[0]
	})   
	var species = eliminateDups(species)


	// Get all metadata from JSON files in Minio
	var metaData = []
	for(var sp in species){
		var dat = await getJSON('evocell', species[sp] + '/' + species[sp] + '.json')
		metaData.push(dat)
	}

	//##################################
	//#### PRE SIGNED URLS FOR DOWNLOAD
	//##################################
	var h5adURLs = []
	for(var sp in species){
		var dat = await getH5AD_URLs('evocell', species[sp] + '/' + species[sp] + '.h5ad')
		h5adURLs.push(dat)
	}

	console.log(h5adURLs[1])

  	return {
  	  props: {metaData}
  }
};

//=================================================================//