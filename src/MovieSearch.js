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
  let o = {value:"Title,Duration"}

  async function fetchData() {

    const SparqlClient = require('sparql-http-client')

    const client = new SparqlClient({ endpointUrl: 'https://dbpedia.org/sparql' })

    const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX dbc: <http://dbpedia.org/resource/Category:>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbp: <http://dbpedia.org/property/>
    SELECT DISTINCT ?title (SAMPLE(?genreLinkLabel) AS ?genreLinkLabel) (SAMPLE(?comment) AS ?comment)  (SAMPLE(?directorLabel) AS ?directorLabel) (SAMPLE(?country) AS ?country)  {
      ?movieLink a dbo:Film; 
                        dct:subject ?genreLink; 
                                  foaf:name ?title; 
                        dbo:director ?director; 
                      dbp:country ?country;
                      rdfs:comment ?comment.
                      

      ?genreLink rdfs:label ?genreLinkLabel.
      ?director rdfs:label ?directorLabel.
    FILTER(LANG(?directorLabel)='en').
    FILTER(regex(?country , "United States")).
       
    }
    GROUP BY ?title
    LIMIT 100
   `

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
        <img src="https://st2.depositphotos.com/3687485/9010/v/600/depositphotos_90102796-stock-illustration-cinema-film-clapper-board-vector.jpg" width="100px" height="100px"></img>
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

      {movies.map((m, i) =>
        <li key={i}>{m.value}</li>
      )}

      {/*{
        ()=>{
          if(movies){
            return <li>{movies[3].value}</li>
          }
        }
      }*/}
      
            
    </div>
  );
}

export default MovieSearch;
