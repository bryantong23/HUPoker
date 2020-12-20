import { isPair } from "./HandEvaluator";

var values = ["2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K", "A"];

export const determineAction(cards, position, betOutstanding){
    if (position === 0){
        if (isPair(cards)){
        }
    }
    else {

    }
}

isPair = (cards) => {
    if (cards[0].substr(0, 1) === cards[1].substr(0, 1)) return true;
    return false;
}