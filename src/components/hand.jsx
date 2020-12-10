import React, { Component } from "react";

class Hand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holeCards: this.props.holeCards,
      flop: this.props.flop,
      turn: this.props.turn,
      river: this.props.river,
      values: ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"],
    };
  }

  // handName = (holeCards, flop, turn, river) => {
  //   console.log(flop);
  //   this.setState({
  //     holeCards: this.props.holeCards,
  //     flop: this.props.flop,
  //     turn: this.props.turn,
  //     river: this.props.river,
  //   });
  //   if (this.state.flop.length === 0) {
  //     return this.evaluateHoleCards(this.state.holeCards);
  //   } else if (this.state.turn.length === 0) {
  //     return this.evaluateFlop(this.state.holeCards, this.state.flop);
  //   } else if (this.state.river.length === 0) {
  //     return this.evaluateTurn(
  //       this.state.holeCards,
  //       this.state.flop,
  //       this.state.turn
  //     );
  //   } else {
  //     return this.evaluateRiver(
  //       this.state.holeCards,
  //       this.state.flop,
  //       this.state.turn,
  //       this.state.river
  //     );
  //   }
  // };

  evaluateHoleCards = (holeCards) => {
    var card1 = holeCards[0].code;
    var card2 = holeCards[1].code;
    if (card1.substring(0, 1) === card2.substring(0, 1))
      return "Pair of " + card1.substring(0, 1) + "s";
    else {
      if (
        this.state.values.indexOf(card1.substring(0, 1)) >
        this.state.values.indexOf(card2.substring(0, 1))
      ) {
        return card1.substring(0, 1) + " high";
      } else return card2.substring(0, 1) + " high";
    }
  };

  evaluateFlop = (holeCards, flop) => {
    return "test";
  };

  evaluateTurn = (holeCards, flop, turn) => {};

  evaluateRiver = (holeCards, flop, turn, river) => {};

  isRoyalFlush(cards) {
    if (this.isStraightFlush(cards)) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].includes("A")) return true;
      }
    }
    return false;
  }

  isStraightFlush(cards) {
    if (this.isFlush(cards) && this.isStraight(cards)) {
      return true;
    }
    return false;
  }

  isFourOfAKind(cards) {}

  isFullHouse(cards) {}

  isFlush(cards) {
    for (var i = 0; i < cards.length - 1; i++) {
      if (cards[i].substr(1) !== cards[i + 1].substr(1)) return false;
    }
    return true;
  }

  isStraight(cards) {}

  isTrips(cards) {}

  isTwoPair(cards) {}

  isPair(cards) {}

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
    if (!dealHoleCards) return null;
    else if (!dealFlop) {
      return this.evaluateHoleCards(holeCards);
    } else if (!dealTurn) {
      return this.evaluateFlop(holeCards, flop);
    } else if (!dealRiver) {
      return this.evaluateTurn(holeCards, flop, turn);
    } else {
      return this.evaluateRiver(holeCards, flop, turn, river);
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