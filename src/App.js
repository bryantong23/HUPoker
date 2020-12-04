import logo from "./logo.svg";
import "./App.css";
import PlayerBanner from "./components/playerBanner";
import Players from "./components/players";
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smallBlind: 5,
      bigBlind: 10,
      startingStack: 1000,
      players: [
        {
          id: 1,
          name: "Type your name here",
          stackSize: 1000,
          viewText: false,
        },
        { id: 2, name: "Bot", stackSize: 1000 },
      ],
    };
  }

  handleCall = () => {
    console.log("Call");
  };

  handleClickRaise = () => {
    const players = this.state.players;
    players[0].viewText = !players[0].viewText;
    this.setState({ players });
  };

  handleRaise = (amount) => {
    const players = this.state.players;
    players[0].stackSize -= parseInt(amount);
    players[0].viewText = !players[0].viewText;
    this.setState({ players });
  };

  handleFold = () => {
    console.log("Fold");
  };

  update = () => {
    console.log("Update")
    const sb = parseInt(document.getElementById("sb").value);
    const bb = parseInt(document.getElementById("bb").value);
    const ss = parseInt(document.getElementById("ss").value);
    this.setState({smallBlind: sb, bigBlind: bb, startingStack: ss});
    const players = this.state.players;
    for (var i = 0; i < this.state.players.length; i++){
      players[i].stackSize = ss;
    }
    this.setState({players});
  };

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>HUPoker</h1>
          <div>
            <b>Game settings:</b><br></br>
            <label htmlFor="sb">Small blind:</label>
            <input type="text" id="sb" name="sb" defaultValue="5"></input>
            <br></br>
            <label htmlFor="bb">Big blind:</label>
            <input type="text" id="bb" name="bb" defaultValue="10"></input>
            <br></br>
            <label htmlFor="ss">Stack size:</label>
            <input type="text" id="ss" name="ss" defaultValue="1000"></input>
            <br></br>
            <button
              className="btn btn-primary btn-sm m-2"
              onClick={this.update}
            >
              Update
            </button>
          </div>
        </header>
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
