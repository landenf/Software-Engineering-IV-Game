import React, { useState } from "react";
import "../../../Styles/Gameplay/Player/Hand.css"
import EmptyResourceCard from "./EmptyResourceCard";
import { TradeParams } from "../../../Enums/tradebody";

/**
 * An interface that provides strong typing to an empty hand prop.
 */
interface EmptyHandProps {

  /**
   * The current trade parameters.
   */
  tradeParameters: TradeParams

  /**
   * Function used to update the trade parameters.
   */
  setTradeParams: (newParams: TradeParams) => void;

  /**
   * The type of resource being traded, whether its offered or
   * being received.
   */
  tradeType: string;

  /**
   * Function to set the trading options to empty, partially empty,
   * or completed.
   * @param newState 0 to be empty, 1 to be partially filled, 2 to be complete
   */
  setTradeEmpty: (newState: number) => void;

  /**
   * Number representing the amount of fields filled out on the trading modal.
   * If both the received and gain are filled out, then this allows the trade
   * to occur.
   */
  tradeEmpty: number;
}

/**
 * Component that displays a row of resource cards that are clickable in the trade modal.
 */
const EmptyHand: React.FC<EmptyHandProps> = ({ tradeParameters, setTradeParams, tradeType, setTradeEmpty, tradeEmpty }) => {

  /**
   * the set of resources this player holds
   */
  let resources = [
    { name: "sheep" },
    { name: "wheat" },
    { name: "wood" },
    { name: "brick" },
    { name: "stone" },
  ];

  const [cardIsSelected, setCardIsSelected] = useState(false)

  /**
   * Lets the parent element know that a card has been selected so that
   * multiple cards aren't selected from the same row of resources.
   * @param newState number representing the amount of fields filled out in
   * the modal
   */
  const updateCardIsSelected = (newState: boolean) => {
    setCardIsSelected(newState)
    if (cardIsSelected) {
      setTradeEmpty(--tradeEmpty)
    } else {
      setTradeEmpty(++tradeEmpty)
    }
  }

  return (
    <div className="displayCards">
      {resources.map((resource) => {
        return <EmptyResourceCard key={resource.name} type={resource.name} cardIsSelected={cardIsSelected} 
          setCardIsSelected={updateCardIsSelected} setTradeParams={setTradeParams} tradeType={tradeType} 
          tradeParameters={tradeParameters}
        />;
      })}
    </div>
  );
};

export default EmptyHand;
