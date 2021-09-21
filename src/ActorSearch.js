import './App.css';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ActorSearch = () => {

  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [array, setArray] = useState([]);
  let actor = [];
  let actors = [];

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
    SELECT DISTINCT ?image ?actorLabel ?dob ?pobLabel ?countryLabel
WHERE {
  ?film wdt:P31 wd:Q11424;
        wdt:P161 ?actor.
  ?actor wdt:P18 ?image; 
         wdt:P569 ?dob;
         wdt:P19 ?pob;
         wdt:P27 ?country.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
LIMIT 100`

    const stream = await client.query.select(query);

    stream.on('data', row => {
      Object.entries(row).forEach(([key, value]) => {
        //console.log(`${key}: ${value.value} (${value.termType})`)
      })
      setData(x => [...x,row]);
      console.log(data);
      array.push(row.actorLabel.value);
      console.log(array);
    })
  }
  useEffect(() => {
    fetchData();
  }, [])

  const handleSearch = (text) => {
    console.log(data);
    actor = data.find(x => x.actorLabel.value === text);
    console.log(actor);
    if(typeof(actor)=='object'){
      actors = Object.values(actor);
      console.log(actors);
    }
    
  }

  const onChangeHandler = (text) => {

    let matches = []
    let data2 = [];
    data2 = [...array];
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
    setSuggestions([]);
  }

  return (
    <div className="App">
      <div className="container">
        <img src="https://www.nicepng.com/png/detail/153-1531345_ocean-waves-actor-logo.png" width="100px" height="100px"></img>
        <h1>Actor Search</h1>
        <Link to={'/'}>Movie Search</Link>
        </div>
      <div className="autocomplete">
        <input type="text" className="input" placeholder="Enter actor name"
          onChange={e => onChangeHandler(e.target.value)}
          value={text}></input>

        <button type="submit" onClick={handleSearch(text)}>Search</button>
      </div>

      {suggestions && suggestions.filter((val,i)=>i<5).map((suggestion, i) =>
        <div className="suggestion" onClick={() => onSuggestHandler(suggestion)}>{suggestion}
        </div>
      )}
      
      {actors.map((a, i) =>
        <li key={i}>{a.value}</li>
      )}
            
    </div>
  );
}

export default ActorSearch;
