import React, { Component } from 'react';
import './App.css';

import Canvas from './components/Canvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Canvas
          numwide={10}
          numhigh={5}
          scl={20}
        />
      </div>
    );
  }
}

export default App;
