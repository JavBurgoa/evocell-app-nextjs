import style from "../styles/Trees.module.css"
var Minio = require('minio');

const Trees = ({ species }) => {
	return (
		<div>
			<iframe src="http://127.0.0.1:5000/" className={style.ete4frame} title="ete4">
			</iframe>
			<p>{species}</p>
		</div>
		)
}

export default Trees;


// Connection to Minio
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
	var species = minioClient.listObjects('evocell','Datasets', true)
	var species = await toArray(species)
	
	var species = species.map(function(e){
		return e.name.split('/')[0]
	})

	return {
  	  props: {species}
  }
};