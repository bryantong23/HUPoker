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
    var cards = [];
    for (var i = 0; i < holeCards.length; i++) {
      cards.push(holeCards[i].code);
    }
    for (var i = 0; i < flop.length; i++) {
      cards.push(flop[i].code);
    }
    if (this.isRoyalFlush(cards)) return "Royal Flush";
    if (this.isStraightFlush(cards)) return "Straight Flush";
    if (this.isFourOfAKind(cards)) return "Four of a kind";
    if (this.isFullHouse(cards)) return "Full House";
    if (this.isFlush(cards)) return "Flush";
    if (this.isStraight(cards)) return "Straight";
    if (this.isTrips(cards)) return "Three of a kind";
    if (this.isTwoPair(cards)) return "Two pair";
    if (this.isPair(cards)) return "Pair";
    else {
      var high = "";
      var indexHigh = 0;
      for (var i = 0; i < cards.length; i++) {
        var tempIndex = this.state.values.indexOf(cards[i].substr(0, 1));
        if (tempIndex > indexHigh) {
          indexHigh = tempIndex;
          high = cards[i].substr(0, 1);
        }
      }
      return high + " high";
    }
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

  isFourOfAKind(cards) {
    var vals = [];
    for (var i = 0; i < cards.length; i++) {
      vals.push(cards[i].substr(0, 1));
    }
    var set = new Set(vals);
    if (set.size === 2) {
      var uniqueVals = Array.from(set);
      for (var i = 0; i < uniqueVals.length; i++) {
        var valCount = 0;
        for (var j = 0; j < vals.length; j++) {
          if (vals[j] === uniqueVals[i]) valCount++;
          if (valCount === 4) return true;
        }
      }
    }
    return false;
  }

  isFullHouse(cards) {
    var vals = [];
    for (var i = 0; i < cards.length; i++) {
      vals.push(cards[i].substr(0, 1));
    }
    var set = new Set(vals);
    if (set.size === 2) {
      var uniqueVals = Array.from(set);
      for (var i = 0; i < uniqueVals.length; i++) {
        var valCount = 0;
        for (var j = 0; j < vals.length; j++) {
          if (vals[j] === uniqueVals[i]) valCount++;
          if (valCount === 3) return true;
        }
      }
    }
    return false;
  }

  isFlush(cards) {
    for (var i = 0; i < cards.length - 1; i++) {
      if (cards[i].substr(1) !== cards[i + 1].substr(1)) return false;
    }
    return true;
  }

  isStraight(cards) {
    var indices = [];
    for (var i = 0; i < cards.length; i++) {
      indices.push(this.state.values.indexOf(cards[i].substr(0, 1)));
    }
    indices.sort();
    if (indices[indices.length - 1] - indices[0] === indices.length - 1)
      return true;
    else return false;
  }

  isTrips(cards) {
    var vals = [];
    for (var i = 0; i < cards.length; i++) {
      vals.push(cards[i].substr(0, 1));
    }
    var set = new Set(vals);
    if (set.size === 3) {
      var uniqueVals = Array.from(set);
      for (var i = 0; i < uniqueVals.length; i++) {
        var valCount = 0;
        for (var j = 0; j < vals.length; j++) {
          if (vals[j] === uniqueVals[i]) valCount++;
          if (valCount === 3) return true;
        }
      }
    }
    return false;
  }

  isTwoPair(cards) {
    var vals = [];
    for (var i = 0; i < cards.length; i++) {
      vals.push(cards[i].substr(0, 1));
    }
    var set = new Set(vals);
    if (set.size === 3) {
      return true;
    }
    return false;
  }

  isPair(cards) {
    var vals = [];
    for (var i = 0; i < cards.length; i++) {
      vals.push(cards[i].substr(0, 1));
    }
    var set = new Set(vals);
    if (set.size === 4) {
      return true;
    }
    return false;
  }

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
