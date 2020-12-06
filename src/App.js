import logo from "./logo.svg";
import "./App.css";
import PlayerBanner from "./components/playerBanner";
import Players from "./components/players";
import React, { Component } from "react";
import axios from 'axios';
import Card from "./components/card";

const API_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/";

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
          name: "Your name",
          stackSize: 1000,
          viewText: false,
          playerCards: [],
        },
        { id: 2, name: "Bot", stackSize: 1000, botCards: [] },
      ],
      cards: [],
      flop: [],
      turn: [],
      river: [],
    };
  }

  async componentDidMount() {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then(e => e.data.cards);

    this.setState({ cards });
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

  updateBlinds = () => {
    const sb = parseInt(document.getElementById("sb").value);
    const bb = parseInt(document.getElementById("bb").value);
    this.setState({ smallBlind: sb, bigBlind: bb });
  };

  updateStack = () => {
    const ss = parseInt(document.getElementById("ss").value);
    this.setState({ startingStack: ss });
    const players = this.state.players;
    for (var i = 0; i < this.state.players.length; i++) {
      players[i].stackSize = ss;
    }
    this.setState({ players });
  };

  startGame = () => {
    this.getDeck();
    this.dealHoleCards();
  }

  getDeck = async() => {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then(e => e.data.cards);

    this.setState({ cards });
  }

  dealHoleCards = () => {
    if (this.state.cards.length !== 0){
      const playerCards = this.state.cards.slice(0, 2);
      const players = this.state.players;
      players[0].playerCards = playerCards;

      const botCards = this.state.cards.slice(2, 4);
      players[1].botCards = botCards;

      const flop = this.state.cards.slice(4, 7);
      this.setState({flop: flop});

      const turn = this.state.cards.slice(7, 8);
      this.setState({turn: turn});

      const river = this.state.cards.slice(8, 9);
      this.setState({river: river});
    }
     
  }

  render() {
    const cards = this.state.players[0].playerCards.map((e, i) => (
      <Card key={i} src={e.image}/>
    ));
    return (
      <React.Fragment>
        <header>
          <h1>HUPoker</h1>
          <div>
            <b>Game settings:</b>
            <br></br>
            <label htmlFor="sb">Small blind:</label>
            <input type="text" id="sb" name="sb" defaultValue="5"></input>
            <br></br>
            <label htmlFor="bb">Big blind:</label>
            <input type="text" id="bb" name="bb" defaultValue="10"></input>
            <br></br>
            <button
              className="btn btn-warning btn-sm m-2"
              onClick={this.updateBlinds}
            >
              Update Blinds
            </button>
            <br></br>
            <label htmlFor="ss">Stack size:</label>
            <input type="text" id="ss" name="ss" defaultValue="1000"></input>
            <br></br>
            <button
              className="btn btn-warning btn-sm m-2"
              onClick={this.updateStack}
            >
              Update Stack
            </button>
            <br></br>
            <button
              className="btn btn-primary btn-sm m-2"
              onClick={this.startGame}
            >
              Start Game
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
        <div className="Cards">{cards}</div>
      </React.Fragment>
    );
  }
}

export default App;
