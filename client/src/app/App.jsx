import React from 'react';
import Game from '../component/Game/index';
import Home from '../component/Home';
import Room from '../component/Room/index';
import {BrowserRouter, Route} from 'react-router-dom';
import ReactGA from 'react-ga';
import { withCookies } from 'react-cookie';

ReactGA.initialize('G-E591MG37EY');
console.log('reactga', ReactGA);
ReactGA.pageview(window.location.pathname + window.location.search);
console.log('window.location.pathname + window.location.search', window.location.pathname + window.location.search);
function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <Route exact path='/:roomID' component={Room}/>
      <Route path='/:roomID/game' component={Game}/>
    </BrowserRouter>
  );
}

export default App;