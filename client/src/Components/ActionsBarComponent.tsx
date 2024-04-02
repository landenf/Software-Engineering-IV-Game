import React from 'react';
import '../Styles/ActionsBar.css'; 
import { GameState } from '@shared/types';
import { BackendRequest, TradeRequest } from '../Enums/requests';

/**
 * An interface that provides strong typing to a gamestate passed to the action bar.
 */
export interface ActionsBarComponentProps {
  updateState: (newState: GameState) => void;
  state: GameState;
}

/**
 * The sidebar used to trade resources, build settlements, and buy development 
 * cards. Appears on a player's game turn.
 */
const ActionsBarComponent: React.FC<ActionsBarComponentProps> = ({state, updateState }) => {

  /**
 * A null body with the mock gamestate. This'll definitely be removed before
 * heading onto production.
 */
const NullBody: BackendRequest = {
  state: state
}

/**
* A trade body with the mock gamestate. This'll be changed into something
* more useful heading into production. 
*/
const TradeBody: TradeRequest = {
  state: state,
  resourceOffered: "sheep",
  resourceGained: "brick"
}

  /**
   * Function used to call the backend API given a particular action, like
   * building settlements or roads.
   * @param action the type of action, such as buyDevCard
   */
  const handleButtonClick = async (action: string, body: BackendRequest) => {
    // call back end
    const URL = 'http://localhost:5000/' + action;
    const response = await fetch('http://localhost:5000/' + action, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }});

    // retrieve the new game state and update it in the frontend
    let newState = await response.json();
    updateState(newState);
  };

  return (
    <div className="absolute-container">
        <div className="inner-container">
        <h1 className="text-bold">BUILD</h1>
        <div className="line-thick"></div>
          <p className="button indented-text" onClick={() => handleButtonClick('buildRoad', NullBody)}>Road</p>
        <div className="line"></div>
          <p className="button indented-text" onClick={() => handleButtonClick('buildSettlement', NullBody)}>Settlement</p>
        <div className="line"></div>
          <p className="button indented-text" onClick={() => handleButtonClick('buildCity', NullBody)}>City</p>
        <div className="line-thick"></div>
        <h1 className="text-bold">Trade</h1>
        <div className="line-thick"></div>
          <p className="button indented-text" onClick={() => handleButtonClick('tradeWithBank', TradeBody)}>Player One</p>
        <div className="line"></div>
          <p className="button indented-text" onClick={() => handleButtonClick('tradeWithBank', TradeBody)}>Player Two</p>
        <div className="line"></div>
          <p className="button indented-text" onClick={() => handleButtonClick('tradeWithBank', TradeBody)}>Player Three</p>
        <div className="line-thick"></div>
        <h1 className="button text-bold" onClick={() => handleButtonClick('buyDevCard', NullBody)}>DEVELOPMENT CARD</h1>
        <div className="line-thick"></div>
        <h1 className="button text-bold" onClick={() => handleButtonClick('passTurn', NullBody)}>PASS TURN</h1>
        <div className="line-thick"></div>
        </div>
    </div>
  );
}

export default ActionsBarComponent;
