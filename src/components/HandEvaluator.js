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
  const [handRank, score] = evaluateFiveCardHand(cards);
  return [rank[handRank], score, cards];
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
            if (vals[l] === vals[l + 1]) {
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
            if ((vals[l] === vals[l + 1]) === vals[l + 2]) {
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
            if (vals[l] === vals[l + 1]) {
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
      if (vals[j] === vals[j + 1]) score += vals[j] * 1000;
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
      if (vals[j] === vals[j + 1]) score += vals[j] * 1000;
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
  var vals = [];
  for (var i = 0; i < cards.length; i++) {
    vals.push(values.indexOf(cards[i].substr(0, 1)));
  }
  vals.sort(function (a, b) {
    return a - b;
  });
  score +=
    vals[vals.length - 1] * 1000 +
    vals[vals.length - 2] * 500 +
    vals[vals.length - 3] * 250 +
    vals[vals.length - 4] * 100 +
    vals[vals.length - 5] * 50;
  return score;
};

// Method to determine action for bot on river
export const botRiver = (
  botCards,
  flop,
  turn,
  river,
  position,
  stackSize,
  betOutstanding,
  betAmount,
  potSize
) => {
  // Evaluate bot cards
  const [rank, hand, score] = evaluateRiver(botCards, flop, turn);
  var cards = [];
  for (var i = 0; i < 3; i++) cards.push(flop[i].code);
  cards.push(turn[0].code);
  cards.push(river[0].code);
  let nutScore = 0;
  // Find nut hand
  for (var j = 0; j < 5; j++) {
    var tempCards = cards.slice();
    tempCards.splice(j, 1);
    if (getNutHand(tempCards) > nutScore) nutScore = getNutHand(tempCards);
  }

  // Compare bot hand to nut hand
  const ratio = score / nutScore;

  // Return bot decision based on ratio
  return botDecision(
    ratio,
    position,
    betOutstanding,
    stackSize,
    betAmount,
    potSize
  );
};

// Method to determine action for bot on turn
export const botTurn = (
  botCards,
  flop,
  turn,
  position,
  stackSize,
  betOutstanding,
  betAmount,
  potSize
) => {
  // Evaluate bot cards
  const [rank, hand, score] = evaluateTurn(botCards, flop, turn);
  var cards = [];
  for (var i = 0; i < 3; i++) cards.push(flop[i].code);
  cards.push(turn[0].code);
  let nutScore = 0;
  // Find nut hand
  for (var j = 0; j < 4; j++) {
    var tempCards = cards.slice();
    tempCards.splice(j, 1);
    if (getNutHand(tempCards) > nutScore) nutScore = getNutHand(tempCards);
  }

  // Compare bot hand to nut hand
  const ratio = score / nutScore;

  // Return bot decision based on ratio
  return botDecision(
    ratio,
    position,
    betOutstanding,
    stackSize,
    betAmount,
    potSize
  );
};

// Method to determine action for bot on flop
export const botFlop = (
  botCards,
  flop,
  position,
  stackSize,
  betOutstanding,
  betAmount,
  potSize
) => {
  // Evaluate bot cards
  const [rank, score, hand] = evaluateFlop(botCards, flop);
  var cards = [];
  for (var i = 0; i < 3; i++) cards.push(flop[i].code);
  // Get nut hand
  const nutScore = getNutHand(cards);
  // Compare bot hand to nut hand
  const ratio = score / nutScore;

  // Return bot decision based on ratio
  return botDecision(
    ratio,
    position,
    betOutstanding,
    stackSize,
    betAmount,
    potSize
  );
};

// Method to determine action for bot preflop
export const botPre = (
  cards,
  position,
  stackSize,
  betOutstanding,
  betAmount,
  potSize
) => {
  // Calculate strength of hand using Chen formula
  var chenValues = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10];
  var score = 0;
  if (cards[0].substr(0, 1) === cards[1].substr(0, 1)) {
    score = Math.min(5, 2 * chenValues[values.indexOf(cards[0].substr(0, 1))]);
  } else {
    score += Math.max(
      chenValues[values.indexOf(cards[0].substr(0, 1))],
      chenValues[values.indexOf(cards[1].substr(0, 1))]
    );
    if (cards[0].substr(1, 2) === cards[1].substr(1, 2)) score += 2;
    let gap = Math.abs(
      values.indexOf(cards[0].substr(0, 1)) -
        values.indexOf(cards[1].substr(0, 1))
    );
    if (gap === 2) score -= 1;
    else if (gap === 3) score -= 2;
    else if (gap === 4) score -= 4;
    else if (gap >= 5) score -= 5;

    if (
      Math.max(
        chenValues[values.indexOf(cards[0].substr(0, 1))],
        chenValues[values.indexOf(cards[1].substr(0, 1))]
      ) < 7
    ) {
      if (gap <= 2) score += 1;
    }
  }
  // Normalize score by dividing by max amount (pocket aces = 20)
  score = Math.max(0, Math.ceil(score) / 20);

  // Return bot decision based on chen formula score
  return botDecision(
    score,
    position,
    betOutstanding,
    stackSize,
    betAmount,
    potSize
  );
};

// Method to determine bot decision given various variables and factors
export const botDecision = (
  score,
  position,
  betOutstanding,
  stackSize,
  betAmount,
  potSize
) => {
  // 'decision' will hold bot action
  // 'raiseAmount' will hold raise amount if bot decides to raise
  let decision = "";
  let raiseAmount = 0;
  // If no betOutstanding
  if (betOutstanding === 0) {
    // Generate random number to determine whether to raise based on score, lower the score the lower the likelihood of raising
    if (Math.random() < score) {
      decision = "r";
      if (betAmount !== 0) raiseAmount = Math.min(stackSize, betAmount * 2.5);
      else raiseAmount = Math.min(stackSize, potSize * 0.5);
    }
    // Otherwise just check
    else {
      decision = "k";
    }
  }
  // If there is a bet
  else {
    // If bot is in position
    if (position === 0) {
      // Break up decision based on different thresholds for score, and generate random numbers using different weighted probabilities based on those scores to determine whether to fold, call, or raise *CURRENTLY ONLY RAISES BY A CONSTANT AMOUNT*
      if (score < 0.15) {
        if (Math.random() < 0.6) decision = "f";
        else if (Math.random() < 0.5) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      } else if (score < 0.35) {
        if (Math.random() < 0.1) decision = "f";
        else if (Math.random() < 0.4) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      } else if (score < 0.5) {
        if (Math.random() < 0.3) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      } else {
        if (Math.random() < 0.5) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      }
    }
    // If bot in BB
    else {
      if (score < 0.15) {
        if (Math.random() < 0.7) decision = "f";
        else if (Math.random() < 0.5) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      } else if (score < 0.35) {
        if (Math.random() < 0.2) decision = "f";
        else if (Math.random() < 0.4) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      } else if (score < 0.5) {
        if (Math.random() < 0.4) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      } else {
        if (Math.random() < 0.5) decision = "c";
        else {
          decision = "r";
          if (betAmount !== 0)
            raiseAmount = Math.min(stackSize, betAmount * 2.5);
          else raiseAmount = Math.min(stackSize, potSize * 0.5);
        }
      }
    }
  }
  return [decision, raiseAmount];
};

// Method to get nut hand at any juncture
export const getNutHand = (cards) => {
  var score = 0;
  var vals = [];
  for (var i = 0; i < 4; i++) {
    vals.push(values.indexOf(cards[0].substr(0, 1)));
  }

  const [straightPotential, straightScore] = hasStraightPotential(cards);

  // Check for various possible hands, score each one, and return the highest score = nut hand
  if (hasFlushPotential(cards)) {
    if (straightPotential) {
      if (straightScore === 50) {
        // Royal flush
        score += rank.indexOf("Royal Flush") * 1000000 + straightScore;
      } else {
        // Straight flush
        score += rank.indexOf("Straight Flush") * 1000000 + straightScore;
      }
    } else {
      // Flush
      score += rank.indexOf("Flush") * 1000000;
      for (var i = 0; i < cards.length; i++) {
        score += values.indexOf(cards[i].substr(0, 1));
      }
      vals.sort(function (a, b) {
        return a - b;
      });
      var newValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      newValues = newValues.filter((el) => !vals.includes(el));
      score +=
        newValues[newValues.length - 1] + newValues[newValues.length - 2];
    }
  } else if (straightPotential) {
    // Straight
    score += rank.indexOf("Straight") * 1000000 + (straightScore + 10) / 5;
  } else if (isThreeOfTheSame(cards)) {
    // Four of a kind
    score +=
      rank.indexOf("Four of a kind") * 1000000 +
      values.indexOf(cards[0].substr(0, 1)) * 1000;
    if (cards[0].substr(0, 1) !== 12) {
      score += 12 * 20 + vals[0] * 24;
    } else {
      score += 526;
    }
  } else if (hasPair(cards)) {
    // Four of a kind
    score += rank.indexOf("Four of a kind") * 1000000;
    var vals = [];
    const fourOfAKind = 0;
    for (var i = 0; i < vals.length - 1; i++) {
      if (vals[i] === vals[i + 1]) score += vals[i] * 1000;
      fourOfAKind = vals[i];
    }
    vals.push(fourOfAKind);
    vals.push(fourOfAKind);
    vals.sort(function (a, b) {
      return a - b;
    });
    score +=
      vals[vals.length - 1] * 20 +
      vals[vals.length - 2] * 10 +
      vals[vals.length - 3] * 7 +
      vals[vals.length - 4] * 5 +
      vals[vals.length - 5] * 2;
  } else {
    vals.sort(function (a, b) {
      return a - b;
    });
    // Three of a kind
    score += rank.indexOf("Three of a kind") * 1000000;
    vals.push(vals[vals.length - 1]);
    vals.push(vals[vals.length - 1]);
    score +=
      vals[vals.length - 1] * 20 +
      vals[vals.length - 2] * 10 +
      vals[vals.length - 3] * 7 +
      vals[vals.length - 4] * 5 +
      vals[vals.length - 5] * 2;
  }

  return score;
};

// Method to determine if all 3 cards are the same
export const isThreeOfTheSame = (cards) => {
  for (var i = 0; i < 2; i++) {
    if (cards[i].substr(0, 1) !== cards[i + 1].substr(0, 1)) return false;
  }
  return true;
};

// Method to determine if there is a pair among the three cards
export const hasPair = (cards) => {
  for (var i = 0; i < 2; i++) {
    if (cards[i].substr(0, 1) === cards[i + 1].substr(0, 1)) return true;
  }
  return false;
};

// Method to determine if all three cards have same suit
export const hasFlushPotential = (cards) => {
  for (var i = 0; i < 2; i++) {
    if (cards[i].substr(1, 2) !== cards[i + 1].substr(1, 2)) return false;
  }
  return true;
};

// Method to determine if it is possible to have a straight with the given three cards
export const hasStraightPotential = (cards) => {
  var indices = [];
  for (var i = 0; i < cards.length; i++) {
    indices.push(values.indexOf(cards[i].substr(0, 1)));
  }
  indices.sort();
  if (indices[2] === 12 && indices[0] < 4 && indices[1] < 4) return [true, 18];
  else {
    var gap = 0;
    for (var i = 0; i < indices.length - 1; i++) {
      gap += indices[i + 1] - indices[i];
    }
    if (gap === 4)
      return [
        true,
        indices[2] +
          (indices[2] - 1) +
          indices[1] +
          (indices[1] - 1) +
          indices[0],
      ];
    else if (gap === 3) {
      var highCard = Math.min(indices[2] + 1, 12);
      var score = 5 * highCard - 10;
      return [true, score];
    } else if (gap === 3) {
      var highCard = Math.min(indices[2] + 2, 12);
      var score = 5 * highCard - 10;
      return [true, score];
    }
  }
  return [false, -1];
};
