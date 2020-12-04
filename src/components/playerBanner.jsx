import React, { Component } from "react";

class PlayerBanner extends Component {
  state = {
    name: "Type your name here",
    stackSize: 0,
  };
  render() {
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
        <span>
          {this.props.player.id === 1 ? (
            <button
              onClick={() => this.props.onCall()}
              className="btn btn-primary btn-sm m-2"
            >
              Call
            </button>
          ) : null}
        </span>
        <span>
          {this.props.player.id === 1 ? (
            <button
              onClick={() => this.props.onRaise()}
              className="btn btn-primary btn-sm m-2"
            >
              Raise
            </button>
          ) : null}
        </span>
        <span>
          {this.props.player.viewText ? (
            <input
              id="raise"
              placeholder="Enter raise amount"
              onKeyPress={(event) => {
                if (event.key === "Enter")
                  this.props.onRaised(document.getElementById("raise").value);
              }}
            ></input>
          ) : null}
        </span>
        <span>
          {this.props.player.id === 1 ? (
            <button
              onClick={() => this.props.onFold()}
              className="btn btn-primary btn-sm m-2"
            >
              Fold
            </button>
          ) : null}
        </span>
      </React.Fragment>
    );
  }
}

export default PlayerBanner;
