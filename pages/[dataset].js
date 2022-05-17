var Minio = require('minio');
import style from "../styles/[dataset].module.css"
import Markdown from 'react-markdown'
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

    // add identifier to the dictionary
    const identifier = jsonPath.split("/")[2]
    metaData["identifier"] = identifier




            return {
                props: {metaData}
            }
        
    };




    // Functions for HTML
    const collapse = (id) => {
        // Obsolete
        // applied to a button it collapses whatever DOM element by id

        var panel = document.getElementById(id)

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



// Actual HTML
const Details = ({metaData}) =>{

    // ##### Functions to connect to minio api (Sends message to minio api, 
    // ##### this one get a download url and send it back to the app))

    async function postData(url = '', data = {}) {
    
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        console.log(JSON.stringify(data))
        const json = await response.json();
        return json
     }
          
      async function getresponse (data){
        postData('api/minio', data)
        .then(res => {
                if(res.body === "NotFound"){
                    alert("This dataset is not available. Please contact us for more information.")
                }else{
                    window.location.href=res.body;
                }
            })
       }
    

       
    return(
        
        <div id="dataset_full_content">

                <div className={style.iframe_div}>
                    
                    <iframe src={"https://cells-test.gi.ucsc.edu/?ds=evocell+" + metaData.custom.ucsc_id} className={style.UCSCiframe} title="UCSC Cell Browser" alt = "UCSC Cell Browser"></iframe>
                    <div className={style.dataset_btn_div}>
                        <button className={style.download_btn} onClick={()=>getresponse({'species':metaData.custom.species.replace(" ", "_"), 'identifier':metaData.identifier})}>Download</button>            
                        <a className={style.UCSC_btn} href={"https://cells-test.gi.ucsc.edu/?ds=evocell+" + metaData.custom.ucsc_id}>
                            <img
                                src="expand-svgrepo-com.svg"
                                alt="logo"
                                width="40"
                                height="40"
                            />
                        </a>
                    </div>

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
                        <p className={style.description}><span>Abstract: </span> <br></br> <Markdown>{metaData.abstract}</Markdown></p>
                        <p className={style.description}><Markdown>{"**doi:** " + metaData.doi}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Author&apos;s institution:** " + metaData.institution}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Author:** " + metaData.author}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Lab:** " + metaData.lab}</Markdown></p>
                    </div>
                    <div className={style.tab_content} id = "data_content_2">
                        <p className={style.description}><span>Methods summary: </span><br></br><Markdown>{metaData.methods}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Sequencing:** " + metaData.custom.sequencing_method}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Genome:** " + metaData.custom.genome}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Transciptome:** " + metaData.custom.transcriptome}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Notes:** " + metaData.custom.notes}</Markdown></p>
                    </div>
                    <div className={style.tab_content} id = "data_content_3">
                        <p className={style.description}><Markdown>{"**Ontogenic stage:** " + metaData.custom.ontogenic_stage}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Tissue:** " + metaData.custom.tissue_type}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Number of cells:** " + metaData.custom.number_of_cells}</Markdown></p>
                        <p className={style.description}><Markdown>{"**GEO:** " + metaData.geo_series}</Markdown></p>
                        <p className={style.description}><Markdown>{"**SRA:** " + metaData.sra_study}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Specialised resources:** " + metaData.custom.more_specialised_resources}</Markdown></p>
                        <p className={style.description}><Markdown>{"**Submitter:** " + metaData.submitter}</Markdown></p>
                    </div>
                </div>

            </div>



        </div>


    )
}

export default Details;
