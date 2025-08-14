import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ListingPage from './components/ListingPage';
import ElectronSplashScreen from './components/ElectronSplashScreen';
import CustomerDetailPage from './components/CustomerDetailPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ElectronSplashScreen} />
        <Route path="/listings" component={ListingPage} />
        <Route path="/customer-details" component={CustomerDetailPage} />
      </Switch>
    </Router>
  );
}

export default App;