import React from "react";
import Home from './Home';
import Room from './Room';
import {BrowserRouter, Route} from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Route exact path='/' component={Home} />
      <Route path='/:roomID' component={Room} />
    </BrowserRouter>
  );
}

export default App;