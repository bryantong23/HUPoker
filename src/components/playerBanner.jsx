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
        <br></br>
        <p id="position">{this.props.player.position === 0 ? "D" : "BB"}</p>
        <div>
          <span>
            {this.props.player.id === 1 ? (
              <button
                onClick={() => this.props.onCheck()}
                className={this.getButtonClasses()}
              >
                Check
              </button>
            ) : null}
          </span>
          <span>
            {this.props.player.id === 1 ? (
              <button
                onClick={() => this.props.onCall()}
                className={this.getButtonClasses()}
              >
                Call
              </button>
            ) : null}
          </span>
          <span>
            {this.props.player.id === 1 ? (
              <button
                onClick={() => this.props.onRaise()}
                className={this.getButtonClasses()}
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
                className={this.getButtonClasses()}
              >
                Fold
              </button>
            ) : null}
          </span>
        </div>
      </React.Fragment>
    );
  }

  getButtonClasses() {
    let classes = "btn btn-";
    classes += this.props.player.turn
      ? "danger btn-sm m-2"
      : "primary btn-sm m-2";
    return classes;
  }
}

export default PlayerBanner;
