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

  evaluateHoleCards = (holeCards) => {
    var card1 = holeCards[0].code;
    var card2 = holeCards[1].code;
    if (card1.substring(0, 1) === card2.substring(0, 1)) return "Pair";
    else {
      return "High card";
    }
  };

  evaluateFiveCardHand = (cards) => {
    if (this.isRoyalFlush(cards)) return 9;
    if (this.isStraightFlush(cards)) return 8;
    if (this.isFourOfAKind(cards)) return 7;
    if (this.isFullHouse(cards)) return 6;
    if (this.isFlush(cards)) return 5;
    if (this.isStraight(cards)) return 4;
    if (this.isTrips(cards)) return 3;
    if (this.isTwoPair(cards)) return 2;
    if (this.isPair(cards)) return 1;
    else return 0;
  };

  evaluateFlop = (holeCards, flop) => {
    var cards = [];
    for (var i = 0; i < holeCards.length; i++) {
      cards.push(holeCards[i].code);
    }
    for (var i = 0; i < flop.length; i++) {
      cards.push(flop[i].code);
    }
    return this.state.rank[this.evaluateFiveCardHand(cards)];
  };

  evaluateTurn = (holeCards, flop, turn) => {
    var cards = [];
    for (var i = 0; i < holeCards.length; i++) {
      cards.push(holeCards[i].code);
    }
    for (var i = 0; i < flop.length; i++) {
      cards.push(flop[i].code);
    }
    cards.push(turn[0].code);
    var high = 0;
    for (var i = 0; i < 6; i++) {
      var tempCards = cards.slice();
      tempCards.splice(i, 1);
      if (this.evaluateFiveCardHand(tempCards) > high)
        high = this.evaluateFiveCardHand(tempCards);
    }
    return this.state.rank[high];
  };

  evaluateRiver = (holeCards, flop, turn, river) => {
    var cards = [];
    for (var i = 0; i < holeCards.length; i++) {
      cards.push(holeCards[i].code);
    }
    for (var i = 0; i < flop.length; i++) {
      cards.push(flop[i].code);
    }
    cards.push(turn[0].code);
    cards.push(river[0].code);
    var high = 0;
    for (var i = 0; i < cards.length - 1; i++) {
      for (var j = 1; j < cards.length; j++) {
        var tempCards = cards.slice();
        tempCards.splice(i, 1);
        tempCards.splice(j - 1, 1);
        if (this.evaluateFiveCardHand(tempCards) > high)
          high = this.evaluateFiveCardHand(tempCards);
      }
    }
    return this.state.rank[high];
  };

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
    var suits = [];
    for (var i = 0; i < cards.length; i++) {
      suits.push(cards[i].substr(1));
    }
    var set = new Set(suits);
    if (set.size === 1) {
      return true;
    } else return false;
  }

  isStraight(cards) {
    var indices = [];
    for (var i = 0; i < cards.length; i++) {
      indices.push(this.state.values.indexOf(cards[i].substr(0, 1)));
    }
    indices.sort(function (a, b) {
      return a - b;
    });
    var wheel = [0, 1, 2, 3, 12];
    if (
      indices.length === wheel.length &&
      indices.every((value, index) => value === wheel[index])
    )
      return true;
    for (var i = 0; i < indices.length - 1; i++) {
      if (indices[i] + 1 !== indices[i + 1]) return false;
    }
    return true;
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
