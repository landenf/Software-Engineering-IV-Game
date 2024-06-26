import GameBoard from "../Components/Gameplay/Gameboard/GameBoard";
import PlayerBarComponent from "../Components/Gameplay/Player/PlayerBarComponent";
import ActionsBarComponent from "../Components/Gameplay/Menus/ActionsBarComponent";
import InitialPlacementMenuComponent from "../Components/Gameplay/Menus/InitialPlacementMenuComponent";
import Hand from "../Components/Gameplay/Player/Hand"
import VictoryPointsComponent from "../Components/Gameplay/Player/victoryPointsComponent";
import React, { useEffect, useState } from "react";
import { tiles } from "../StaticData/GameBoardStatic";
import "../Styles/Gameplay/GameSession.css";
import { LimitedPlayer, LimitedSession, Player } from "@shared/types";
import RollButton from "../Components/Gameplay/Gameboard/RollButton";
import TradeModal from "../Components/Gameplay/Menus/TradeModal";
import StealModal from "../Components/Gameplay/Menus/StealModal";
import Dice from "../Components/Gameplay/Gameboard/Dice";
import { BackendRequest } from "../Enums/requests";
import EndGameModal from "../Components/Gameplay/Menus/EndGameModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

/**
 * An interface that provides strong typing to a game session's game state prop.
 */
export interface StateProp {
  /**
   * The current game session's state.
   */
  state: LimitedSession

  /**
   * The websocket used with this particular game session.
   */
  backend: WebSocket

  /**
   * A function used to update the gamestate.
   */
  setState: (newState: LimitedSession) => void;
}

/**
 * An interface that provides strong typing to a list of booleans
 * that determine which set of potentials is showing (either roads
 * or settlements).
 */
export interface GameBoardActionsDisplay {

  /**
   * When set to true, potential roads will appear on the gameboard.
   */
  roads: boolean,

  /**
   * When set to true, potential settlements wlil appear on the gameboard.
   */
  settlements: boolean
}

/**
 * The major component of the Catan game. Holds all necessary components needed to play a full 
 * game of Catan.
 */
const GameSession: React.FC<StateProp> = ({state, backend, setState}) => {
  const [tradeModalEnabled, setTradeModal] = useState(false);
  const [stealModalEnabled, setStealModal] = useState(false);
  const [endGameModalEnabled, setEndGameModal] = useState(false);
  const [showPotenialBuildOptions, setshowPotenialBuildOptions] = useState<GameBoardActionsDisplay>({roads: false, settlements: false})
  const [rolled, setRolled] = useState(false);
  const [boughtDev, setBoughtDev] = useState(false);
  const [isCurrentPlayer, setCurrentPlayer] = useState(state.client.color === state.current_player.color);
  const [selectedRoad, setSelectedRoad] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    if (user == null) {
      navigate('/');
    }
  }, []);

  /**
   * Function used to update whether or not potential roads / settlements are
   * being rendered on the frontend.
   * @param selected the type of potential structure to display
   */
  const updatePotentialSettlements = (selected: string) => {
    if (selected == 'settlements') {
      setshowPotenialBuildOptions(prevState => ({
        roads: false,  
        settlements: !prevState.settlements  // Toggle settlements
      }));
    } else if (selected == 'roads') {
      setshowPotenialBuildOptions(prevState => ({
        roads: !prevState.roads,  // Toggle roads
        settlements: false  
      }));
    }
  };

  const updateBoughtDev = (newState: boolean) => {
    setBoughtDev(newState);
  }

  const websocket = backend

  /**
   * Resets the action bar and roll button.
   */
  const resetTurn = () => {
    setRolled(false);
    setBoughtDev(false);
    setSelectedRoad(false);
    setSelectedSettlement(false);
  }

  /**
   * Used to update the rendering of the client's screen when we
   * receive the gamestate from the backend.
   */
  websocket.addEventListener("message", (msg) => {
    const newState: LimitedSession = JSON.parse(msg.data)
    setState(newState)
    
    if (newState.client.hasKnight) {
      setStealModal(true);
    }
    
    if(newState.winner){
      setEndGameModal(true);
    }

    setCurrentPlayer(newState.client.color === newState.current_player.color);
  
    setshowPotenialBuildOptions({
      roads: false,  
      settlements: false
    })
    
  });


  /**
   * Uses the websocket to send information to the backend and 
   * retrieve the current game session.
   * @param type the "endpoint" to hit (/roll or /buyDevCard for example) 
   * @param body any payload information to send to the backend
   */
  const callBackend = (type: string, body: BackendRequest) => {
    const message = {
      endpoint: type,
      body: body
    }

    backend.send(JSON.stringify(message))

    if (type === "buyDevCard") {
      updateBoughtDev(true);
    }

    if (type === "initialRoadPlacement"){
      setSelectedRoad(true);
    }

    if (type === "initialSettlementPlacement"){
      setSelectedSettlement(true);
    }

    if (type === "passTurn") {
      resetTurn();
    }
  }

  /**
   * Chooses only players that are not the client to render
   * on the side component.
   */
  const players_to_render: LimitedPlayer[] = []
  state.players.forEach(player => {
    if (player.color != state.client.color) {
      players_to_render.push(player)
    }
  });

  return (
  <div>
    <TradeModal setTradeModal={setTradeModal} tradeModalState={tradeModalEnabled} gamestate={state} callBackend={callBackend}/>
    <StealModal setStealModal={setStealModal} stealModalState={stealModalEnabled} gamestate={state} callBackend={callBackend}/>
    { endGameModalEnabled && <EndGameModal setEndGameModal={setEndGameModal} endGameModalState={endGameModalEnabled} gamestate={state}/>}
      <div className="background-container">
        <div className={"game-container " + (tradeModalEnabled || stealModalEnabled ? "in-background" : "")}>
            <div className="PlayerbarComponent"><PlayerBarComponent players={players_to_render}/></div>
            <div className="center-column">
                <div className="game-board">
                  <Dice numberRolled={state.diceNumber}/>
                      <GameBoard 
                          tiles={tiles}
                          gamestate={ state }
                          showPotenialBuildOptions={showPotenialBuildOptions}  
                          callBackend={callBackend}
                          selectedRoad={selectedRoad}
                        />
                </div>
                <div className="user-info">
                  <VictoryPointsComponent vp={state.client.vp} color={state.client.color}/>
                  <Hand gamestate={state} />
                  <RollButton callBackend={callBackend} state={state} rolled={rolled || tradeModalEnabled || stealModalEnabled} 
                  setRolled={setRolled} isCurrentPlayer={isCurrentPlayer}/>
                </div>
            </div>
            <div className={"ActionsBarComponent"}>
              <ActionsBarComponent state={state} callBackend={callBackend} setTradeModal={setTradeModal}
              boughtDev={boughtDev} isCurrentPlayer={isCurrentPlayer} updatePotentialSettlements={updatePotentialSettlements}
              inBackground={tradeModalEnabled || stealModalEnabled} rollButtonState={rolled}/>
              
              <InitialPlacementMenuComponent state={state} callBackend={callBackend} isCurrentPlayer={isCurrentPlayer} updatePotentialSettlements={updatePotentialSettlements} selectedRoad={selectedRoad} selectedSettlement={selectedSettlement}/>
            </div>
        </div>
      </div>   
    </div>
  );
};
export default GameSession;
