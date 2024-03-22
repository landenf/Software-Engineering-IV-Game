import GameBoard from "../Components/GameBoard";
import PlayerBarComponent from "../Components/PlayerBarComponent";
import ActionsBarComponent from "../Components/ActionsBarComponent";
import Hand from "../Components/Hand"
import VictoryPointsComponent from "../Components/victoryPointsComponent";
import React, { Component } from "react";
import { StateProp } from "../Components/types";
import { players } from "../StaticData/PlayerData";
import { tiles } from "../StaticData/GameBoardStatic";
import "../Styles/GameSession.css";

const GameSession = (props: StateProp) => {
  const state = props;
  
  return (
    <div className="background-container">
            <div className="game-container">
                <div className="PlayerbarComponent"><PlayerBarComponent players={players}/></div>
                <div className="center-column">
                    <div className="game-board"><GameBoard tiles={tiles}/></div>
                    <div className="user-info">
                      <VictoryPointsComponent/>
                      <Hand gamestate={props.gamestate} />
                    </div>
                </div>
                <div className="ActionsBarComponent"><ActionsBarComponent/></div>
            </div>
        </div>   
  );
};
export default GameSession;
