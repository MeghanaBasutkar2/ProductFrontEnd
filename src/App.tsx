import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ListingPage from './components/ListingPage';
import ElectronSplashScreen from './components/ElectronSplashScreen';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ElectronSplashScreen} />
        <Route path="/listings" component={ListingPage} />
      </Switch>
    </Router>
  );
}

export default App;