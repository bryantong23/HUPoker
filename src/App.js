import logo from "./logo.svg";
import "./App.css";
import PlayerBanner from "./components/playerBanner";
import Players from "./components/players";
import React, { Component } from "react";
import axios from 'axios';
import Card from "./components/card";
import HoleCards from "./components/holeCards";
import Board from "./components/board";

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
          position: 0,
          turn: false
        },
        { id: 2, name: "Bot", stackSize: 1000, botCards: [], position: 1, turn: false},
      ],
      cards: [],
      flop: [],
      turn: [],
      river: [],
      potSize: 0,
      isPaused: false,
      dealFlop: false,
      dealTurn: false,
      dealRiver: false,
      betOutstanding: 0,
    };
  }

  async componentDidMount() {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then(e => e.data.cards);

    this.setState({ cards });
  }

  handleCheck = () => {
    const players = this.state.players;
    players[0].turn = false;
  }

  handleCall = () => {
    const players = this.state.players;
    players[0].stackSize -= this.state.betOutstanding;
    players[0].turn = false;
    const newPotSize = this.state.potSize + this.state.betOutstanding;
    this.setState({potSize: newPotSize});
  };

  handleClickRaise = () => {
    const players = this.state.players;
    players[0].viewText = !players[0].viewText;
    this.setState({ players });
  };

  handleRaise = (amount) => {
    const raiseAmount = parseInt(amount);
    const players = this.state.players;
    players[0].stackSize -= raiseAmount;
    players[0].viewText = !players[0].viewText;
    players[0].turn = false;
    const newBetOutstanding = raiseAmount - this.state.betOutstanding;
    const newPotSize = this.state.potSize + raiseAmount;
    this.setState({betOutstanding: newBetOutstanding});
    this.setState({potSize: newPotSize});
    this.setState({ players });
  };

  handleFold = () => {
    this.finishHand();
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
    if (this.state.bigBlind > this.state.smallBlind && this.state.startingStack >= this.state.bigBlind){
      //while (!this.state.isPaused){
        const newPot = this.state.smallBlind + this.state.bigBlind;
        this.setState({potSize: newPot});
        this.getDeck();
        this.dealHoleCards();
        this.dealFlop();
        this.dealTurn();
        this.dealRiver();
        this.finishHand();
        //continue;

        

      //}
    }
    else {
      alert("Please make sure game settings are valid.");
    }
  }
  

  pauseGame = () => {
    const pause = !this.state.isPaused;
    this.setState({isPaused: pause});
  }

  getDeck = async() => {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then(e => e.data.cards);

    this.setState({ cards });
  }

  dealHoleCards = () => {
    this.setState({betOutstanding: this.state.smallBlind});
    if (this.state.cards.length !== 0){
      const playerCards = this.state.cards.slice(0, 2);
      const players = this.state.players;
      players[0].playerCards = playerCards;

      const botCards = this.state.cards.slice(2, 4);
      players[1].botCards = botCards;

      if (players[0].position === 0){
        players[0].turn = true;
      }
    }  


  }

  dealFlop = () => {
    const flop = this.state.cards.slice(4, 7);
      this.setState({flop: flop});

  }

  dealTurn = () => {
    const turn = this.state.cards.slice(7, 8);
      this.setState({turn: turn});

  }

  dealRiver = () => {
    const river = this.state.cards.slice(8, 9);
      this.setState({river: river});

  }

  finishHand = () => {
    const players = this.state.players;
    for (var i = 0; i < this.state.players.length; i++){
      players[i].turn = false;
      players[i].position = 1 - players[i].position;
    }
  }

  render() {
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
            <button
              className="btn btn-primary btn-sm m-2"
              onClick={this.pauseGame}
            >
              Pause
            </button>
          </div>
        </header>
        <main className="container">
          <Players
            players={this.state.players}
            onCheck={this.handleCheck}
            onCall={this.handleCall}
            onRaise={this.handleClickRaise}
            onFold={this.handleFold}
            onRaised={this.handleRaise}
          />
          <label htmlFor="pot">Pot size:</label>
          <p id="pot">{this.state.potSize}</p>
        </main>
        <HoleCards holeCards={this.state.players[0].playerCards}></HoleCards>
        <Board dealFlop={this.state.dealFlop} dealTurn={this.state.dealTurn} dealRiver={this.state.dealRiver} flop={this.state.flop} turn={this.state.turn} river={this.state.river}></Board>
      </React.Fragment>
    );
  }
}

export default App;
