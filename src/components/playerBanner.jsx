import React, { Component } from "react";

class PlayerBanner extends Component {
  state = {
    name: "Type your name here.",
    stackSize: 0,
  };
  render() {
    return (
      <React.Fragment>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={this.state.name}
        ></input>
        <span>{this.state.stackSize}</span>
        <button
          //onClick={() => this.handleIncrement({ id: 1 })}
          //onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-primary btn-sm m-2"
        >
          Call
        </button>
        <button
          //onClick={() => this.props.onDelete(this.props.counter.id)}
          className="btn btn-primary btn-sm m-2"
        >
          Raise
        </button>
        <button className="btn btn-primary btn-sm m-2">Fold</button>
      </React.Fragment>
    );
  }
}

export default PlayerBanner;
