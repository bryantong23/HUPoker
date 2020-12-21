var values = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"];
var rank = [
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
];

// Evaluate strength of hole cards
export const evaluateHoleCards = (holeCards) => {
  var card1 = holeCards[0].code;
  var card2 = holeCards[1].code;
  if (card1.substring(0, 1) === card2.substring(0, 1)) return "Pair";
  else {
    return "High card";
  }
};

// Evaluate any given 5 card hand
export const evaluateFiveCardHand = (cards) => {
  if (isRoyalFlush(cards)[0]) return [9, isRoyalFlush(cards)[1]];
  if (isStraightFlush(cards)[0]) return [8, isStraightFlush(cards)[1]];
  if (isFourOfAKind(cards)[0]) return [7, isFourOfAKind(cards)[1]];
  if (isFullHouse(cards)[0]) return [6, isFullHouse(cards)[1]];
  if (isFlush(cards)[0]) return [5, isFlush(cards)[1]];
  if (isStraight(cards)[0]) return [4, isStraight(cards)[1]];
  if (isTrips(cards)[0]) return [3, isTrips(cards)[1]];
  if (isTwoPair(cards)[0]) return [2, isTwoPair(cards)[1]];
  if (isPair(cards)[0]) return [1, isPair(cards)[1]];
  else return [0, highCard(cards)];
};

// Get exact numerical hand strength
export const getHandStrength = (cards) => {};

// Evaluate hand after flop
export const evaluateFlop = (holeCards, flop) => {
  var cards = [];
  for (var i = 0; i < holeCards.length; i++) {
    cards.push(holeCards[i].code);
  }
  for (var j = 0; j < flop.length; j++) {
    cards.push(flop[j].code);
  }
  return [rank[evaluateFiveCardHand(cards)[0]], cards];
};

// Evaluate hand after turn
export const evaluateTurn = (holeCards, flop, turn) => {
  var cards = [];
  for (var i = 0; i < holeCards.length; i++) {
    cards.push(holeCards[i].code);
  }
  for (var j = 0; j < flop.length; j++) {
    cards.push(flop[j].code);
  }
  cards.push(turn[0].code);
  // Loop through possible 5 hand combos and return hand with highest strength
  var highHand = 0;
  var highScore = 0;
  var bestCards = [];
  for (var k = 0; k < 6; k++) {
    var tempCards = cards.slice();
    tempCards.splice(k, 1);
    if (evaluateFiveCardHand(tempCards)[0] > highHand) {
      highHand = evaluateFiveCardHand(tempCards)[0];
      highScore = evaluateFiveCardHand(tempCards)[1];
      bestCards = tempCards;
    } else if (
      evaluateFiveCardHand(tempCards)[0] === highHand &&
      evaluateFiveCardHand(tempCards)[1] > highScore
    ) {
      highScore = evaluateFiveCardHand(tempCards)[1];
      bestCards = tempCards;
    }
  }
  return [rank[highHand], bestCards, highScore];
};

// Evaluate hand after river
export const evaluateRiver = (holeCards, flop, turn, river) => {
  var cards = [];
  for (var i = 0; i < holeCards.length; i++) {
    cards.push(holeCards[i].code);
  }
  for (var j = 0; j < flop.length; j++) {
    cards.push(flop[j].code);
  }
  cards.push(turn[0].code);
  cards.push(river[0].code);
  var highHand = 0;
  var highScore = 0;
  var bestCards = [];
  // Loop through possible 5 hand combos and return hand with highest strength
  for (var k = 0; k < cards.length - 1; k++) {
    for (var l = 1; l < cards.length; l++) {
      var tempCards = cards.slice();
      tempCards.splice(k, 1);
      tempCards.splice(l - 1, 1);
      if (evaluateFiveCardHand(tempCards)[1] > highScore) {
        highHand = evaluateFiveCardHand(tempCards)[0];
        highScore = evaluateFiveCardHand(tempCards)[1];
        bestCards = tempCards;
      } else if (
        evaluateFiveCardHand(tempCards)[0] === highHand &&
        evaluateFiveCardHand(tempCards)[1] > highScore
      ) {
        highScore = evaluateFiveCardHand(tempCards)[1];
        bestCards = tempCards;
      }
    }
  }
  return [rank[highHand], bestCards, highScore];
};

// Check if given cards represent a royal flush
export const isRoyalFlush = (cards) => {
  let score = 0;
  // Must be a straight flush and contain an Ace and 10
  if (isStraightFlush(cards)) {
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].includes("A")) {
        for (var j = 0; j < cards.length; j++) {
          if (cards[j].includes("0")) {
            score +=
              rank.indexOf("Royal Flush") * 1000000 +
              values.indexOf("A") +
              values.indexOf("K") +
              values.indexOf("Q") +
              values.indexOf("J") +
              values.indexOf("0");
            return [true, score];
          }
        }
      }
    }
  }
  return false;
};

// Check if given cards represent a straight flush
export const isStraightFlush = (cards) => {
  let score = 0;
  // Must be a straight and a flush
  if (isFlush(cards) && isStraight(cards)) {
    score += rank.indexOf("Straight Flush") * 1000000;
    for (var i = 0; i < cards.length; i++) {
      score += values.indexOf(cards[i].substr(0, 1));
    }
    return [true, score];
  }
  return false;
};

// Check if given cards represent a four of a kind
export const isFourOfAKind = (cards) => {
  let score = 0;
  // Add all the values of the cards to array 'vals'
  var vals = [];
  for (var i = 0; i < cards.length; i++) {
    vals.push(values.indexOf(cards[i].substr(0, 1)));
  }
  vals.sort(function (a, b) {
    return a - b;
  });
  // Create a set from array 'vals'
  var set = new Set(vals);
  // Can only be four of a kind if size of set is 2
  if (set.size === 2) {
    var uniqueVals = Array.from(set);
    // If one of the elements occurs 4 times then it is four of a kind
    for (var k = 0; k < uniqueVals.length; k++) {
      var valCount = 0;
      for (var j = 0; j < vals.length; j++) {
        if (vals[j] === uniqueVals[k]) valCount++;
        if (valCount === 4) {
          score += rank.indexOf("Four of a kind") * 1000000;
          for (var l = 0; l < vals.length - 1; l++) {
            if (vals[l] == vals[l + 1]) {
              score += vals[l] * 1000;
              break;
            }
          }
          score +=
            vals[vals.length - 1] * 20 +
            vals[vals.length - 2] * 10 +
            vals[vals.length - 3] * 7 +
            vals[vals.length - 4] * 5 +
            vals[vals.length - 5] * 2;
          return [true, score];
        }
      }
    }
  }
  return false;
};

// Check if given cards represent a full house
export const isFullHouse = (cards) => {
  let score = 0;
  // Add all the values of the cards to array 'vals'
  var vals = [];
  for (var i = 0; i < cards.length; i++) {
    vals.push(values.indexOf(cards[i].substr(0, 1)));
  }
  vals.sort(function (a, b) {
    return a - b;
  });
  // Create a set from array 'vals'
  var set = new Set(vals);
  // Can only be full house if size of set is 2
  if (set.size === 2) {
    var uniqueVals = Array.from(set);
    // If one of the elements occurs 3 times then it is full house
    for (var k = 0; k < uniqueVals.length; k++) {
      var valCount = 0;
      for (var j = 0; j < vals.length; j++) {
        if (vals[j] === uniqueVals[k]) valCount++;
        if (valCount === 3) {
          score += rank.indexOf("Full House") * 1000000;
          for (var l = 0; l < vals.length - 2; l++) {
            if ((vals[l] == vals[l + 1]) == vals[l + 2]) {
              score += vals[l] * 1000;
              break;
            }
          }
          score +=
            vals[vals.length - 1] * 20 +
            vals[vals.length - 2] * 10 +
            vals[vals.length - 3] * 7 +
            vals[vals.length - 4] * 5 +
            vals[vals.length - 5] * 2;
          return [true, score];
        }
      }
    }
  }
  return false;
};

// Check if given cards represent a flush
export const isFlush = (cards) => {
  let score = 0;
  // Add all suits of the cards to array 'suits'
  var suits = [];
  for (var i = 0; i < cards.length; i++) {
    suits.push(cards[i].substr(1));
  }
  // Create a set from array 'suits'
  var set = new Set(suits);
  // Can only be flush if size of set is 1
  if (set.size === 1) {
    score += rank.indexOf("Flush") * 1000000;
    for (var j = 0; j < cards.length; j++) {
      score += values.indexOf(cards[j].substr(0, 1));
    }
    return [true, score];
  } else return false;
};

// Check if given cards represent a straight
export const isStraight = (cards) => {
  let score = 0;
  // Add indices of values of all cards to array 'indices'
  var indices = [];
  for (var i = 0; i < cards.length; i++) {
    indices.push(values.indexOf(cards[i].substr(0, 1)));
  }
  // Sort 'indices'
  indices.sort(function (a, b) {
    return a - b;
  });
  // Check if it is a wheel straight
  var wheel = [0, 1, 2, 3, 12];
  if (
    indices.length === wheel.length &&
    indices.every((value, index) => value === wheel[index])
  ) {
    score += rank.indexOf("Straight") * 1000000 + 3;
    return [true, score];
  }
  // If not a wheel straight determine if it's a regular straight
  // In order to be a regular straight value at index + 1 must be 1 greater than value at index
  for (var j = 0; j < indices.length - 1; j++) {
    if (indices[j] + 1 !== indices[j + 1]) return false;
  }
  score += rank.indexOf("Straight") * 1000000 + indices[indices.length - 1];
  return [true, score];
};

// Check if given cards represent trips
export const isTrips = (cards) => {
  let score = 0;
  // Add all the values of the cards to array 'vals'
  var vals = [];
  for (var k = 0; k < cards.length; k++) {
    vals.push(values.indexOf(cards[k].substr(0, 1)));
  }
  vals.sort(function (a, b) {
    return a - b;
  });
  // Create a set from array 'vals'
  var set = new Set(vals);
  // Can only be trips if size of set is 3
  if (set.size === 3) {
    var uniqueVals = Array.from(set);
    // If one of the elements occurs 3 times then it is trips
    for (var i = 0; i < uniqueVals.length; i++) {
      var valCount = 0;
      for (var j = 0; j < vals.length; j++) {
        if (vals[j] === uniqueVals[i]) valCount++;
        if (valCount === 3) {
          score += rank.indexOf("Three of a kind") * 1000000;
          for (var l = 0; l < vals.length - 1; l++) {
            if (vals[l] == vals[l + 1]) {
              score += vals[l] * 1000;
              break;
            }
          }
          score +=
            vals[vals.length - 1] * 20 +
            vals[vals.length - 2] * 10 +
            vals[vals.length - 3] * 7 +
            vals[vals.length - 4] * 5 +
            vals[vals.length - 5] * 2;
          return [true, score];
        }
      }
    }
  }
  return false;
};

// Check if given cards represent two pair
export const isTwoPair = (cards) => {
  let score = 0;
  // Add all the values of the cards to array 'vals'
  var vals = [];
  for (var i = 0; i < cards.length; i++) {
    vals.push(values.indexOf(cards[i].substr(0, 1)));
  }
  vals.sort(function (a, b) {
    return a - b;
  });
  // Create a set from array 'vals'
  var set = new Set(vals);
  // Can only be two pair of size of set is 3
  if (set.size === 3) {
    // Since we already checked for trips in function that called this function, the only other hand with set of size 3 is two pair
    score += rank.indexOf("Two pair") * 1000000;
    for (var j = 0; j < vals.length - 1; j++) {
      if (vals[j] == vals[j + 1]) score += vals[j] * 1000;
    }
    score +=
      vals[vals.length - 1] * 20 +
      vals[vals.length - 2] * 10 +
      vals[vals.length - 3] * 7 +
      vals[vals.length - 4] * 5 +
      vals[vals.length - 5] * 2;
    return [true, score];
  }
  return false;
};

// Check if given cards represent a pair
export const isPair = (cards) => {
  let score = 0;
  // Add all the values of the cards to array 'vals'
  var vals = [];
  for (var i = 0; i < cards.length; i++) {
    vals.push(values.indexOf(cards[i].substr(0, 1)));
  }
  vals.sort(function (a, b) {
    return a - b;
  });
  // Create a set from array 'vals'
  var set = new Set(vals);
  // Can only be a pair of size of set is 4
  if (set.size === 4) {
    score += rank.indexOf("Pair") * 1000000;
    for (var j = 0; j < vals.length - 1; j++) {
      if (vals[j] == vals[j + 1]) score += vals[j] * 1000;
    }
    score +=
      vals[vals.length - 1] * 20 +
      vals[vals.length - 2] * 10 +
      vals[vals.length - 3] * 7 +
      vals[vals.length - 4] * 5 +
      vals[vals.length - 5] * 2;
    return [true, score];
  }
  return false;
};

// Evaluate score for high card
export const highCard = (cards) => {
  let score = 0;
  for (var i = 0; i < cards.length; i++) {
    score += values.indexOf(cards[i].substr(0, 1));
  }
  return score;
};
