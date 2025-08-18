import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ListingPage from "./components/ListingPage";
import ElectronSplashScreen from "./components/ElectronSplashScreen";
import CustomerDetailPage from "./components/CustomerDetailPage";
import ProductDetailPage from "./components/ProductDetailPage";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ElectronSplashScreen} />
        <Route path="/listings" component={ListingPage} />
        <Route path="/customer-details" component={CustomerDetailPage} />
        <Route path="/product-detail/:id" component={ProductDetailPage} />
      </Switch>
    </Router>
  );
}

export default App;