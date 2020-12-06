import React, { Component } from "react";

class Card extends Component {
  render() {
    return (
      <React.Fragment>
        <img src={this.props.src}></img>
      </React.Fragment>
    );
  }
}

export default Card;
