import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase-config';
import "../../../Styles/Gameplay/Menus/EndModal.css";
import "../../../Styles/Gameplay/Player/PlayerComponent.css";
import { LimitedSession } from "@shared/types";
import { useNavigate } from 'react-router-dom';

/**
 * Interface providing strong typing to the end game modal props.
 */
interface EndGameModalProps {
    /**
     * Function to change the modal from being enabled or disabled.
     */
    setEndGameModal: (newState: boolean) => void;

    /**
     * Whether or not the modal is enabled.
     */
    endGameModalState: boolean;

    /**
     * The final game state.
     */
    gamestate: LimitedSession;
    
}

/**
 * Component used to display the end game summary and options.
 */
const EndGameModal: React.FC<EndGameModalProps> = ({ endGameModalState, setEndGameModal, gamestate }) => {
    const [user, loading, error] = useAuthState(auth);
    const sortedPlayers = [...gamestate.players].sort((a, b) => b.vp - a.vp);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const updateGameStatistics = async () => {
            if (user) {
                const userProfilesRef = collection(db, "UserProfiles");
                const q = query(userProfilesRef, where("uid", "==", user.uid));

                try {
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) throw new Error('User profile not found.');

                    const userProfileDoc = querySnapshot.docs[0];
                    const userProfileRef = userProfileDoc.ref;
                    const storedData = userProfileDoc.data();
                    const client = gamestate.client;

                    await updateDoc(userProfileRef, {
                        GamesWon: storedData.GamesWon + ((gamestate.winner && gamestate.winner.name === storedData.username) ? 1 : 0),
                        LargestArmy: storedData.LargestArmy + ((gamestate.current_largest_army && gamestate.current_largest_army.name == storedData.username) ? 1 : 0),
                        MostRoads: storedData.MostRoads + ((gamestate.current_longest_road && gamestate.current_longest_road.name == storedData.username) ? 1 : 0), 
                        VictoryPoints: storedData.VictoryPoints + client.vp,
                        TotalWheat: storedData.TotalWheat + client.hand.wheat,
                        TotalStone: storedData.TotalStone + client.hand.stone,
                        TotalWood: storedData.TotalWood + client.hand.wood,
                        TotalBrick: storedData.TotalBrick + client.hand.brick,
                        TotalSheep: storedData.TotalSheep + client.hand.sheep
                    });

                    console.log('Game statistics updated successfully.');
                } catch (error) {
                    console.error('Error updating game statistics:', error);
                }
            }
        };

        if (user) {
            updateGameStatistics();
        }
    }, [user]); 

    /**
     * Function to render a medal icon based on rank 
     */
    const renderMedal = (rank: number) => {
        switch (rank) {
        case 1:
            return <span>🥇</span>; // Gold medal emoji as an example
        case 2:
            return <span>🥈</span>; // Silver medal emoji
        case 3:
            return <span>🥉</span>; // Bronze medal emoji
        default:
            return null; // No medal for ranks below 3
        }
    };

    /**
     * Function to exit the end game modal and potentially the application or game lobby.
     */
    const handleExitGame = () => {
        
        setEndGameModal(false);

        navigate("/home");      
  
        
    }
    return (
        <div className={"end-game-modal " + (endGameModalState ? "" : "disabled")}>
        <div className="header">Game Over</div>
        <div className="description">Results: {gamestate.winner ? gamestate.winner.name : "No Winner (Error)"}</div>
        <div className="content">
            <div className="personal-info">
                <img style={{ height: '15vh', width: '15vh', borderRadius: '90%'}} src={gamestate.client.image} alt="Avatar Image" />
                <p>Total Victory Points: {gamestate.client.vp}</p>
            </div>
            <div className="leaderboard">
                <div className="description">Leaderboard:</div>
                {sortedPlayers.map((player, index) => (
                    <div key={player.id}>
                        <p>{renderMedal(index + 1)} {player.name} - {player.vp} Victory Points</p>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <button className="game-end-buttons" onClick={() => handleExitGame()}>Exit Game</button>
        </div>
    </div>
    );
};

export default EndGameModal;
