import logo from "./logo.svg";
import "./App.css";
import PlayerBanner from "./components/playerBanner";
import Players from "./components/players";
import React, { Component } from "react";

class App extends Component {
  // state = {
  //   players: [
  //     { id: 1, name: "Type your name here", stackSize: 0 },
  //     { id: 2, name: "Bot", stackSize: 0 },
  //   ],
  // };
  constructor(props) {
    super(props);
    this.state = {
      players: [
        { id: 1, name: "Type your name here", stackSize: 0, viewText: false },
        { id: 2, name: "Bot", stackSize: 0 },
      ],
    };
  }

  handleCall = () => {
    console.log("Call");
  };

  handleRaise = () => {
    console.log("Raise");
      const players = this.state.players;
      players[0].viewText = !players[0].viewText;
      this.setState({players});
  };

  handleFold = () => {
    console.log("Fold");
  };

  render() {
    return (
      <React.Fragment>
        {/* <PlayerBanner /> */}
        <main className="container">
          <Players
            players={this.state.players}
            onCall={this.handleCall}
            onRaise={this.handleRaise}
            onFold={this.handleFold}
          />
        </main>
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
