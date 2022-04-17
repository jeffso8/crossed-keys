import React from 'react';
import Game from '../component/Game/index';
import Home from '../component/Home';
import RoomRouter from './RoomRouter';
import {BrowserRouter, Route} from 'react-router-dom';
import ReactGA from 'react-ga';
import { withCookies, CookiesProvider } from 'react-cookie';
import JoinRoom from '../component/JoinRoom';

ReactGA.initialize('G-E591MG37EY');
ReactGA.pageview(window.location.pathname + window.location.search);
function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <Route exact path='/room/:roomID' component={RoomRouter} />
      <Route exact path='/join/:roomID' component={JoinRoom}/>
      <Route path='/game/:roomID' component={Game}/>
    </BrowserRouter>
  );
}

export default App  ;