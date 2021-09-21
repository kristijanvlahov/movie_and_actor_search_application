import './App.css';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MovieSearch = () => {

  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [array, setArray] = useState([]);
  let movie = [];
  let movies = [];

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
    SELECT DISTINCT (SAMPLE(?link) AS ?link) ?title (SAMPLE(?genre) AS ?genre) (SAMPLE(?contryOfOrigin) AS ?contryOfOrigin) (SAMPLE(?image) AS ?image)  (SAMPLE(?director) AS ?director) (SAMPLE(?duration) AS ?duration) (SAMPLE(?awardReceived) AS ?awardReceived)  WHERE {
      ?link wdt:P31 wd:Q11424.
      ?link wdt:P1476 ?title.
      ?link wdt:P136 ?genre.
      ?link wdt:P495 ?contryOfOrigin.
      ?link wdt:P18 ?image.
      ?link wdt:P57 ?director.
      ?link wdt:P2047 ?duration.
      ?link wdt:P166 ?awardReceived.
      
  } GROUP BY ?title
    LIMIT 50`

    const stream = await client.query.select(query);

    stream.on('data', row => {
      Object.entries(row).forEach(([key, value]) => {
        //console.log(`${key}: ${value.value} (${value.termType})`)
      })
      setData(x => [...x,row]);
      array.push(row.title.value);
    })
  }
  useEffect(() => {
    fetchData();
  }, [])

  const handleSearch = (text) => {
    console.log(data);
    movie = data.find(x => x.title.value === text);
    console.log(movie);
    if(typeof(movie)=='object'){
      movies = Object.values(movie);
      console.log(movies);
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
        <h1>Movie Search</h1>
        <Link to={'/actorSearch'}>Actor Search</Link>
        </div>
      
      <div className="autocomplete">
        <input type="text" className="input" placeholder="Enter movie name"
          onChange={e => onChangeHandler(e.target.value)}
          value={text}></input>

        <button type="submit" onClick={handleSearch(text)}>Search</button>
      </div>

      {suggestions && suggestions.filter((val,i)=>i<5).map((suggestion, i) =>
        <div className="suggestion" onClick={() => onSuggestHandler(suggestion)}>{suggestion}
        </div>
      )}
      
        {movies && movies.map((m, i) =>
          <li key={i}>{m.value}</li>
        )}
            
    </div>
  );
}

export default MovieSearch;
