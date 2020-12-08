import React, { Component } from "react";

// Component to represent each individual card
class Card extends Component {
  render() {
    return (
      <React.Fragment>
        <img src={this.props.src} width="150" heigth="150"></img>
      </React.Fragment>
    );
  }
}

export default Card;
