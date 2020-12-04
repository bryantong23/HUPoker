import React, { Component } from "react";
import PlayerBanner from "./playerBanner";

class Players extends Component {
  render() {
    const { onCall, onRaise, onFold, players } = this.props;
    return (
      <div>
        {players.map((player) => (
          <PlayerBanner
            key={player.id}
            player={player}
            onCall={onCall}
            onRaise={onRaise}
            onFold={onFold}
          ></PlayerBanner>
        ))}
      </div>
    );
  }
}

export default Players;
