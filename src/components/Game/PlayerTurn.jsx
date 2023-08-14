import { updateDoc, getDoc } from 'firebase/firestore';
import React from 'react'

function PlayerTurn({ documentRef, username, gameid }) {

  const updateDices = async (dice1, dice2) => {
    try {
      const rawData = await getDoc(documentRef);
      const updatedPlayers = rawData.data().players.map(player => {
        if(player.username === username) {
          return { ...player, dice1, dice2 };
        }
        return player;
      });


      await updateDoc(documentRef, { players: updatedPlayers });
    } catch(err) {
      console.log("Error: " + err.message);
    }
  };

  const handleBust = () => {
    // Find previous players dices
    // If they are the same as inputDices bust if false, else true
    // return if the bust was correct or not
    // if bust was correct or false the gameResets
    // The same player plays the next turn.
    // resetGame();
  };

  const handleThrowDices = () => {
    // Play dice annimation
    // Show the dices to only the player that thrown the dices
    // updateDices();
  };

  const handleinputDices = () => {
    // updates the db inputDices
    // Theese dices is shown to the table
    // if theese dices are lower than the dices before, you loose, if not the game continues.
    // If a person looses the game resets all values and nextPerson starts
    // updateNextPlayer();
    // resetGame();
  };

  const updateNextPlayer = async () => {
    // Sets current User to previous
    // sets next player to current
    const rawData = await getDoc(documentRef);
    const players = rawData.data().players;
    const previousPlayerIndex = players.findIndex(player => player.username === username);

    const previousPlayer = players[previousPlayerIndex];
    let currentPlayer;

    if(previousPlayerIndex === -1) {
      alert("player no longer exists");
      return;
    } else if(previousPlayerIndex === (players.length - 1)) {
      currentPlayer = players[0];
    } else {
      currentPlayer = players[(previousPlayerIndex + 1)];
    }

    await updateDoc(documentRef, {
      currentPlayer: currentPlayer,
      previousPlayer: previousPlayer,
    });
  };

  const resetGame = async () => {
    const rawData = await getDoc(documentRef);
    const updatedPlayers = rawData.data().map(player => {
      return {
        ...player,
        dice1: 0,
        dice2: 0,
        inputDice1: 0,
        inputDice2: 0,
      }
    });

    await updateDoc(documentRef, { players: updatedPlayers });
  };

  const alertPlayerBusted = () => {

  };

  // IF THIS PLAYER LEAVES: set the currentPlayer to next player
  return (
    <>
      <div className='flex justify-center items-center'>
        <button
          className='m-2 p-1 bg-gray-200'
          onClick={handleBust}
        >
          Bust
        </button>
        <button
          className='m-2 p-1 bg-gray-200'
          onClick={handleThrowDices}
        >
          Throw dice
        </button>
      </div>
    </>
  )
};

export default PlayerTurn
