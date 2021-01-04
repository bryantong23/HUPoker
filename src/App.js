import "./App.css";
import Players from "./components/players";
import React, { Component } from "react";
import axios from "axios";
import HoleCards from "./components/holeCards";
import Board from "./components/board";
import Hand from "./components/hand";
import {
  evaluateRiver,
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
      let newPotSize = this.state.potSize;
      // If call amount is greater than player stack size then just go all in
      if (this.state.betOutstanding > players[0].stackSize) {
        players[0].betAmount = players[0].stackSize;
        newPotSize += players[0].stackSize;
        players[0].stackSize = 0;
      }
      // Else remove call amount from player stack size
      else {
        players[0].stackSize -= this.state.betOutstanding;
        players[0].betAmount = players[1].betAmount;
        newPotSize += this.state.betOutstanding;
      }
      // Update state and variables, deal next card(s), and have either bot or player go
      this.setState({ potSize: newPotSize }, () => {
        this.setState({ betOutstanding: 0 });
      });

      // If player is in position
      if (players[0].position === 0) {
        players[0].turn = false;
        players[1].turn = true;
        // If postflop, then deal next and have bot act
        if (this.state.dealFlop) {
          this.setState({ players }, () => {
            setTimeout(() => {
              this.dealNext();
            }, 1500);
            setTimeout(() => {
              this.botAction();
            }, 3000);
          });
          // If preflop
        } else {
          // If bot raised then deal next
          if (players[1].betAmount !== this.state.bigBlind) {
            this.setState({ players }, () => {
              setTimeout(() => {
                this.dealNext();
              }, 1500);
            });
            // If bot did not raise bot has to act first
          } else {
            this.setState({ players }, () => {
              setTimeout(() => {
                this.botAction();
              }, 3000);
            });
          }
        }
      }
      // If out of position then just deal next and have player go
      else {
        players[0].turn = true;
        players[1].turn = false;
        this.setState({ players }, () => {
          setTimeout(() => {
            this.dealNext();
          }, 1500);
        });
      }
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
    // Raise amount must be at least min raise size
    if (raiseAmount >= 2 * players[1].betAmount) {
      // Can only raise max of stack size
      if (raiseAmount > players[0].stackSize)
        raiseAmount = players[0].stackSize;
      // Update state and various variables, then call botAction()
      players[0].stackSize -= raiseAmount;
      players[0].stackSize += players[0].betAmount;
      players[0].viewText = !players[0].viewText;
      players[0].turn = false;
      players[1].turn = true;
      const newBetOutstanding = raiseAmount - this.state.players[1].betAmount;
      const newPotSize =
        this.state.potSize + raiseAmount - players[0].betAmount;
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
    }
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

  // Method to handle bot action logic
  botAction = () => {
    let cards = [];
    cards.push(this.state.players[1].botCards[0].code);
    cards.push(this.state.players[1].botCards[1].code);
    // If it is on river
    if (this.state.dealRiver) {
      // Call botRiver() and perform resulting action
      const [decision, raiseAmount] = botRiver(
        this.state.players[1].botCards,
        this.state.flop,
        this.state.turn,
        this.state.river,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount,
        this.state.potSize
      );
      if (decision === "f") {
        this.botFold();
      } else if (decision === "c") {
        this.botCall();
      } else if (decision === "k") {
        this.botCheck();
      } else {
        this.botRaise(raiseAmount);
      }
    }
    // If it is on turn
    else if (this.state.dealTurn) {
      // Call botTurn() and perform resulting action
      const [decision, raiseAmount] = botTurn(
        this.state.players[1].botCards,
        this.state.flop,
        this.state.turn,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount,
        this.state.potSize
      );
      if (decision === "f") {
        this.botFold();
      } else if (decision === "c") {
        this.botCall();
      } else if (decision === "k") {
        this.botCheck();
      } else {
        this.botRaise(raiseAmount);
      }
    }
    // If it is on flop
    else if (this.state.dealFlop) {
      for (var i = 0; i < 3; i++) {
        cards.push(this.state.flop[i].code);
      }
      // Call botFlop() and perform resulting action
      const [decision, raiseAmount] = botFlop(
        this.state.players[1].botCards,
        this.state.flop,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount,
        this.state.potSize
      );
      if (decision === "f") {
        this.botFold();
      } else if (decision === "c") {
        this.botCall();
      } else if (decision === "k") {
        this.botCheck();
      } else {
        this.botRaise(raiseAmount);
      }
    }
    // If it is preflop
    else {
      // Call botPre() and perform resulting action
      const [decision, raiseAmount] = botPre(
        cards,
        this.state.players[1].position,
        this.state.players[1].stackSize,
        this.state.betOutstanding,
        this.state.players[0].betAmount,
        this.state.potSize
      );
      if (decision === "f") {
        this.botFold();
      } else if (decision === "c") {
        this.botCall();
      } else if (decision === "k") {
        this.botCheck();
      } else {
        this.botRaise(raiseAmount);
      }
    }
  };

  // Method to handle bot fold
  botFold = () => {
    // Update state and various variables, give pot to player
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

  // Method to handle bot call
  botCall = () => {
    const players = this.state.players;
    // Cannot call more than stack size
    const calledBet = Math.min(players[1].stackSize, this.state.betOutstanding);
    players[1].stackSize -= calledBet;
    players[1].betAmount = Math.min(players[1].stackSize, players[0].betAmount);
    if (players[0].position === 1) players[0].turn = true;
    const newPotSize = this.state.potSize + calledBet;
    this.setState({ potSize: newPotSize }, () => {
      this.setState({ players }, () => {
        this.setState({ betOutstanding: 0 }, () => {
          // If postflop
          if (this.state.dealFlop) {
            // If bot is BB then deal next and have bot go
            if (this.state.players[1].position === 1) {
              setTimeout(() => {
                this.dealNext();
              }, 1500);
              setTimeout(() => {
                this.botAction();
              }, 3000);
            }
            // Otherwise just deal next
            else {
              setTimeout(() => {
                this.dealNext();
              }, 1500);
            }
          }
          // If preflop
          // If bot in BB, deal next and have bot go
          else if (players[1].position === 1) {
            setTimeout(() => {
              this.dealNext();
            }, 1500);
            setTimeout(() => {
              this.botAction();
            }, 3000);
          }
          // If bot in D and player raised more than BB, just deal next
          else if (
            players[1].position === 0 &&
            players[0].betAmount > this.state.bigBlind
          ) {
            setTimeout(() => {
              this.dealNext();
            }, 1500);
          }
        });
      });
    });
  };

  // Method to handle bot check
  botCheck = () => {
    const players = this.state.players;
    // If postflop
    if (this.state.dealFlop) {
      // If bot in BB, have player go
      if (this.state.players[1].position === 1) {
        players[0].turn = true;
        players[1].turn = false;

        this.setState({ players });
      }
      // If bot in D, deal next and have player go
      else {
        players[0].turn = true;
        players[1].turn = false;

        this.setState({ players }, () => {
          setTimeout(() => {
            this.dealNext();
          }, 1500);
        });
      }
    }
    // If preflop, just deal flop
    else {
      players[0].turn = false;
      players[1].turn = true;

      this.setState({ players }, () => {
        setTimeout(() => {
          this.dealNext();
        }, 1500);
      });
    }
  };

  // Method to handle bot raise
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
    const players = this.state.players;
    if (players[0].stackSize > 0 && players[1].stackSize > 0) {
      // Make sure no other cards are dealt and displayed besides hole cards
      this.setState({ dealFlop: false }, () => {
        this.setState({ dealTurn: false }, () => {
          this.setState({ dealRiver: false }, () => {
            this.setState({ showBotCards: false }, () => {
              // Initialize pot size to just the blinds
              let newPot = 0;
              let bo = 0;
              // If player in D
              if (players[0].position === 0) {
                // If both players have sufficient stack sizes then proceed as normal
                if (
                  players[0].stackSize >= this.state.smallBlind &&
                  players[1].stackSize >= this.state.bigBlind
                ) {
                  newPot = this.state.smallBlind + this.state.bigBlind;
                  bo = this.state.smallBlind;
                }
                // If player is too short, just put all in
                else if (
                  players[0].stackSize < this.state.smallBlind &&
                  players[1].stackSize >= this.state.bigBlind
                ) {
                  newPot = players[0].stackSize + this.state.bigBlind;
                  bo = this.state.bigBlind - players[0].stackSize;
                }
                // If bot is too short, just put all in
                else if (
                  players[0].stackSize >= this.state.smallBlind &&
                  players[1].stackSize < this.state.bigBlind
                ) {
                  newPot = this.state.smallBlind + players[1].stackSize;
                  bo = Math.max(
                    0,
                    players[1].stackSize - this.state.smallBlind
                  );
                }
                // If both are too short, put both all in
                else {
                  newPot = players[0].stackSize + players[1].stackSize;
                  bo = Math.max(0, players[1].stackSize - players[0].stackSize);
                }
              }
              // If player in BB
              else {
                // If both players have sufficient stack sizes then proceed as normal
                if (
                  players[1].stackSize >= this.state.smallBlind &&
                  players[0].stackSize >= this.state.bigBlind
                ) {
                  newPot = this.state.smallBlind + this.state.bigBlind;
                  bo = this.state.smallBlind;
                }
                // If bot is too short, put bot all in
                else if (
                  players[1].stackSize < this.state.smallBlind &&
                  players[0].stackSize >= this.state.bigBlind
                ) {
                  newPot = players[1].stackSize + this.state.bigBlind;
                  bo = this.state.bigBlind - players[1].stackSize;
                }
                // If player is too short, put all in
                else if (
                  players[1].stackSize >= this.state.smallBlind &&
                  players[0].stackSize < this.state.bigBlind
                ) {
                  newPot = this.state.smallBlind + players[0].stackSize;
                  bo = Math.max(
                    0,
                    players[0].stackSize - this.state.smallBlind
                  );
                }
                // If both are too short, put everyone all in
                else {
                  newPot = players[1].stackSize + players[0].stackSize;
                  bo = Math.max(0, players[0].stackSize - players[1].stackSize);
                }
              }
              this.setState({ potSize: newPot }, () => {
                this.setState({ betOutstanding: bo }, () => {
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
    } else {
    }
  };

  // Method to handle preflop betting
  preFlopBetting = () => {
    const players = this.state.players;
    // If player is D, initialize stack sizes and bet amounts accordingly
    if (players[0].position === 0) {
      players[0].turn = true;
      // Deal with short stacks, similar to dealHoleCards()
      if (
        players[0].stackSize >= this.state.smallBlind &&
        players[1].stackSize >= this.state.bigBlind
      ) {
        players[0].stackSize -= this.state.smallBlind;
        players[0].betAmount = this.state.smallBlind;
        players[1].betAmount = this.state.bigBlind;
        players[1].stackSize -= this.state.bigBlind;
      } else if (players[0].stackSize < this.state.smallBlind) {
        players[0].betAmount = players[0].stackSize;
        players[0].stackSize = 0;
        players[1].betAmount = this.state.bigBlind;
        players[1].stackSize -= this.state.bigBlind;
      } else if (players[1].stackSize < this.state.bigBlind) {
        players[0].stackSize -= this.state.smallBlind;
        players[0].betAmount = this.state.smallBlind;
        players[1].betAmount = players[1].stackSize;
        players[1].stackSize = 0;
      }
      this.setState({ players });
    }
    // If player is BB, initialize stack sizes and bet amounts accordingly and call botAction()
    else {
      players[0].turn = false;
      players[1].turn = true;
      if (
        players[0].stackSize >= this.state.bigBlind &&
        players[1].stackSize >= this.state.smallBlind
      ) {
        players[0].betAmount = this.state.bigBlind;
        players[0].stackSize -= this.state.bigBlind;
        players[1].betAmount = this.state.smallBlind;
        players[1].stackSize -= this.state.smallBlind;
      } else if (players[0].stackSize < this.state.bigBlind) {
        players[0].betAmount = players[0].stackSize;
        players[0].stackSize = 0;
        players[1].betAmount = this.state.smallBlind;
        players[1].stackSize -= this.state.smallBlind;
      } else if (players[1].stackSize < this.state.smallBlind) {
        players[0].stackSize -= this.state.bigBlind;
        players[0].betAmount = this.state.bigBlind;
        players[1].betAmount = players[1].stackSize;
        players[1].stackSize = 0;
      }
      this.setState({ players });
      setTimeout(() => {
        this.botAction();
      }, 3000);
    }
  };

  // Deal next card(s)
  dealNext = () => {
    if (this.state.players[0].betAmount === this.state.players[1].betAmount) {
      // Set betOutstanding to 0 and determine which street to deal and display
      this.setState({ betOutstanding: 0 }, () => {
        if (this.state.flop.length === 0) this.dealFlop();
        else if (this.state.turn.length === 0) this.dealTurn();
        else if (this.state.river.length === 0) this.dealRiver();
        else if (!this.state.showedCards) this.showDown();
      });
    }
  };

  // Method to determine and deal flop
  dealFlop = () => {
    this.resetBetAmount();
    const flop = this.state.cards.slice(4, 7);
    this.setState({ dealFlop: true });
    this.setState({ flop: flop }, () => {
      if (this.state.players[1].position === 1)
        setTimeout(() => {
          this.botAction();
        }, 3000);
    });
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

  // Method to split pot in case of tie
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
