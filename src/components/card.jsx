import React, { Component } from "react";

// Component to represent each individual card
class Card extends Component {
  render() {
    return (
      <React.Fragment>
        <img
          src={this.props.src}
          width="120"
          heigth="120"
          alt={this.props.alt}
        ></img>
      </React.Fragment>
    );
  }
}

export default Card;
