import logo from "./logo.svg";
import "./App.css";
import PlayerBanner from "./components/playerBanner";
import Players from "./components/players";
import React, { Component } from "react";
import axios from "axios";
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
          turn: false,
          betAmount: 0,
        },
        {
          id: 2,
          name: "Bot",
          stackSize: 1000,
          botCards: [],
          position: 1,
          turn: false,
          betAmount: 0,
        },
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
      showBotCards: false,
      finishedHand: false,
    };
  }

  async componentDidMount() {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then((e) => e.data.cards);

    this.setState({ cards });
  }

  handleCheck = () => {
    if (
      this.state.betOutstanding === 0 &&
      this.state.players[0].position === 1
    ) {
      const players = this.state.players;
      players[0].turn = false;
      players[1].turn = true;
      this.setState({ players });
      setTimeout(() => {
        this.botAction()
      }, 3000);
    } else if (
      this.state.betOutstanding === 0 &&
      this.state.players[0].position === 0
    ) {
      const players = this.state.players;
      players[0].turn = false;
      players[1].turn = true;
      this.setState({ players });
      setTimeout(() => {
        this.dealNext()
      }, 1500);
      setTimeout(() => {
        this.botAction()
      }, 3000);
    }
  };

  handleCall = () => {
    if (this.state.betOutstanding !== 0) {
      const players = this.state.players;
      players[0].stackSize -= this.state.betOutstanding;
      players[0].turn = false;
      players[1].turn = true;
      players[0].betAmount = players[1].betAmount;
      const newPotSize = this.state.potSize + this.state.betOutstanding;
      this.setState({ potSize: newPotSize }, () => {
        this.setState({ betOutstanding: 0 }, () => {
          setTimeout(() => {
            this.dealNext()
          }, 1500);
          setTimeout(() => {
            this.botAction()
          }, 3000);
        });
      });
    }
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
    players[0].stackSize += players[0].betAmount;
    players[0].viewText = !players[0].viewText;
    players[0].turn = false;
    players[1].turn = true;
    const newBetOutstanding = raiseAmount - this.state.players[1].betAmount;
    const newPotSize = this.state.potSize + raiseAmount - players[0].betAmount;
    players[0].betAmount = raiseAmount;

    this.setState({ betOutstanding: newBetOutstanding }, () => {
      this.setState({ potSize: newPotSize }, () => {
        this.setState({ players }, () => {
          setTimeout(() => {
            this.botAction()
          }, 3000);
        });
      });
    });
  };

  handleFold = () => {
    const players = this.state.players;
    players[0].turn = false;
    players[1].stackSize += this.state.potSize;
    this.setState({ players }, () => {
      this.setState({ potSize: 0 }, () => {
        this.finishHand();
      });
    });
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

  botAction = () => {
    const players = this.state.players;
    if (this.state.betOutstanding === 0 && players[1].position === 1) {
      players[0].turn = true;
      players[1].turn = false;
      this.setState({ players });
    } else if (this.state.betOutstanding === 0 && players[1].position === 0) {
      players[0].turn = true;
      players[1].turn = false;
      this.setState({ players });
      setTimeout(() => {
        this.dealNext()
      }, 1500);
    } else {
      players[1].stackSize -= this.state.betOutstanding;
      players[1].betAmount = players[0].betAmount;
      players[0].turn = true;
      const newPotSize = this.state.potSize + this.state.betOutstanding;
      this.setState({ potSize: newPotSize });
      this.setState({ players });
      this.setState({ betOutstanding: 0 });
      setTimeout(() => {
        this.dealNext()
      }, 1500);
    }
  };

  startGame = () => {
    this.refs.btn.setAttribute("disabled", "disabled");
    if (
      this.state.bigBlind > this.state.smallBlind &&
      this.state.startingStack >= this.state.bigBlind
    ) {
      this.dealHoleCards();
      //while (!this.state.isPaused){

      //this.dealFlop();
      //this.dealTurn();
      //this.dealRiver();
      //this.finishHand();
      //continue;

      //}
    } else {
      alert("Please make sure game settings are valid.");
    }
  };

  dealNextHand = () => {
    this.refs.btn.setAttribute("disabled", "disabled");
    this.dealHoleCards();
  };

  pauseGame = () => {
    const pause = !this.state.isPaused;
    this.setState({ isPaused: pause });
  };

  // getDeck = async () => {
  //   const data = await axios.get(API_URL).then(({ data }) => data);

  //   const cards = await axios
  //     .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
  //     .then((e) => e.data.cards);

  //   this.setState({ cards });
  // };

  dealHoleCards = () => {
    this.setState({ dealFlop: false }, () => {
      this.setState({ dealTurn: false }, () => {
        this.setState({ dealRiver: false }, () => {
          this.setState({ showBotCards: false }, () => {
            this.componentDidMount();
            const newPot = this.state.smallBlind + this.state.bigBlind;
            const sb = this.state.smallBlind;
            this.setState({ potSize: newPot }, () => {
              this.setState({ betOutstanding: sb }, () => {
                this.setState({finishedHand: false});
                });
              });
            });

            if (this.state.cards.length !== 0) {
              const playerCards = this.state.cards.slice(0, 2);
              const players = this.state.players;
              players[0].playerCards = playerCards;

              const botCards = this.state.cards.slice(2, 4);
              players[1].botCards = botCards;

              this.setState({ players });

              this.preFlopBetting();
            }
          });
        });
      });
  };

  preFlopBetting = () => {
    const players = this.state.players;
    if (players[0].position === 0) {
      players[0].turn = true;
      players[0].stackSize -= this.state.smallBlind;
      players[0].betAmount = this.state.smallBlind;
      players[1].betAmount = this.state.bigBlind;
      players[1].stackSize -= this.state.bigBlind;
      this.setState({ players });
      // while (this.state.betOutstanding !== 0){
      //   if (players[0].position === 0) {
      //     players[0].turn = true;
      //     while (players[0].turn){
      //       continue;
      //     }
      //     this.botAction();
      //     break;
      //   }
      //   else {
      //     this.botAction();
      //     break;
      //   }
      // }
    } else {
      players[1].turn = true;
      players[0].betAmount = this.state.bigBlind;
      players[0].stackSize -= this.state.bigBlind;
      players[1].betAmount = this.state.smallBlind;
      players[1].stackSize -= this.state.smallBlind;
      this.setState({ players });
      setTimeout(() => {
        this.botAction()
      }, 3000);
    }

    //this.dealFlop();
  };

  dealNext = () => {
    const players = this.state.players;
    players[0].betAmount = 0;
    players[1].betAmount = 0;
    this.setState({ players });
    this.setState({ betOutstanding: 0 });
    if (this.state.flop.length === 0) this.dealFlop();
    else if (this.state.turn.length === 0) this.dealTurn();
    else if (this.state.river.length === 0) this.dealRiver();
    else this.showDown();
  };

  dealFlop = () => {
    this.resetBetAmount();
    const flop = this.state.cards.slice(4, 7);
    this.setState({ dealFlop: true });
    this.setState({ flop: flop });
  };

  dealTurn = () => {
    this.resetBetAmount();
    const turn = this.state.cards.slice(7, 8);
    this.setState({ dealTurn: true });
    this.setState({ turn: turn });
  };

  dealRiver = () => {
    this.resetBetAmount();
    const river = this.state.cards.slice(8, 9);
    this.setState({ dealRiver: true });
    this.setState({ river: river });
  };

  showDown = () => {
    this.setState({ showBotCards: true }, () => {
      this.setState({ finishedHand: true }, () => {
        this.finishHand();
      });
    });
  };

  finishHand = () => {
    const players = this.state.players;
    for (var i = 0; i < this.state.players.length; i++) {
      players[i].turn = false;
      players[i].position = 1 - players[i].position;
    }
    this.setState({ players }, () => {
      this.setState({ finishedHand: true });
    });
  };

  resetBetAmount = () => {
    const players = this.state.players;
    for (var i = 0; i < players.length; i++) {
      players[i].betAmount = 0;
    }
    this.setState({ players });
  };

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
              ref="btn"
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
            <span>
              {this.state.finishedHand ? (
                <button
                  onClick={() => this.dealNextHand()}
                  className="btn btn-primary btn-sm m-2"
                >
                  Deal Next Hand
                </button>
              ) : null}
            </span>
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
          <p id="pot">{"Pot size: " + this.state.potSize}</p>
        </main>
        <HoleCards holeCards={this.state.players[0].playerCards}></HoleCards>
        <Board
          dealFlop={this.state.dealFlop}
          dealTurn={this.state.dealTurn}
          dealRiver={this.state.dealRiver}
          flop={this.state.flop}
          turn={this.state.turn}
          river={this.state.river}
        ></Board>
        <div>
          {this.state.showBotCards ? (
            <HoleCards holeCards={this.state.players[1].botCards}></HoleCards>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
