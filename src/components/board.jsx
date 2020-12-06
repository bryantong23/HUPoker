import React, { Component } from "react";
import Card from "./card";

class Board extends Component {
  render() {
    const { dealFlop, dealTurn, dealRiver, flop, turn, river } = this.props;
    const flopCards = flop.map((e, i) => <Card key={i} src={e.image} />);
    const turnCards = turn.map((e, i) => <Card key={i} src={e.image} />);
    const riverCards = river.map((e, i) => <Card key={i} src={e.image} />);
    return (
      <React.Fragment>
        <span>{dealFlop ? flopCards : null}</span>
        <span>{dealTurn ? turnCards : null}</span>
        <span>{dealRiver ? riverCards : null}</span>
        {/* <span>
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
        </span> */}
      </React.Fragment>
    );
  }
}

export default Board;
