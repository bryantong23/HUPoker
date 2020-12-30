import "./App.css";
import Players from "./components/players";
import React, { Component } from "react";
import axios from "axios";
import HoleCards from "./components/holeCards";
import Board from "./components/board";
import Hand from "./components/hand";
import {
  evaluateHoleCards,
  evaluateFiveCardHand,
  evaluateFlop,
  evaluateRiver,
  evaluateTurn,
  botRiver,
  botTurn,
  botFlop,
  botPre,
} from "./components/HandEvaluator.js";

const API_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/";

class App extends Component {
  // Constructor that initializes all state variables
  constructor(props) {
    super(props);
    this.state = {
      // Game specifications
      smallBlind: 5,
      bigBlind: 10,
      startingStack: 1000,
      // List of players and attributes
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
      // Arrays to store cards
      cards: [],
      flop: [],
      turn: [],
      river: [],
      potSize: 0,
      // Various attributes to determine when to perform specific actions
      dealFlop: false,
      dealTurn: false,
      dealRiver: false,
      showedCards: false,
      dealHoleCards: false,
      betOutstanding: 0,
      showBotCards: false,
      finishedHand: false,
      startedGame: false,
      rank: [
        "High card",
        "Pair",
        "Two pair",
        "Three of a kind",
        "Straight",
        "Flush",
        "Full House",
        "Four of a kind",
        "Straight Flush",
        "Royal Flush",
      ],
    };
  }

  // Retrieve initial shuffled deck of cards upon component mount using DeckOfCards API
  async componentDidMount() {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then((e) => e.data.cards);

    this.setState({ cards });
  }

  // Handle check from player
  handleCheck = () => {
    // If it is postflop
    if (this.state.dealFlop) {
      // Only handle checks when betOutstanding = 0
      // If player is BB
      if (
        this.state.betOutstanding === 0 &&
        this.state.players[0].position === 1
      ) {
        // It is now the bot's turn
        const players = this.state.players;
        players[0].turn = false;
        players[1].turn = true;
        this.setState({ players });
        setTimeout(() => {
          this.botAction();
        }, 3000);
        // If player is D
      } else if (
        this.state.betOutstanding === 0 &&
        this.state.players[0].position === 0
      ) {
        // Deal next card and have the bot act because this means the bot is BB
        const players = this.state.players;
        players[0].turn = false;
        players[1].turn = true;
        this.setState({ players });
        setTimeout(() => {
          this.dealNext();
        }, 1500);
        setTimeout(() => {
          this.botAction();
        }, 3000);
      }
    }
    // If it is preflop
    else if (
      this.state.betOutstanding === 0 &&
      this.state.players[0].position === 1
    ) {
      // Deal next card and it is also player's turn next since they are out of position
      const players = this.state.players;
      players[0].turn = true;
      players[1].turn = false;
      this.setState({ players }, () => {
        setTimeout(() => {
          this.dealNext();
        }, 1500);
      });
    }
  };

  // Handle call from player
  handleCall = () => {
    // Only handle call if betOutstanding != 0
    if (this.state.betOutstanding !== 0) {
      const players = this.state.players;
      // If call amount is greater than player stack size then just go all in
      if (this.state.betOutstanding > players[0].stackSize) {
        players[0].betAmount = players[0].stackSize;
        players[0].stackSize = 0;
      }
      // Else remove call amount from player stack size
      else {
        players[0].stackSize -= this.state.betOutstanding;
        players[0].betAmount = players[1].betAmount;
      }
      // Update state and variables, deal next card(s), and have either bot or player go
      if (players[0].position === 0) {
        players[0].turn = false;
        players[1].turn = true;
      } else {
        players[0].turn = true;
        players[1].turn = false;
      }
      const newPotSize = this.state.potSize + this.state.betOutstanding;
      this.setState({ potSize: newPotSize }, () => {
        this.setState({ betOutstanding: 0 }, () => {
          if (players[0].position === 0) {
            setTimeout(() => {
              this.botAction();
            }, 3000);
          }
        });
      });
    }
  };

  // Handle click of raise button
  handleClickRaise = () => {
    const players = this.state.players;
    // Display raise amount input textbox
    players[0].viewText = !players[0].viewText;
    this.setState({ players });
  };

  // Handle raise from player
  handleRaise = (amount) => {
    var raiseAmount = parseInt(amount);
    const players = this.state.players;
    // Can only raise max of stack size
    if (raiseAmount > players[0].stackSize) raiseAmount = players[0].stackSize;
    // Update state and various variables, then call botAction()
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
            this.botAction();
          }, 3000);
        });
      });
    });
  };

  // Handle fold from player
  handleFold = () => {
    // Only fold when there is a bet
    if (this.state.betOutstanding !== 0) {
      // Update state and various variables
      const players = this.state.players;
      players[0].turn = false;
      players[1].stackSize += this.state.potSize;
      this.setState({ players }, () => {
        this.setState({ potSize: 0 }, () => {
          this.finishHand();
        });
      });
    }
  };

  // Update blinds based on user input
  updateBlinds = () => {
    const sb = parseInt(document.getElementById("sb").value);
    const bb = parseInt(document.getElementById("bb").value);
    this.setState({ smallBlind: sb, bigBlind: bb });
  };

  // Update starting stack based on user input
  updateStack = () => {
    const ss = parseInt(document.getElementById("ss").value);
    this.setState({ startingStack: ss });
    const players = this.state.players;
    for (var i = 0; i < this.state.players.length; i++) {
      players[i].stackSize = ss;
    }
    this.setState({ players });
  };

  // Method to handle bot action logic *CURRENTLY ONLY CHECKS WHEN NO BET AND CALLS WHEN THERE IS A BET*
  botAction = () => {
    const players = this.state.players;
    let cards = [];
    cards.push(this.state.players[1].botCards[0].code);
    cards.push(this.state.players[1].botCards[1].code);
    if (this.state.dealRiver) {
      for (var i = 0; i < 3; i++) {
        cards.push(this.state.flop[i].code);
      }
      cards.push(this.state.turn[0].code);
      cards.push(this.state.river[0].code);
      const decision = botRiver(
        cards,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount
      );
    } else if (this.state.dealTurn) {
      for (var i = 0; i < 3; i++) {
        cards.push(this.state.flop[i].code);
      }
      cards.push(this.state.turn[0].code);
      const decision = botTurn(
        cards,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount
      );
    } else if (this.state.dealFlop) {
      for (var i = 0; i < 3; i++) {
        cards.push(this.state.flop[i].code);
      }
      const decision = botFlop(
        cards,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount
      );
    } else {
      const [decision, raiseAmount] = botPre(
        cards,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount
      );
      if (decision === "f") {
        console.log("fold");
        this.botFold();
      } else if (decision === "c") {
        this.botCall();
        console.log("call");
      } else if (decision === "k") {
        this.botCheck();
        console.log("check");
      } else {
        this.botRaise(raiseAmount);
        console.log("raise");
      }
    }
  };

  botFold = () => {
    // Update state and various variables
    const players = this.state.players;
    players[0].turn = false;
    players[0].stackSize += this.state.potSize;
    this.setState({ players }, () => {
      this.setState({ potSize: 0 }, () => {
        this.finishHand();
        this.resetBetAmount();
      });
    });
  };

  botCall = () => {
    const players = this.state.players;
    const calledBet = Math.min(players[1].stackSize, this.state.betOutstanding);
    players[1].stackSize -= calledBet;
    players[1].betAmount = Math.min(players[1].stackSize, players[0].betAmount);
    players[0].turn = true;
    const newPotSize = this.state.potSize + calledBet;
    this.setState({ potSize: newPotSize });
    this.setState({ players });
    this.setState({ betOutstanding: 0 });
    if (this.state.dealFlop) {
      setTimeout(() => {
        this.dealNext();
      }, 1500);
    } else if (players[1].position === 1) {
      setTimeout(() => {
        this.dealNext();
      }, 1500);
    } else if (
      players[1].position === 0 &&
      players[0].betAmount > this.state.bigBlind
    ) {
      setTimeout(() => {
        this.dealNext();
      });
    }
  };

  botCheck = () => {
    const players = this.state.players;
    // Check if out of position
    if (this.state.betOutstanding === 0 && players[1].position === 1) {
      players[0].turn = true;
      players[1].turn = false;
      this.setState({ players });
      if (!this.state.dealFlop) {
        players[0].turn = false;
        this.setState({ players }, () => {
          setTimeout(() => {
            this.dealNext();
          }, 1500);
        });
      }
    }
    // Check if no bet and in position and deal next card(s)
    else if (this.state.betOutstanding === 0 && players[1].position === 0) {
      players[0].turn = true;
      players[1].turn = false;
      this.setState({ players });
      setTimeout(() => {
        this.dealNext();
      }, 1500);
    }
  };

  botRaise = (raiseAmount) => {
    const players = this.state.players;
    players[1].stackSize -= raiseAmount;
    players[1].betAmount = raiseAmount;
    players[0].turn = true;
    const newPotSize = this.state.potSize + raiseAmount;
    this.setState({ potSize: newPotSize });
    this.setState({ players });
    this.setState({
      betOutstanding: raiseAmount - this.state.betOutstanding,
    });
  };

  // Method to handle click of Start Game button
  startGame = () => {
    this.setState({ startedGame: true }, () => {
      // Only start game if values of blinds and stack are valid
      if (
        this.state.bigBlind > this.state.smallBlind &&
        this.state.startingStack >= this.state.bigBlind
      ) {
        // Begin game by dealing hole cards
        this.dealHoleCards();
      } else {
        alert("Please make sure game settings are valid.");
      }
    });
  };

  // Method to deal next hand by performing API call and getting new shuffled deck
  async dealNextHand() {
    const data = await axios.get(API_URL).then(({ data }) => data);

    const cards = await axios
      .get(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=52`)
      .then((e) => e.data.cards);

    this.setState({ cards }, () => {
      this.dealHoleCards();
    });
  }

  // Method to deal hole cards
  dealHoleCards = () => {
    // Make sure no other cards are dealt and displayed besides hole cards
    this.setState({ dealFlop: false }, () => {
      this.setState({ dealTurn: false }, () => {
        this.setState({ dealRiver: false }, () => {
          this.setState({ showBotCards: false }, () => {
            // Initialize pot size to just the blinds
            const newPot = this.state.smallBlind + this.state.bigBlind;
            const sb = this.state.smallBlind;
            this.setState({ potSize: newPot }, () => {
              this.setState({ betOutstanding: sb }, () => {
                this.setState({ finishedHand: false }, () => {
                  this.setState({ flop: [] }, () => {
                    this.setState({ turn: [] }, () => {
                      this.setState({ river: [] }, () => {
                        this.setState({ dealHoleCards: true });
                        this.setState({ showedCards: false });
                        // Deal hole cards if API call returned deck with non zero length
                        if (this.state.cards.length !== 0) {
                          const playerCards = this.state.cards.slice(0, 2);
                          const players = this.state.players;
                          players[0].playerCards = playerCards;

                          const botCards = this.state.cards.slice(2, 4);
                          players[1].botCards = botCards;

                          this.setState({ players });
                          // Go to preflop betting
                          this.preFlopBetting();
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  // Method to handle preflop betting
  preFlopBetting = () => {
    const players = this.state.players;
    // If player is D, initialize stack sizes and bet amounts accordingly
    if (players[0].position === 0) {
      players[0].turn = true;
      players[0].stackSize -= this.state.smallBlind;
      players[0].betAmount = this.state.smallBlind;
      players[1].betAmount = this.state.bigBlind;
      players[1].stackSize -= this.state.bigBlind;
      this.setState({ players });
    }
    // If player is BB, initialize stack sizes and bet amounts accordingly and call botAction()
    else {
      players[0].turn = false;
      players[1].turn = true;
      players[0].betAmount = this.state.bigBlind;
      players[0].stackSize -= this.state.bigBlind;
      players[1].betAmount = this.state.smallBlind;
      players[1].stackSize -= this.state.smallBlind;
      this.setState({ players });
      setTimeout(() => {
        this.botAction();
      }, 3000);
    }
  };

  // Deal next card(s)
  dealNext = () => {
    // Set betOutstanding to 0 and determine which street to deal and display
    this.setState({ betOutstanding: 0 }, () => {
      if (this.state.flop.length === 0) this.dealFlop();
      else if (this.state.turn.length === 0) this.dealTurn();
      else if (this.state.river.length === 0) this.dealRiver();
      else if (!this.state.showedCards) this.showDown();
    });
  };

  // Method to determine and deal flop
  dealFlop = () => {
    this.resetBetAmount();
    const flop = this.state.cards.slice(4, 7);
    this.setState({ dealFlop: true });
    this.setState({ flop: flop });
  };

  // Method to determine and deal turn
  dealTurn = () => {
    this.resetBetAmount();
    const turn = this.state.cards.slice(7, 8);
    this.setState({ dealTurn: true });
    this.setState({ turn: turn });
  };

  // Method to determine and deal river
  dealRiver = () => {
    this.resetBetAmount();
    const river = this.state.cards.slice(8, 9);
    this.setState({ dealRiver: true });
    this.setState({ river: river });
  };

  // Method to deal with hand if it goes to showdown
  showDown = () => {
    // Display bot cards
    this.setState({ showBotCards: true }, () => {
      this.setState({ finishedHand: true }, () => {
        this.setState({ showedCards: true }, () => {
          // If player had a stronger unique hand
          if (
            evaluateRiver(
              this.state.players[0].playerCards,
              this.state.flop,
              this.state.turn,
              this.state.river
            )[2] >
            evaluateRiver(
              this.state.players[1].botCards,
              this.state.flop,
              this.state.turn,
              this.state.river
            )[2]
          ) {
            const players = this.state.players;
            players[0].turn = false;
            players[0].stackSize += this.state.potSize;
            this.setState({ players }, () => {
              this.setState({ potSize: 0 }, () => {
                this.finishHand();
                return;
              });
            });
            // If bot had a stronger unique hand
          } else if (
            evaluateRiver(
              this.state.players[0].playerCards,
              this.state.flop,
              this.state.turn,
              this.state.river
            )[2] <
            evaluateRiver(
              this.state.players[1].botCards,
              this.state.flop,
              this.state.turn,
              this.state.river
            )[2]
          ) {
            const players = this.state.players;
            players[0].turn = false;
            players[1].stackSize += this.state.potSize;
            this.setState({ players }, () => {
              this.setState({ potSize: 0 }, () => {
                this.finishHand();
                return;
              });
            });
            // If both players had same main hand, look for kickers
          } else {
            this.splitPot();
            const players = this.state.players;
            players[0].turn = false;
            this.setState({ players }, () => {
              this.setState({ potSize: 0 }, () => {
                this.finishHand();
                return;
              });
            });
          }
        });
      });
    });
  };

  breakTie = () => {
    if (document.getElementById("playerHand").textContent === "Royal Flush") {
      this.splitPot();
    }
  };

  splitPot = () => {
    const players = this.state.players;
    if (this.state.potSize % 2 === 0) {
      players[0].stackSize += this.state.potSize / 2;
      players[1].stackSize += this.state.potSize / 2;
    } else {
      players[0].stackSize += Math.ceil(this.state.potSize / 2);
      players[1].stackSize += Math.ceil(this.state.potSize / 2) - 1;
    }
    this.setState({ players });
  };

  // Method to finish up hand
  finishHand = () => {
    const players = this.state.players;
    // Switch positions
    for (var i = 0; i < this.state.players.length; i++) {
      players[i].turn = false;
      players[i].position = 1 - players[i].position;
    }
    this.setState({ players }, () => {
      this.setState({ finishedHand: true }, () => {});
    });
  };

  // Method to reset bet amounts for each player
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
              disabled={this.state.startedGame ? 1 : 0}
              onClick={this.startGame}
            >
              Start Game
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
        <span id="playerHand">
          {this.state.dealHoleCards ? (
            <Hand
              holeCards={this.state.players[0].playerCards}
              flop={this.state.flop}
              turn={this.state.turn}
              river={this.state.river}
              dealHoleCards={this.state.dealHoleCards}
              dealFlop={this.state.dealFlop}
              dealTurn={this.state.dealTurn}
              dealRiver={this.state.dealRiver}
            ></Hand>
          ) : null}
        </span>
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
          <span id="botHand">
            {this.state.showBotCards ? (
              <Hand
                holeCards={this.state.players[1].botCards}
                flop={this.state.flop}
                turn={this.state.turn}
                river={this.state.river}
                dealHoleCards={this.state.dealHoleCards}
                dealFlop={this.state.dealFlop}
                dealTurn={this.state.dealTurn}
                dealRiver={this.state.dealRiver}
              ></Hand>
            ) : null}
          </span>
          {this.state.showBotCards ? (
            <HoleCards holeCards={this.state.players[1].botCards}></HoleCards>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
