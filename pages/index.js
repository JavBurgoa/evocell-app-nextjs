import fs from 'fs';
import Link from 'next/link';


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


// Get all JSONs content into a single array
// Also, if this code below does not exist, import fs on the top gives an error
export async function getStaticProps() {

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