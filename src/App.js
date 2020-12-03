import logo from './logo.svg';
import './App.css';
import PlayerBanner from './components/playerBanner';
import React, { Component } from 'react';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {visible:true}
  }
  render() {
    return (
      <React.Fragment>
        <PlayerBanner />
      </React.Fragment>
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/App.js</code> and save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Learn React
      //     </a>
      //   </header>
      // </div>
      
    );

  }
  
}

export default App;
