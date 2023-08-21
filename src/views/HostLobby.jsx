import React, { useEffect, useState } from "react";
import { updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { styles } from "../styles/styles";

/**
 * Displays the host's game lobby and manages game start or termination.
 */
const HostLobby = ({ gameid, username, setView, resetGameState, documentRef, saveInSessionStorage }) => {

    const [players, setPlayers] = useState([]);

    /**
     * Subscribes to player changes in the hosted game.
     */
    useEffect(() => {
        saveInSessionStorage(gameid, username, documentRef);

        if(!documentRef) return;

        const unsubscribe = onSnapshot(documentRef, snapshot => {
            if(!snapshot.data()) {
                console.log("Document does not exist!");
                return;
            }

            setPlayers(snapshot.data().players);
        });

        return () => unsubscribe();
    }, [documentRef]);

    /**
     * Deletes the game and resets to the landing page.
     */
    const handleLeaveGame = async () => {
        resetGameState();
        await deleteDoc(documentRef);
    };

    /**
     * Initiates the game by updating its state.
     */
    const handleStartGame = async () => {
        try {   
            await updateDoc(documentRef, { state: "WAITING" });
            setView("GAME_LOBBY");
            console.log("Game state changed. State: Waiting");
        } catch(err) {
            console.log("Error: " + err.message);
        }
    };

    if(true) {
        return(
            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col justify-start pt-32 items-center h-screen w-full bg-gray-500" 
                style={{ backgroundImage: `url('${require("../img/lake.png")}')` }}
            >

                {/* Header */}
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-2xl pr-7">MEYER</h1>
                    <h1 className="text-2xl pl-7">ONLINE</h1>
                </div>

                {/*
                    Liste med alle spillere som joiner
                    GAMEID
                    Leave og start game knapp
                */}

                {/* Box */}
                <div className={`mt-[500px] w-full h-[400px] bg-[#2B2F54] rounded-t-3xl flex flex-col justify-start items-center z-1`}>
                    <div className={`bg-[${styles.bgcolor}] shadow-xl w-[350px] h-[170px] rounded-xl translate-y-[-100px] flex flex-col justify-center items-center`}>
                        <p className={`mb-4 text-[#2D0600] text-xl`}>Game ID: {gameid}</p>
                        <div className="flex w-full items-center justify-center">
                            <button
                                className="m-2 w-[120px] h-[45px] bg-[#A999FE] rounded-xl text-white text-xl"
                                onClick={handleLeaveGame}
                            >
                                Leave
                            </button>
                            <button
                                className="m-2 w-[120px] h-[45px] bg-[#A999FE] rounded-xl text-white text-xl"
                                onClick={handleStartGame}
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        );
    } else {
        return(
            <>
                <div className="flex flex-col justify-center items-center h-screen">                
                    <div className="m-2 p-1 bg-gray-200">
                        <h1 className="text-xl font-bold">Players</h1>
                        {
                            !players ? "" :
                            players.map(player => (
                                <p key={player.username}>{player.username}</p>
                            ))
                        }
                    </div>
                    <h1>HostLobby</h1>
                    <h2>username: {username}</h2>
                    <h2>gameid: {gameid}</h2>
                    <div className='flex m-1'>
                        <button
                            className='p-1 bg-gray-200 m-1'
                            onClick={handleLeaveGame}
                        >
                            Leave
                        </button>
                        <button
                            className="p-1 bg-gray-200 m-1"
                            onClick={handleStartGame}
                        >
                            Start Game
                        </button>
                    </div>
                </div>
            </>
        );
    }
};

export default HostLobby;