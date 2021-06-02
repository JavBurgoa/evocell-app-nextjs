import fs from 'fs';
import Link from 'next/link';
var Minio = require('minio');

// Main datasheet home page
const Home = ({ data }) => {
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
			data.map( array => <>
							   <tr>
									{columns.map( col => <td key = {col}>{array[col]}</td>) }

									<td className = "buttonContainer">
										<button onClick={(e) => al(e, '../../Datasets/S3database/' + array.Species.replace(' ', '_') + '/' + array.Species.replace(' ', '_') + '.json')}>↓</button>
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

	// Instantiate the minio client with the endpoint
	// and access keys as shown below.
	var minioClient = new Minio.Client({
	    endPoint: 's3.embl.de',
	    port: 443,
	    useSSL: true, // enabled if using port 443, disabled if uing 80 (port 80 does not work with this embl instance)
	    accessKey: 'tHewRc4518A4ZjlzBoVdRnw3f1AA59Tb', // Need to export them with set AWS_ACCESS_KEY_ID='' and  AWS_SECRET_ACCESS_KEY=''
	    secretKey: 'x1EEMD9HXoK0O7hvGkHDA6I2xFEZ5tel'
	});


	// list all objects in Stream format
	var Steam = minioClient.listObjects('evocell','', true)

	// Function to make arrays out of Streams (I don't know how to getStaticProps() so export streams)
	//**********************************************//
	const toArray = async function (stream) {
	    const array = [];
		    try {
		        for await (const item of stream) {
		            array.push(item);
		        }
		    }
		    catch (ex) {
		        const error = new StreamToArrayError_1.StreamToArrayError(ex.message, array);
		        throw error;
		    }
		    return array;
	};
	//*********************************************//

	// Transform stream to array
	var array = await toArray(Steam)
	for(var i in array){
		console.log(array[i].name)
	}



// hERE TRIALS TO OUTPUT STREAMS THAT DID NOT WORK
//	var chunksos = []

	// Error handler
//	stream.once('error', (err) => {
//	    console.error("Error:" + err); 
//	});


	// treat each object's name to get species
//	stream.on('data', (chunk) => {
//	    chunksos.push(chunk.name.split('/')[0]); // Get only species name
//		chunksos = chunksos.filter((v,i) => chunksos.indexOf(v) === i) // remove duplicate species
//		console.log(chunksos) // Outputs all species names
//	});



	// When files are done being read
	// console.log all Json files in our minio
//	stream.on('end', () => {
		// For each Species name...
//		for(var i in chunksos){

//			var pathToJSONS = chunksos[i] + '/'+ chunksos[i] + '.json'

//			minioClient.getObject('evocell', pathToJSONS, function(err, dataStream) {
  //				if (err) {
//    				return console.log(err)
//  				}
// 				else dataStream.on('data', function(chunk) {
//    				console.log(chunk.toString('ASCII'))
//      			})
//			});

//		}
//	});


	// Same as before but hardcoded for each object
	// read JSON
//	minioClient.getObject('evocell', 'Spongilla_lacustris/Spongilla_lacustris.json', function(err, dataStream) {
//	  if (err) {
//	    return console.log(err)
//	  }
//	  else dataStream.on('data', function(chunk) {
//	    console.log(chunk.toString('ASCII'))
//	      })
//	});

	//##############################################################################################################//
	//##############################################################################################################//




	// Local files
	//******************************//


	const speciesNames = fs.readdirSync('../../Datasets/S3database/'); // important: SYNC
	const databasePath = '../../Datasets/S3database/'
	const pathsToFiles = speciesNames.map(species => databasePath + species + '/' + species + '.json')

	var data = []
	for(var path in pathsToFiles){
		const a = fs.readFileSync(pathsToFiles[path], 'utf8', (err, jsonString) => { return jsonString }); // important: SYNC
		data.push(JSON.parse(a))
}

  	return {
  	  props: {data}
  }
};

//=================================================================//