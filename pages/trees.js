import style from "../styles/Trees.module.css"
import { Client } from '@elastic/elasticsearch'
import { useEffect, useState, useCallback } from "react";
import Image from 'next/image'
var Minio = require('minio');
import {FormData} from "formdata-node" // installd from npm install fromata-node
const https = require('https')
const axios = require('axios')
import path from 'path'

////////// ELASTIC IS FANTASTIC


const Trees = ({ trees, ete_url, newicks, treesPerGene}) => {
    
	/////////////////////////////////// <scripts> //////////////////////////////////
	/* Make this onload somehow
	function enterKey(){
		const input = document.getElementById("searchBar");
		// It makes the search bar send input when user clicks Enter
		input.addEventListener("keyup", function(event) {
			console.log(event)
  		// Number 13 is the "Enter" key on the keyboard
  			if (event.keyCode === 13) {
    		// Cancel the default action, if needed
    		event.preventDefault();
    		// Trigger the button element with a click
    		document.getElementById("searchButton").click();
  		}
	});
	
	}
	*/
	function removeAllChildNodes(parent) {
    	while (parent.firstChild) {
       		parent.removeChild(parent.firstChild);
    	}
	}

	function searchTrees(){
		// Acticvated when someone submits a gene pressing the "Search" buttton
		//Appends a list with all trees that have that gene within.

		const input = document.getElementById("searchBar");
    	var selcGene = input.value.toUpperCase();
    	const list = document.getElementById("treesList");
    	var data = JSON.parse(treesPerGene) // This comes from static props. the dictionary
    	
    	
    	removeAllChildNodes(list)
    	// Create an entry per tree
    	if(data[selcGene] !== undefined){

    		for(var i in data[selcGene]){

				var elementOfList = document.createElement("button")
				elementOfList.className = "elementOfTreeList"
				elementOfList.innerHTML = data[selcGene][i]
				elementOfList.addEventListener("click", openETE)
				list.appendChild(elementOfList)

    		}
    	}else{
    		alert("Could not find gene, please type the exact name (Caps are not a problem) p.ej:  '252671.XLOC_0124'")
    	}
	}
	

	//wrap these three functions in a single one, and make the elementOfTreelist do it
	function fetchTree(){
		// When you click on any of the appended trees, it retrieves the exact tree from minio
		// kepin mind some trees end in .faa.aln.nw and other in .aln.nw, so you will have to add try statements here and there.
		//name of tree will be data[selcGene] again
		return("")
	}

	function customETE(nameoftree){
		//POst tree to ETE and output path to iframe
		return("")
	}

	function openETE(){
		//when click on a tree, hide search and display iframe
		
		const search = document.getElementById("search");
		search.style["display"] = "none";
		
		const ete_div = document.getElementById("div_ete");
		ete_div.style["display"] = "block";

		//load ete. If you load it from the beginning it says (cannot load bevcuase zoom = 0)
		const eteDefault = document.getElementById("eteDefault");
		eteDefault.src = "https://phylocloud-ziqi.compgenomics.org/headless/tree_page/61b9bdef3947c122665b8252/" // This url should come from static props

	}

	function iframeListen(){
		// Function that is activated when the ete4 iframe loads
		// It adds an event listener that is triggered every time chorme recieves a message from the igrame, this is every time you make an action on the iframe.
		
		window.addEventListener('message', handler);
		
		


	}

	function handler() {
		/*
		This should be added, being eteURL a static prop
		if (event.origin != eteUrl)
        	return("")
		
		const dict = {
			"XLOC_006965":"https://cells-test.gi.ucsc.edu/?ds=evocell+clyhem&gene=XLOC_006965",
			"XLOC_005491":"https://cells-test.gi.ucsc.edu/?ds=evocell+clyhem&gene=XLOC_005491"
		}

		var iframe = document.getElementById('eteDefault');
		iframe.contentWindow.postMessage({
			selectionMode: "saved",
			eventType: "select",
			selectCommand: "/e p.get('hasData') == True"
		}, "http://127.0.0.1:5000/")
		
    	*/
	}


	const eteLoader = ({ src, width, quality }) => { // needed for static export to work. Check https://nextjs.org/docs/api-reference/next/image#loader
  		return `http://127.0.0.1:5000/`
	}
	/////////////// !!!!!!!!!!!!!!!!!! Change <img> to <Image/> to allow next export (otherwise it doesn work) you need to play with loaders like the one above (https://nextjs.org/docs/api-reference/next/image#loader)  


	////////////////////////////////////// <scripts> //////////////////////////////////
    
    async function postData(url = '', datos = {}) {
    
        const response = await fetch(url, {
            method: 'POST',
            body: datos
        });
        const json = await response;
        return json
     }
          
      async function sendElasticReq (){
        postData('api/elastic')
        .then(res => {
            if(res.status == 200) {
                console.log("Success :" + res.statusText);   //works just fine
            }

            return res.json()
        }).then(bod => {console.log(bod)})
       }

	return (
		<>
		<div id="search">
			<h1>Search gene</h1>
			<input type="text" id="searchBar" placeholder="Gene in Phylome" title="Type in a gene">
			</input>
			<button id="searchButton" onClick={(e) => searchTrees()}>Search</button>
			<ul id="treesList"></ul>

		</div>

        <button onClick={sendElasticReq}>Elastic</button>


		<div id="div_ete" className={style.div_ete}>
			<iframe onLoad={(e) => iframeListen()} className={style.ete4frame} title="ete4" id = "eteDefault">
			</iframe>
			<p>🡡🡡🡡 http://127.0.0.1:5000/ --------------------- http://127.0.0.1:5000/trees=treeid 🡣🡣🡣</p>
			<iframe src={ete_url} className={style.ete4frame} title="ete5">
			</iframe>
		</div>
		</>
		)
}
// Connection to Minio
export async function getStaticProps() {
    async function connectToElasticsearch() {
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
    const client = await connectToElasticsearch()

    // check if connection worked
    //client.info().then(response => console.log(response)).catch(error => console.error(error))

    async function run() {
        await client.index({
          index: 'game-of-thrones',
          body: {
            character: 'Ned Stark',
          quote: 'Winter is coming.'
          }
        })
      
        await client.index({
          index: 'game-of-thrones',
          body: {
            character: 'Daenerys Targaryen',
          quote: 'I am the blood of the dragon.'
          }
        })
      
        await client.index({
          index: 'game-of-thrones',
          body: {
            character: 'Tyrion Lannister',
          quote: 'A mind needs books like a sword needs whetstone.'
          }
        })
      
        await client.indices.refresh({index: 'game-of-thrones'})
      }
      
    //run().catch(console.log)

    async function read() {
        const body = await client.search({
          index: 'game-of-thrones',
          body: {
            query: {
              match: { quote: 'winter' }
            }
          }
        })
        console.log(body.hits)
      }
      
      read().catch(console.log)
    // async function run () {
    //     // Let's start by indexing some data
    //     await client.index({
    //       index: 'game-of-thrones',
    //       document: {
    //         character: 'Ned Stark',
    //         quote: 'Winter is coming.'
    //       }
    //     })
      
    //     await client.index({
    //       index: 'game-of-thrones',
    //       document: {
    //         character: 'Daenerys Targaryen',
    //         quote: 'I am the blood of the dragon.'
    //       }
    //     })
      
    //     await client.index({
    //       index: 'game-of-thrones',
    //       document: {
    //         character: 'Tyrion Lannister',
    //         quote: 'A mind needs books like a sword needs a whetstone.'
    //       }
    //     })
      
    //     // here we are forcing an index refresh, otherwise we will not
    //     // get any result in the consequent search
    //     await client.indices.refresh({ index: 'game-of-thrones' })
      
    //     // Let's search!
    //     const result= await client.search({
    //       index: 'game-of-thrones',
    //       query: {
    //         match: { quote: 'winter' }
    //       }
    //     })
      
    //     console.log(result.hits.hits)
    //   }
      
    // run().catch(console.log)
    
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

	// Get data within file in Minio database
	function getNewick(bucket, name) {
	    const buf = []
	    return new Promise((resolve, reject) => {
	        minioClient.getObject(bucket, name, (err, stream) => {
	            if (err) {
	                return reject(err)
	            }
	            stream.on('data', (chunk) => buf.push(chunk))
	            stream.on('end', () => {
	                resolve(buf.toString('ASCII'))
	            })
	        })
	    })
	}

    function getDict(client, bucket, name) {
        const buf = []
        return new Promise((resolve, reject) => {
            client.getObject(bucket, name, (err, stream) => {
                if(err){
                    return reject(err)
                }
                stream.on("data", (chunk) => buf.push(chunk))
                stream.on("end", () => {
                    resolve(buf.toString("ASCII"))
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
	var trees = minioClient.listObjects('evocell','annotated_trees', true)
	var trees = await toArray(trees)
	
	var trees = trees.map(function(tree){
		return tree.name.split('/')[1]
	})



	//###############################
	//#### SEARCH TREES DICT
	//###############################
	// Create a dict with all the genes present in our trees, and make a dict like so:
	//{gene1:[tree1,tree2,tree3],
	// gene2:[tree4]}

	// Get newicks from Minio and make a dictionary like: {tree1:[gene1, orth1, orth1, orth1, gene2], tree2:[orth1, ...]} with duplicates
	var newicks = []
	for(var tr in trees[2]){ //(var tr in trees). Change to use less trees
		var dat = await getNewick('evocell', "annotated_trees/" + trees[tr])
		var dat = dat.toUpperCase();
        
        var dat = dat.replaceAll(/[\(\)\[\]\']/g, "") // erase parenthesis, brackets and quotes
        var dat = dat.replaceAll("&&NHX:HUMAN_ORTH=", ",")
        var dat = dat.replaceAll("|", ",")
        
        var dat = dat.split(/,/)

        // Tree names fromatting
		var treename = trees[tr].replace(".faa", "")
		var treename = treename.replaceAll(".ucsc.", "")
		var treename = treename.replace(".aln.nw", "")

        // Make dict
		newicks.push({
	    	key: treename,
	    	value: dat
		});
	}

	// // switch tree:genes dict to gene:trees
	var treesPerGene = {};
	for(var idx in newicks){

		var tree = newicks[idx].key

		for(var element in newicks[idx].value){
			
			var key = newicks[idx].value[element]

			if(treesPerGene[key] === undefined){ // if the gene key is not in the dictionary, put somtthing there
				
				treesPerGene[key] = [tree]
				
			}else if(!treesPerGene[key].includes(tree)){// if the gen already has a tree and it's not the same tree then push the new tree there in .value

                treesPerGene[key].push(tree)


		    }
	    }
    }
	var treesPerGene = JSON.stringify(treesPerGene)

    
    
    // var treesPerGene = await getDict(minioClient, "evocell", "searchDict30K.JSON")
    // console.log(treesPerGene)
    // console.log("let's start parsing !!!!!!!!!!!!!!!!")
    // treesPerGene = JSON.parse(treesPerGene)
    // treesPerGene = JSON.stringify(treesPerGene)


	//###################
	//###### MAKE CUSTOM ETE IFRAME
	//###################
	
	const eteUrl = "http://127.0.0.1:5000";
	var tid = 9869868746654;
	var name = "randomtree";
	var newick = "(A,B,(C,D));";
	var ete_url = `${eteUrl}/static/gui.html?tree=${tid}`

	const data = {
	    newick: '(A);',
	    name: "TreeX",
	    layouts:[],
	    "description": "Tree"
	  }
	/*
	const data = {
		"id": tid,
		"name": name,
		"newick": newick,
		"layouts": []
	};
	*/

	/*
	var data = new FormData();
    data.append("id", tid);
    data.append("name", name);
    data.append("newick", newick);
    data.append("layouts", []);
    console.log(data)
    */


    //****************
    //AXIOS MODULE
    /*
    console.log("AXIOS ########################")
	axios
	  .post("http://127.0.0.1:5000/trees", {
	    newick: '(A);',
	    name: "TreeX",
	    description: "Tree",
	    //id:7642,
	    layouts:[]

	  }).then(res => {
	    console.log(`statusCode: ${res.status}`)
	    console.log(res)
	  })
	  .catch(error => {
	    console.error(error)
	})
	*/


	//******************
	/// HTTP MODULE
	/*
	const options = {
	  //hostname: 'evocell',
	  port: 443,
	  path: 'http://400',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': data.length
	  }
	}

	const req = https.request(options, res => {
	  console.log(`statusCode: ${res.statusCode}`)

	  res.on('data', d => {
	    process.stdout.write(d)
	  })
	})

	req.on('error', error => {
	  console.error(error)
	})

	req.write(data)
	req.end()
	*/


	
	///*************************
	/*
	console.log("FETCH ########################")
	// FETCH 
    // Upload tree through POST
    const post_newick = async () => {
    	const response = await fetch(`${eteUrl}/trees`, {
    	method: 'POST',
    	mode: 'cors',
    	cache: 'no-cache',
   		headers: {"Authorisation": "Bearer hello"},
    	redirect: 'follow',
    	referrerPolicy: 'no-referrer',
    	body: data
    }).then(res => {
	    console.log(`statusCode: ${res.status}`)
	    console.log(res)
	  })
	  .catch(error => {
	    console.error(error)
	  })
    
    }
    
    post_newick()
    */
	
	

	return {
  	  props: {ete_url, treesPerGene}
  }
};

export default Trees;