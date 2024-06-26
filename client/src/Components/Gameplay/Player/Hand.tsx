import React from "react";
import ResourceCard from "./ResourceCard";
import "../../../Styles/Gameplay/Player/Hand.css";
import { LimitedSession } from "@shared/types";

/**
 * An interface that provides strong typing to a game state prop.
 */
interface StateProp {
  /**
   * The current game session's state.
   */
  gamestate: LimitedSession;
}

/**
 * Component that displays the amount of victory points a player has as well as
 * the numbers of all 5 resource cards and the number of development cards currently
 * in a player's hand
 */
const Hand = (props: StateProp) => {
  /**
   *get player resources
   */
  const hand = props.gamestate.client.hand;

  /**
   * the set of resources this player holds
   */
  let resources = [
    { name: "sheep", value: hand["sheep"] },
    { name: "wheat", value: hand["wheat"] },
    { name: "wood", value: hand["wood"] },
    { name: "brick", value: hand["brick"] },
    { name: "stone", value: hand["stone"] },
  ];

  return (
    <div className="personalCards">
      {resources.map((resource) => {
        return (
          <ResourceCard
            key={resource.name}
            type={resource.name}
            value={resource.value}
          />
        );
      })}

      <ResourceCard
        type="developmentcard"
        value={props.gamestate.client.knightCards}
      />
    </div>
  );
};

export default Hand;
