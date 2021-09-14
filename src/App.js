import './App.css';
import React, { useEffect } from 'react';

function App() {
  
useEffect(() => {
  async function fetchData() {
  
  const SparqlClient = require('sparql-http-client')

  const client = new SparqlClient({ endpointUrl: 'https://query.wikidata.org/sparql' })
  
  const query = `
  PREFIX wikibase: <http://wikiba.se/ontology#>
  PREFIX wd: <http://www.wikidata.org/entity/> 
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX p: <http://www.wikidata.org/prop/>
  PREFIX v: <http://www.wikidata.org/prop/statement/>
  SELECT DISTINCT ?link ?title WHERE {
  ?link wdt:P31 wd:Q11424.
  ?link wdt:P1476 ?title.

} LIMIT 1000`
  
const stream = await client.query.select(query);

stream.on('data', row => {
    Object.entries(row).forEach(([key, value]) => {
      console.log(`${key}: ${value.value} (${value.termType})`)
    })
  })  
}
fetchData();  
}, [])
  
return (
    <div className="App">
      <input type="text"></input>
      <button>Search</button>
      
    </div>
  );
}

export default App;
