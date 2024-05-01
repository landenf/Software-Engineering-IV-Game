import React, { useState } from "react";
import GameSession from "./Pages/GameSession";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MockGameState } from "./StaticData/GameStateStatic";
import AuthenticationPage from "./Pages/Authentication";
import LandingPage from "./Pages/LandingPage";

const backend = new WebSocket("ws://localhost:5000")

function App() {
  return (
    <Router>
      <Routes>
        {/* This will be our home page - unathenticated users*/}
        <Route path="/" element={<AuthenticationPage/>} />
        {/* This will be for routing to the landing page, where users will join or create games */}
        <Route path="/home" element={<LandingPage backend={backend} />}></Route>
        {/* This will be for routing to game session - users in game*/}
        <Route path="/session" element={<GameSession gamestate={MockGameState} backend={backend} />} />
      </Routes>
    </Router>
  );
}

export default App;
