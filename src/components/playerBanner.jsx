import React, { Component } from "react";

class PlayerBanner extends Component {
  state = {
    name: "Type your name here",
    stackSize: 0,
  };
  render() {
    console.log("test 1");

    return (
      <React.Fragment>
        {this.props.children}
        <input
          type="text"
          id="name"
          name="name"
          placeholder={this.props.player.name}
        ></input>
        <span>{this.props.player.stackSize}</span>
        <button
          onClick={() => this.props.onCall(this.props.player.id)}
          className="btn btn-primary btn-sm m-2"
        >
          Call
        </button>
        <button
          onClick={() => this.props.onRaise(this.props.player.id)}
          className="btn btn-primary btn-sm m-2"
        >
          Raise
        </button>
        <button
          onClick={() => this.props.onFold(this.props.player.id)}
          className="btn btn-primary btn-sm m-2"
        >
          Fold
        </button>
      </React.Fragment>
    );
  }
}

export default PlayerBanner;
