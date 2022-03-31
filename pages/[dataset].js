var Minio = require('minio');
import style from "../styles/[dataset].module.css"
import Image from "next/image"

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
            potentialPath.pop() // erase last element ("/dataset_name.extension")
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




    // Functions for HTML
    const collapse = (id) => {
        // Obsolete
        // applied to a button it collapses whatever DOM element by id

        var panel = document.getElementById(id)
        console.log(panel.style.display)
        if (panel.style.display === "block"){
                panel.style.display = "none"
            } 
        else { panel.style.display = "block" }

    }

    const  metaDataTop = (metaData, top, second) => {
        // Outputs metaData.second if there is no metaData.top
        // Used for example to show a biorxiv link only if there is no published paper link

        if(metaData[top] === ""){
            var text = metaData[second]
        }else{var text = metaData[top]}
        
        return(text)

    }



    const switchTab = (to) => {
        // This function goes in an onclick event
        // When clicked on it it will turn one ofthte sidebar buttons active aswell as one of the contents
        // Which one is activated is chosen with the "to" argument whihc should be a number from 1 to 3
        
        
        // Remove active class from active buton/content
        var dataIds = [1,2,3]
        dataIds.splice(to-1, 1)

        dataIds.forEach((id)=>{
            const activeButton = document.getElementById("data_tab_" + id.toString())
            const activeContent = document.getElementById("data_content_" + id.toString())

            console.log("aaaaaaaaaa!!!!!!!!!!")
            console.log(activeContent)
            
            activeButton.className = style.tab_btn
            activeContent.className = style.tab_content
        })

        // Change selected divs to active
        const tabBarName = "data_tab_" + to.toString()
        const tabContentName = "data_content_" + to.toString()
        const tabBar = document.getElementById(tabBarName)
        const tabContent = document.getElementById(tabContentName)

        tabBar.className = style.tab_btn_active // button
        tabContent.className = style.tab_content_active // content        
    }

const download = () =>{

    return(DownloadLink)
}

// POST request for h5ad downloading
async function postData(url = '', data = {}) {
    // This function is th one actually making the post request. 
    // However it goes inside an async function thadds a .then() after this function
    // Otherwise it won't work by itself
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    const json = await response.json();
    return json
  }
  
  // send POST request and .then(do whatever)
async function getH5AD (data){
      //This is the actual function that goes into the html

      postData('http://localhost:3001/', data)
    .then(res => {
        alert(res.body)
          //window.location.href = res.body
    })
  
  }
  

// Actual HTML
const Details = ({metaData}) =>{

    return(
        
        <div>
            <div>
                <div className={style.dataset_btn_div}>
                    <button className={style.download_btn} onClick={()=>getH5AD({'Species':'Capitella_teleta_Stage4'})}>Download</button>            
                    <a className={style.UCSC_btn} href="https://cells-test.gi.ucsc.edu/?ds=evocell+clyhem">
                        UCSC &#x1F517;
                    </a>
                    
                </div>
                <iframe src="https://cells-test.gi.ucsc.edu/?ds=evocell+clyhem" className={style.UCSCiframe} title="UCSC Cell Browser" alt = "UCSC Cell Browser"></iframe>
            </div>

            

            <div className={style.tabs}>

                <div id="sidebar" className={style.sidebar}>
                    <button className={style.tab_btn_active} id = "data_tab_1" onClick={() => switchTab(1)}>Publication</button>
                    <button className={style.tab_btn} id = "data_tab_2" onClick={() => switchTab(2)}>Methods</button>
                    <button className={style.tab_btn} id = "data_tab_3" onClick={() => switchTab(3)}>Dataset</button>
                </div>
                <div className={style.content}>
                    <div className={style.tab_content_active} id = "data_content_1">
                        <p className={style.description}><span>Title: </span><a href = {metaDataTop(metaData, "paper_url", "biorxiv_url")}>{metaData.title}</a></p>
                        <p className={style.description}><span>Abstract: </span> <br></br> {metaData.abstract}</p>
                        <p className={style.description}><span>Doi: </span> {metaData.doi}</p>
                        <p className={style.description}><span>Author&apos;s institution: </span> {metaData.institution}</p>
                        <p className={style.description}><span>Author: </span> {metaData.author}</p>
                        <p className={style.description}><span>Lab: </span> {metaData.lab}</p>
                    </div>
                    <div className={style.tab_content} id = "data_content_2">
                        <p className={style.description}><span>Methods summary: </span><br></br>{metaData.methods}</p>
                        <p className={style.description}><span>Sequencing: </span>{metaData.custom.sequencing_method}</p>
                        <p className={style.description}><span>Genome: </span>{metaData.custom.genome}</p>
                        <p className={style.description}><span>Transcriptome: </span>{metaData.custom.transcriptome}</p>
                        <p className={style.description}><span>Notes: </span>{metaData.custom.notes}</p>
                    </div>
                    <div className={style.tab_content} id = "data_content_3">
                        <p className={style.description}><span>Ontogenic stage: </span>{metaData.custom.ontogenic_stage}</p>
                        <p className={style.description}><span>Tissue: </span>{metaData.custom.tissue_type}</p>
                        <p className={style.description}><span>Number of cells: </span>{metaData.custom.number_of_cells}</p>
                        <p className={style.description}><span>GEO: </span>{metaData.geo_series}</p>
                        <p className={style.description}><span>SRA: </span>{metaData.sra_study}</p>
                        <p className={style.description}><span>Specialised resources: </span>{metaData.custom.more_specialised_resources}</p>
                        <p className={style.description}><span>Submitter: </span>{metaData.submitter}</p>
                    </div>
                </div>

            </div>



        </div>


    )
}

export default Details;