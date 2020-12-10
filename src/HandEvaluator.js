var values = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"];

// class Card {
//     constructor (card) {
//         this.value = card.substr(0, 1);
//         this.suit = str.substr(1);
//         this.rank = values.indexOf(this.value);

//     }
// }

class Hand {
     constructor(cards) {
         this.cards = cards;
         this.handDescr = "";
    }

    getHandStrength(cards) {
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
    }

    isRoyalFlush(cards) {
        if (this.isStraightFlush(cards)){
            for (var i = 0; i < cards.length; i++){
                if (cards[i].includes("A")) return true;
            }
        }
        return false;

    }

    isStraightFlush(cards) {
        if (this.isFlush(cards) && this.isStraight(cards)){
            for (var i = 0; i < cards.length - 1; i++){
                if (cards[i].substr(1) !== cards[i + 1].substr(1)) return false;
            }
            return true;
        }
        return false;

    }

    isFourOfAKind(cards) {

    }

    isFullHouse(cards) {

    }

    isFlush(cards) {
        for (var i = 0; i < cards.length - 1; i++){
            if (cards[i].substr(1) !== cards[i + 1].substr(1)) return false;
        }
        return true;
    }

    isStraight(cards) {

    }

    isTrips(cards) {

    }

    isTwoPair(cards) {

    }

    isPair(cards){

    }
}