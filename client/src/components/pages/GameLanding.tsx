import GameLayout from "@/GameLayout.tsx";
import {useState} from "react";
import io from 'socket.io-client';
import GameSession from "@/components/pages/GameSession.tsx";

// Create socket connection
const socket = io('http://localhost:8001');

export default function GameLanding(){
    const [playerName, setPlayerName] = useState('');
    const [gameInSession, setGameInSession] = useState('');



    const handleStartGame = () => {
        if (playerName.trim()) {
            socket.emit('join-game', {playerName});
        }
        socket.on('player-joined', (data)=>{
            setGameInSession(data.gameActive)
            console.log(data)
        })
    };

    const handleJoinGame = () => {
        if (playerName.trim()) {
            socket.emit('join-game', {playerName});
        }
        socket.on('player-joined', (data)=>{
            setGameInSession(data.gameActive)
            console.log(data.gameActive)
        })
    };



    return(
        <>
            {gameInSession?
                <GameSession />
                :
                <GameLayout >
                    <div className={"rounded-md w-full p-8 flex justify-center items-center gap-4 flex-col"}>
                        <div className={"bg-amber-100 p-8 flex  w-full justify-center items-center   rounded-md"}>
                            <input value={playerName} type={"text"} onChange={event => setPlayerName(event.target.value)} className={"bg-amber-400 p-8 text-center text-xl rounded-md"} placeholder={"Enter your name"}/>
                        </div>
                        {gameInSession?
                            <button onClick={()=>(handleJoinGame())} className={"bg-amber-400 p-2 active:scale-105 transition-transform rounded-md border-2"}>Join game</button>: <button onClick={()=>handleStartGame()} className={"bg-amber-400 p-2 active:scale-105 transition-transform rounded-md border-2"}>Click to start</button>
                        }
                    </div>
                </GameLayout>
            }


        </>
    )
}