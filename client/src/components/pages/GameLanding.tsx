import GameLayout from "@/GameLayout.tsx";
import {useEffect, useState} from "react";
import io from 'socket.io-client';
import GameSession from "@/components/pages/GameSession.tsx";

// Create socket connection
const socket = io('http://localhost:8001');
interface gameDataType{
    gameActive:boolean
    gameMaster:gameMasterType
    isGameMaster: boolean
    playerId: string
    playerName: string
    players:[];
}

interface gameMasterType{
    guesses:number,
    id:string,
    name:string
}

const gameMasterInit:gameMasterType={
    guesses:0,
    id:"",
    name:""
}


const gameDataInit:gameDataType={
    gameActive:false,
    gameMaster: gameMasterInit,
    isGameMaster: false,
    playerId: "",
    playerName: "",
    players:[]
}

export default function GameLanding(){
    const [playerName, setPlayerName] = useState('');
    const [gameInSession, setGameInSession] = useState(false);
    const [gameData, setGameData] = useState<gameDataType>(gameDataInit);




    const handleStartGame = () => {
        if (playerName.trim()) {
            socket.emit('join-game', {playerName});
        }

    };

    const handleJoinGame = () => {
        if (playerName.trim()) {
            socket.emit('join-game', {playerName});
        }
    };

    const isGameMaster = gameData.gameMaster?.id === gameData.playerId

    useEffect(() => {
        if (gameData && Object.keys(gameData).length > 0) {
            // Now you can safely use gameData here
            console.log("Game data updated:", gameData)


            // Call other functions that need gameData
            // updateUI(gameData)
            // processGameState(gameData)
            // etc.
        }
    }, [gameData])


    socket.on('player-joined', (data)=>{
        setGameInSession(true)
        setGameData(data)
    })


    return(
        <>
            {gameInSession?
                <GameSession isGameMaster={isGameMaster}/>
                :
                <GameLayout >
                    <div className={"rounded-md w-full p-8 flex justify-center items-center gap-4 flex-col"}>
                        <div className={"bg-amber-100 p-8 flex  w-full justify-center items-center   rounded-md"}>
                            <input value={playerName} type={"text"} onChange={event => setPlayerName(event.target.value)} className={"bg-amber-400 p-8 text-center text-xl rounded-md"} placeholder={"Enter your name"}/>
                        </div>
                        {gameData.gameActive?
                            <button onClick={()=>(handleJoinGame())} className={"bg-amber-400 p-2 active:scale-105 transition-transform rounded-md cursor-pointer border-2"}>Join game</button>: <button onClick={()=>handleStartGame()} className={"bg-amber-400 p-2 active:scale-105 transition-transform rounded-md border-2"}>Click to start</button>
                        }
                    </div>
                </GameLayout>
            }
        </>
    )
}