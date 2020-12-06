import React, { Component } from "react";

class Card extends Component {
  //state = {  }
  render() {
    return (
      <React.Fragment>
        <figure className="Card">
          <img src={this.props.src}></img>
        </figure>
      </React.Fragment>
    );
  }
}

export default Card;
