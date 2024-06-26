import React, { useState } from "react";
import "../../../Styles/Gameplay/Menus/TradeModal.css";
import EmptyHand from "./EmptyHand";
import { LimitedSession } from "@shared/types";
import { BackendRequest, TradeRequest } from "../../../Enums/requests";

/**
 * An interface that provides strong typing to a trade modal's enabled prop.
 */
export interface TradeModalProp {

    /**
     * Function to change the modal from being enabled or disabled.
     */
    setTradeModal: (newState: boolean) => void;

    /**
     * Whether or not the modal is enabled.
     */
    tradeModalState: boolean

    /**
     * The current gamestate.
     */
    gamestate: LimitedSession

    /**
     * Function to call the backend through the main websocket.
     */
    callBackend: (type: string, body: BackendRequest) => void;

  }

/**
 * A modal that pops out when trading. 
 */
const TradeModalComponent: React.FC<TradeModalProp> = ({ setTradeModal, tradeModalState, gamestate, callBackend }) => {

    const [trade, setTrade] = useState({offer: "", gain: ""});
    const [tradeEmpty, setTradeEmpty] = useState(0);

    /**
     * Sets the new trade parameters, given the card type.
     */
    const handleButtonClick = () => {
        const body: TradeRequest = {
            resourceOffered: trade.offer,
            resourceGained: trade.gain,
            state: gamestate
        }
        callBackend("tradeBank", body)
    }

    return (
        <div className={"trade-modal " + (tradeModalState ? "" : "disabled")}>
            <div className="header">TRADE</div>
            <div className="description">Please select a resource to trade from your hand:</div>
            <EmptyHand setTradeParams={setTrade} tradeType={"offer"} tradeParameters={trade} setTradeEmpty={setTradeEmpty} tradeEmpty={tradeEmpty}/>
            <div className="description">Please select a resource to receive:</div>
            <EmptyHand setTradeParams={setTrade} tradeType={"gain"} tradeParameters={trade} setTradeEmpty={setTradeEmpty} tradeEmpty={tradeEmpty}/>
            <div className="tradeButtons">
                <button className="cancelTrade" onClick={() => setTradeModal(false)}>Cancel</button>
                <button className={"affirmTrade " + (tradeEmpty != 2 ? "dark" : "")} disabled={tradeEmpty != 2} onClick={() => handleButtonClick()}>Let's Trade!</button>
            </div>
            
        </div>
    )
}

export default TradeModalComponent;