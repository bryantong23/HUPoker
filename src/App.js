import logo from "./logo.svg";
import "./App.css";
import PlayerBanner from "./components/playerBanner";
import Players from "./components/players";
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [
        { id: 1, name: "Type your name here", stackSize: 1000, viewText: false },
        { id: 2, name: "Bot", stackSize: 0 },
      ],
    };
  }

  handleCall = () => {
    console.log("Call");
  };

  handleClickRaise = () => {
      const players = this.state.players;
      players[0].viewText = !players[0].viewText;
      this.setState({players});
  };

  handleRaise = (amount) => {
    const players = this.state.players;
    players[0].stackSize -= parseInt(amount);
    this.setState({players});
  }

  handleFold = () => {
    console.log("Fold");
  };

  render() {
    return (
      <React.Fragment>
        <header><h1>HUPoker</h1></header>
        <main className="container">
          <Players
            players={this.state.players}
            onCall={this.handleCall}
            onRaise={this.handleClickRaise}
            onFold={this.handleFold}
            onRaised={this.handleRaise}
          />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
