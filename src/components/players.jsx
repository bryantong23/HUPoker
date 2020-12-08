import React, { Component } from "react";
import PlayerBanner from "./playerBanner";

// Component to represent collection of player banners (player and bot)
class Players extends Component {
  render() {
    const { onCheck, onCall, onRaise, onFold, onRaised, players } = this.props;
    return (
      <div>
        {players.map((player) => (
          <PlayerBanner
            key={player.id}
            player={player}
            onCheck={onCheck}
            onCall={onCall}
            onRaise={onRaise}
            onRaised={onRaised}
            onFold={onFold}
          ></PlayerBanner>
        ))}
      </div>
    );
  }
}

export default Players;
