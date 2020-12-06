import React, { Component } from "react";
import Card from "./card";

class Board extends Component {
  render() {
    const { flop, turn, river } = this.props;
    return (
      <React.Fragment>
        <span>
          {flop.map((e, i) => (
            <Card key={i} src={e.image} />
          ))}
        </span>
        <span>
          {turn.map((e, i) => (
            <Card key={i} src={e.image} />
          ))}
        </span>
        <span>
          {river.map((e, i) => (
            <Card key={i} src={e.image} />
          ))}
        </span>
      </React.Fragment>
    );
  }
}

export default Board;
