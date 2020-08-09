import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Authpage from './components/authpage';

import SpotifyWebApi from 'spotify-web-api-js';
import LandingPage from './components/landingpage';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
 
  render() {
    return (

        <Router>
          <div className='center-wrap'>
          <Switch>
          <Route path="/authorize">
            <Authpage />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
        </Switch>
          </div>
        </Router>
      
    );
  }
}

export default App;