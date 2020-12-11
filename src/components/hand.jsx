import React, { Component } from "react";
import {
  evaluateHoleCards,
  evaluateFiveCardHand,
  evaluateFlop,
  evaluateRiver,
  evaluateTurn,
  isRoyalFlush,
  isStraightFlush,
  isFourOfAKind,
  isFullHouse,
  isFlush,
  isStraight,
  isTrips,
  isTwoPair,
  isPair,
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

  // Evaluate strength of hole cards
  // evaluateHoleCards = (holeCards) => {
  //   var card1 = holeCards[0].code;
  //   var card2 = holeCards[1].code;
  //   if (card1.substring(0, 1) === card2.substring(0, 1)) return "Pair";
  //   else {
  //     return "High card";
  //   }
  // };

  // // Evaluate any given 5 card hand
  // evaluateFiveCardHand = (cards) => {
  //   if (this.isRoyalFlush(cards)) return 9;
  //   if (this.isStraightFlush(cards)) return 8;
  //   if (this.isFourOfAKind(cards)) return 7;
  //   if (this.isFullHouse(cards)) return 6;
  //   if (this.isFlush(cards)) return 5;
  //   if (this.isStraight(cards)) return 4;
  //   if (this.isTrips(cards)) return 3;
  //   if (this.isTwoPair(cards)) return 2;
  //   if (this.isPair(cards)) return 1;
  //   else return 0;
  // };

  // // Evaluate hand after flop
  // evaluateFlop = (holeCards, flop) => {
  //   var cards = [];
  //   for (var i = 0; i < holeCards.length; i++) {
  //     cards.push(holeCards[i].code);
  //   }
  //   for (var j = 0; j < flop.length; j++) {
  //     cards.push(flop[j].code);
  //   }
  //   return this.state.rank[this.evaluateFiveCardHand(cards)];
  // };

  // // Evaluate hand after turn
  // evaluateTurn = (holeCards, flop, turn) => {
  //   var cards = [];
  //   for (var i = 0; i < holeCards.length; i++) {
  //     cards.push(holeCards[i].code);
  //   }
  //   for (var j = 0; j < flop.length; j++) {
  //     cards.push(flop[j].code);
  //   }
  //   cards.push(turn[0].code);
  //   // Loop through possible 5 hand combos and return hand with highest strength
  //   var high = 0;
  //   for (var k = 0; k < 6; k++) {
  //     var tempCards = cards.slice();
  //     tempCards.splice(k, 1);
  //     if (this.evaluateFiveCardHand(tempCards) > high)
  //       high = this.evaluateFiveCardHand(tempCards);
  //   }
  //   return this.state.rank[high];
  // };

  // // Evaluate hand after river
  // evaluateRiver = (holeCards, flop, turn, river) => {
  //   var cards = [];
  //   for (var i = 0; i < holeCards.length; i++) {
  //     cards.push(holeCards[i].code);
  //   }
  //   for (var j = 0; j < flop.length; j++) {
  //     cards.push(flop[j].code);
  //   }
  //   cards.push(turn[0].code);
  //   cards.push(river[0].code);
  //   var high = 0;
  //   // Loop through possible 5 hand combos and return hand with highest strength
  //   for (var k = 0; k < cards.length - 1; k++) {
  //     for (var l = 1; l < cards.length; l++) {
  //       var tempCards = cards.slice();
  //       tempCards.splice(k, 1);
  //       tempCards.splice(l - 1, 1);
  //       if (this.evaluateFiveCardHand(tempCards) > high)
  //         high = this.evaluateFiveCardHand(tempCards);
  //     }
  //   }
  //   return this.state.rank[high];
  // };

  // // Check if given cards represent a royal flush
  // isRoyalFlush(cards) {
  //   // Must be a straight flush and contain an Ace and 10
  //   if (this.isStraightFlush(cards)) {
  //     for (var i = 0; i < cards.length; i++) {
  //       if (cards[i].includes("A")) {
  //         for (var j = 0; j < cards.length; j++) {
  //           if (cards[j].includes("0")) {
  //             return true;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  // // Check if given cards represent a straight flush
  // isStraightFlush(cards) {
  //   // Must be a straight and a flush
  //   if (this.isFlush(cards) && this.isStraight(cards)) {
  //     return true;
  //   }
  //   return false;
  // }

  // // Check if given cards represent a four of a kind
  // isFourOfAKind(cards) {
  //   // Add all the values of the cards to array 'vals'
  //   var vals = [];
  //   for (var i = 0; i < cards.length; i++) {
  //     vals.push(cards[i].substr(0, 1));
  //   }
  //   // Create a set from array 'vals'
  //   var set = new Set(vals);
  //   // Can only be four of a kind if size of set is 2
  //   if (set.size === 2) {
  //     var uniqueVals = Array.from(set);
  //     // If one of the elements occurs 4 times then it is four of a kind
  //     for (var k = 0; k < uniqueVals.length; k++) {
  //       var valCount = 0;
  //       for (var j = 0; j < vals.length; j++) {
  //         if (vals[j] === uniqueVals[k]) valCount++;
  //         if (valCount === 4) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  // // Check if given cards represent a full house
  // isFullHouse(cards) {
  //   // Add all the values of the cards to array 'vals'
  //   var vals = [];
  //   for (var i = 0; i < cards.length; i++) {
  //     vals.push(cards[i].substr(0, 1));
  //   }
  //   // Create a set from array 'vals'
  //   var set = new Set(vals);
  //   // Can only be full house if size of set is 2
  //   if (set.size === 2) {
  //     var uniqueVals = Array.from(set);
  //     // If one of the elements occurs 3 times then it is full house
  //     for (var k = 0; k < uniqueVals.length; k++) {
  //       var valCount = 0;
  //       for (var j = 0; j < vals.length; j++) {
  //         if (vals[j] === uniqueVals[k]) valCount++;
  //         if (valCount === 3) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  // // Check if given cards represent a flush
  // isFlush(cards) {
  //   // Add all suits of the cards to array 'suits'
  //   var suits = [];
  //   for (var i = 0; i < cards.length; i++) {
  //     suits.push(cards[i].substr(1));
  //   }
  //   // Create a set from array 'suits'
  //   var set = new Set(suits);
  //   // Can only be flush if size of set is 1
  //   if (set.size === 1) {
  //     return true;
  //   } else return false;
  // }

  // // Check if given cards represent a straight
  // isStraight(cards) {
  //   // Add indices of values of all cards to array 'indices'
  //   var indices = [];
  //   for (var i = 0; i < cards.length; i++) {
  //     indices.push(this.state.values.indexOf(cards[i].substr(0, 1)));
  //   }
  //   // Sort 'indices'
  //   indices.sort(function (a, b) {
  //     return a - b;
  //   });
  //   // Check if it is a wheel straight
  //   var wheel = [0, 1, 2, 3, 12];
  //   if (
  //     indices.length === wheel.length &&
  //     indices.every((value, index) => value === wheel[index])
  //   ) {
  //     return true;
  //   }
  //   // If not a wheel straight determine if it's a regular straight
  //   // In order to be a regular straight value at index + 1 must be 1 greater than value at index
  //   for (var j = 0; j < indices.length - 1; j++) {
  //     if (indices[j] + 1 !== indices[j + 1]) return false;
  //   }
  //   return true;
  // }

  // // Check if given cards represent trips
  // isTrips(cards) {
  //   // Add all the values of the cards to array 'vals'
  //   var vals = [];
  //   for (var k = 0; k < cards.length; k++) {
  //     vals.push(cards[k].substr(0, 1));
  //   }
  //   // Create a set from array 'vals'
  //   var set = new Set(vals);
  //   // Can only be trips if size of set is 3
  //   if (set.size === 3) {
  //     var uniqueVals = Array.from(set);
  //     // If one of the elements occurs 3 times then it is trips
  //     for (var i = 0; i < uniqueVals.length; i++) {
  //       var valCount = 0;
  //       for (var j = 0; j < vals.length; j++) {
  //         if (vals[j] === uniqueVals[i]) valCount++;
  //         if (valCount === 3) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  // // Check if given cards represent two pair
  // isTwoPair(cards) {
  //   // Add all the values of the cards to array 'vals'
  //   var vals = [];
  //   for (var i = 0; i < cards.length; i++) {
  //     vals.push(cards[i].substr(0, 1));
  //   }
  //   // Create a set from array 'vals'
  //   var set = new Set(vals);
  //   // Can only be two pair of size of set is 3
  //   if (set.size === 3) {
  //     // Since we already checked for trips in function that called this function, the only other hand with set of size 3 is two pair
  //     return true;
  //   }
  //   return false;
  // }

  // // Check if given cards represent a pair
  // isPair(cards) {
  //   // Add all the values of the cards to array 'vals'
  //   var vals = [];
  //   for (var i = 0; i < cards.length; i++) {
  //     vals.push(cards[i].substr(0, 1));
  //   }
  //   // Create a set from array 'vals'
  //   var set = new Set(vals);
  //   // Can only be a pair of size of set is 4
  //   if (set.size === 4) {
  //     return true;
  //   }
  //   return false;
  // }

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
