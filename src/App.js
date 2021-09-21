import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MovieSearch from './MovieSearch';
import ActorSearch from './ActorSearch';

function App() {
  return (
    <Router>
    <Switch>
        <Route exact path="/" component={MovieSearch}>
        </Route>
        <Route path="/actorSearch" component={ActorSearch}>
        </Route>
    </Switch>
  </Router>
    
  );
}

export default App;
