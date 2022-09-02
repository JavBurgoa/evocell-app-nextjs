import style from "../styles/Help.module.css"
import Link from "next/link"

const Help = () => {

    const addFuncAccordion = (panelID) => {
        var panel = document.getElementById(panelID)
        if (panel.style.display === "block"){
                panel.style.display = "none"
            } 
        else { panel.style.display = "block" }
    
    };

    return(
        <>
        <div className={style.help_div}>
            <button className={style.accordion_help} onClick={() => addFuncAccordion("use_panel")}>How to use the EvoCELL DB</button>
                <div className={style.panel} id="use_panel">
                    <p>The EvoCELL DB is a resource that allows you to visualiza and download single-cell data from various species, focusing on non-model species and spanning whole organism or full embryo atlases.<br></br>
                    First you will see a navigation panel on the top of the page with three sections: Datasets, Trees and Help.
                    </p>
                    <img src="NavPic.PNG"></img>
                    <p>
                     In the Datasets section you will see a spreadsheet with all species for which there is single-cell data available. Click on any tab to see what datasets we have for that species.<br></br>
                     One tab per dataset will appear. If you want to know more about the dataset click on the eye on the rightside of the tab or anywhere along the tab.
                    </p>
                    <img src = "indexPic.PNG"></img>  
                    <p>
                     Within the new tab you will see metainformation about the dataset divided into three sections: Publication, Methods and Dataset. On the right you will see a button to download the dataset and an interactive UMAP. If you click on the expanse icon on the top right you will be able to interact more comfortably with the UMAP.<br></br>
                     <img src = "DetailsPic.PNG"></img>
                    </p>
                    <p>
                     If you navigate to the Trees tab on the navigation bar you will be able to explore the evolutionary relationships of genes.
                     Here you can input any Uniprot Protein ID or human ortholog name. After clicking &quot;Search&quot; you will see on the right all gene-trees that have the searched gene. Click on one of them to go to Phylocloud and explore it.
                    You will notice a number preceeding the Uniprot IDs, this is a TaxID identifier, specifying the species to which it belongs.
                    </p>
                </div>

            <button className={style.accordion_help} onClick={() => addFuncAccordion("seurat_panel")}>How to use single-cell in Seurat</button>
                <div className={style.panel} id="seurat_panel">
                    <p>
                        You may want to perform advanced analyses on the datasets exposed in this resource. To do so, you can download the datasets with the instructions in the help section &quot;How to use the EvoCELL DB&quot;.<br></br>
                        The datasets are in H5AD format, which is a Scanpy (Python) friendly object. If you want to open this object in Seurat you should follow these instructions:
                    </p>
                    <p>
                        After downloading the dataset, go to Python and use the function that you can download <a href = "h5ad_to_loom.py" rel="noopener noreferrer">here</a>. Then go to R, import the loompy object and dimetnion reductions and format them as a single Seurat object. You an do it with the following <a href = "loom_to_seurat.R" rel="noopener noreferrer">R code</a>.
                    </p>
                </div>

            <button className={style.accordion_help} onClick={() => addFuncAccordion("ucsc_panel")}>How to use UCSC browser</button>
                <div className={style.panel} id="ucsc_panel">
                    <p>Check the Documentation right on <a href = "https://cellbrowser.readthedocs.io/en/master/interface.html" target="_blank" rel="noreferrer">UCSC&ldquo;s web</a></p>
                </div>
            <button className={style.accordion_help} onClick={() => addFuncAccordion("phylocloud_panel")}>How to use Phylocloud</button>
                <div className={style.panel} id="phylocloud_panel">
                    <p>Check <a href = "https://github.com/compgenomicslab/phylocloud_help/wiki" target="_blank" rel="noreferrer">Phylocloud&ldquo;s wiki</a> to learn all the functions it has</p>
                </div>

                <button className={style.accordion_help} onClick={() => addFuncAccordion("evo_panel")}>The EvoCELL network</button>
                <div className={style.panel} id="evo_panel">
                    <p>EvoCELL is a Marie Skłodowska-Curie Innovative Training Network. The project started back in 2018 for a duration of 3.5 years aiming at studying the evolution of cell-types and tissues in a diverse array of vertebrates and invertebrates. To do so, the labs involved in the network used the most recent single-cell and tissue genomic techniques, merging them with more traditional disciplines.</p>
                    
                    <h2>Single-Cell</h2>
                    <p>With the aim of studying evolution from a cell-type perspective, EvoCELL members have been generating single-cell data from a variety of non-model metazoans, from Clytia hemisphaerica to Platynereis dumerilii. There are different lines of research within the network including regeneration, nervous system, development etc. Each line has produced its own datasets from its own model species and there are now efforts on integrating these data to extract evolutionary conclusions. These datasets include mostly whole adult organism cells, but also embryos and tissues. All single cell data generated has been published and some of it is now accessible through the UCSC Cell Browser.</p>

                    <h2>Institutions</h2>
                    <p>The network brings together 8 academic and 2 non-academic organisations from 6 European countries.</p>

                    <h3> Germany</h3>
                    <li> Dev. Biol Unit/Arendt lab at EMBL Heidelberg</li>
                    <li>EMBL GeneCore Facility</li>
                    <li>Museum für Naturkunde Berlin, Lüter lab, Delit. exhibitions</li>
                    <li>ZMBH</li>
                    
                    <h3>Italy</h3>
                    <li>Stazione Zoologica Nalioli</li>
                    <li>Genomix4Life</li>
                    
                    <h3>Norway</h3>
                    <li>Deliartment of Biological Sciences, University of Bergen</li>
                    
                    <h3>France</h3>
                    <li>Observatoire Océanologique de Villefranche (OOV)</li>
                    <li>Institut de Génomique Fonctionnelle de Lyon (IGFL)</li>
                    
                    <h3>UK</h3>
                    <li>Living Systems Institute/Jékely lab</li>
                    <li>Delit Genetics, Evolution and Environment</li>
                    
                    <h3>Sweden</h3>
                    <li>Delit Earth Sciences, Budd/Janssen lab</li>
                        
                    <h2>People</h2>
                    <p>The EvoCell Network has been training across the years a great number of PhD and Pre-doc students. It includes aswell some of the top researchers in cell identity and evolution. You can see them all here.</p>
                    <p>Website: https://evocell-itn.eu/</p>
                </div>
        </div>
        </>
        
    )
}

export default Help