import React, { Component } from "react";

// Component to represent player and bot action banner (check, call, raise, fold)
class PlayerBanner extends Component {
  state = {
    name: "Type your name here",
    stackSize: 0,
  };
  render() {
    return (
      <React.Fragment>
        {this.props.children}
        <input type="text" placeholder={this.props.player.name}></input>
        <span>{this.props.player.stackSize}</span>
        <br></br>
        <p id="position">{this.props.player.position === 0 ? "D" : "BB"}</p>
        <div>
          <span>
            {this.props.player.id === 1 ? (
              <button
                onClick={() => this.props.onCheck()}
                className="btn btn-primary btn-sm m-2"
                disabled={!this.props.player.turn}
              >
                Check
              </button>
            ) : null}
          </span>
          <span>
            {this.props.player.id === 1 ? (
              <button
                onClick={() => this.props.onCall()}
                className="btn btn-primary btn-sm m-2"
                disabled={!this.props.player.turn}
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
                disabled={!this.props.player.turn}
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
                disabled={!this.props.player.turn}
              >
                Fold
              </button>
            ) : null}
          </span>
          <p id="betAmount">
            {this.props.player.betAmount === 0
              ? null
              : this.props.player.betAmount}
          </p>
        </div>
      </React.Fragment>
    );
  }

  // getButtonClasses() {
  //   let classes = "btn btn-";
  //   classes += this.props.player.turn
  //     ? "danger btn-sm m-2"
  //     : "primary btn-sm m-2";
  //   return classes;
  // }
}

export default PlayerBanner;
