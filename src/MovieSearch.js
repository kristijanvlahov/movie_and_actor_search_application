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
  let countries_filtered = [];
  let countries = [];
 
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
    FILTER(LANG(?comment)='en').
    }
    LIMIT 100`
 
    const stream = await client.query.select(query);
 
    stream.on('data', row => {
      Object.entries(row).forEach(([key, value]) => {
        //console.log(`${key}: ${value.value} (${value.termType})`)
      })
      setData(x => [...x, row]);
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
    if (typeof (movie) == 'object') {
      movies = [...movies, movie];
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
 
  const filterHandler = () => {
    var e = document.getElementById("filter");
    var result = e.options[e.selectedIndex].value;
 
    for (let i = 0; i < data.length; i++) {
      if (result === data[i].country.value) {
        countries_filtered.push(data[i]);
      }
    }
 
    if (typeof (countries_filtered) == 'object') {
      countries = [...countries, countries_filtered];
      console.log(countries_filtered);
      console.log(countries);
    }
    countries = [];
    countries_filtered = [];
  }
 
  return (
    <div className="App">
      <div className="container">
        <img src="https://st2.depositphotos.com/3687485/9010/v/600/depositphotos_90102796-stock-illustration-cinema-film-clapper-board-vector.jpg" width="100px" height="100px"></img>
        <h1>Movie Search</h1>
        <Link to={'/actorSearch'}>Actor Search</Link>
      </div>
 
      <div className="filter">
        <label>Filter by country:</label>
 
        <select name="country" id="filter" onChange={filterHandler}>
          <option value="/">Choose a country</option>
          <option value="United States">United States</option>
          <option value="China">China</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="India">India</option>
          <option value="Australia">Australia</option>
        </select>
      </div>
 
      <div className="autocomplete">
        <input type="text" className="input" placeholder="Enter movie name"
          onChange={e => onChangeHandler(e.target.value)}
          value={text}>
        </input>
        <button type="submit" onClick={handleSearch(text)}>Search</button>
      </div>
 
      {suggestions && suggestions.filter((val, i) => i < 5).map((suggestion, i) =>
        <div className="suggestion" onClick={() => onSuggestHandler(suggestion)}>{suggestion}
        </div>
      )}
 
      {Object.keys(movies).map((item, i) => (
        <div key={i}>
          <h3>{movies[item].title.value}</h3>
          <p>Genre: {movies[item].genreLinkLabel.value}</p>
          <p>Director: {movies[item].directorLabel.value}</p>
          <p>Country: {movies[item].country.value}</p>
          <p>Description: {movies[item].comment.value}</p>
        </div>
      ))}
 
      {Object.keys(countries_filtered).map((item, i) => (
          <li key={i}>
          <span>{countries_filtered[item].title.value}</span>
          </li>
      ))}
 
    </div>
  );
}
 
export default MovieSearch;
 