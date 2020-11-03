import './App.css';
import React from 'react';
import Graph from './Graph';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Graph count={20} max={20}/>
      </div>
    );
  }
}

export default App;
