import React, { Component } from "react";
import Card from "./card";

// Component to represent both player and bot hole cards
class HoleCards extends Component {
  render() {
    const { holeCards } = this.props;
    return (
      <div>
        {holeCards.map((e, i) => (
          <Card key={i} src={e.image} />
        ))}
      </div>
    );
  }
}

export default HoleCards;
