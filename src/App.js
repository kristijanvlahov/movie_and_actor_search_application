import './App.css';
import * as React from 'react';
import { useEffect, useState } from 'react';

function App() {

  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);


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
  
  } LIMIT 10`

    const stream = await client.query.select(query);

    stream.on('data', row => {
      Object.entries(row).forEach(([key, value]) => {
        //console.log(`${key}: ${value.value} (${value.termType})`)
      })
      setData(row.title.value);
    })
  }

  useEffect(() => {
    fetchData();
  }, [])

  function handleSearch() {
    console.log(data);
  }

  const onChangeHandler = (text) => {

    let matches = []
    let data2 = [];
    data2.push(data);
    if (text.length > 0) {
      matches = data2.filter(d => {
        const regex = new RegExp(`${text}`, "gi");
        return d.match(regex);
      })
    }
    setText(text);
    setSuggestions(matches);
  }

  const onSuggestHandler = (text) => {
    setText(text);
    setSuggestions([])
  }

  return (
    <div className="App">
      <div className="autocomplete">
        <input type="text" className="input" placeholder="Enter movie name"
          onChange={e => onChangeHandler(e.target.value)}
          value={text} onBlur={() => setSuggestions([])}></input>

        <button type="submit" onClick={handleSearch()}>Search</button>
      </div>

      {suggestions && suggestions.map((suggestion, i) =>
        <div className="suggestion" onClick={() => onSuggestHandler(suggestion)}>{suggestion}
        </div>
      )}
    </div>
  );
}

export default App;
