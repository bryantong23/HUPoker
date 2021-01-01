import React, { Component } from "react";
import {
  evaluateHoleCards,
  evaluateFlop,
  evaluateRiver,
  evaluateTurn,
} from "./HandEvaluator.js";

// Component to represent each player's hand
class Hand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holeCards: this.props.holeCards,
      flop: this.props.flop,
      turn: this.props.turn,
      river: this.props.river,
      values: ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"],
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

  // Method to display hand strength
  displayHand = (
    dealHoleCards,
    dealFlop,
    dealTurn,
    dealRiver,
    holeCards,
    flop,
    turn,
    river
  ) => {
    // If hole cards haven't been dealt yet don't display anything
    if (!dealHoleCards) return null;
    // If flop hasn't been dealt yet only evaluate hole cards
    else if (!dealFlop) {
      return evaluateHoleCards(holeCards);
    }
    // If turn hasn't been dealt yet only evaluate hole cards and flop
    else if (!dealTurn) {
      return evaluateFlop(holeCards, flop)[0];
    }
    // If river hasn't been dealt yet only evaluate hole cards, flop, and turn
    else if (!dealRiver) {
      return evaluateTurn(holeCards, flop, turn)[0];
    }
    // Otherwise evaluate all cards
    else {
      return evaluateRiver(holeCards, flop, turn, river)[0];
    }
  };

  render() {
    const {
      dealHoleCards,
      dealFlop,
      dealTurn,
      dealRiver,
      holeCards,
      flop,
      turn,
      river,
    } = this.props;
    return (
      <React.Fragment>
        <span>
          {dealHoleCards ? (
            <p>
              {this.displayHand(
                dealHoleCards,
                dealFlop,
                dealTurn,
                dealRiver,
                holeCards,
                flop,
                turn,
                river
              )}
            </p>
          ) : null}
        </span>
      </React.Fragment>
    );
  }
}

export default Hand;
