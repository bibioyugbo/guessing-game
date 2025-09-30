import GameLayout from "@/GameLayout.tsx";
import {useState} from "react";
import io from "socket.io-client";
import {useNavigate} from "react-router-dom";
import SOCKET_URL from "../../../apiConfig.ts";


export type playerType={
    guesses: number
    id:string
    name: string
}
// const playerInit:playerType={
//     guesses:0,
//     id:"",
//     name:""
// }
export type gameMasterType = {
    name:string,
    playerId: string
}


// interface gameMasterType{
//     guesses:number,
//     id:string,
//     name:string
// }
//
// export const socket = io("http://localhost:8002", {
//     withCredentials: true,
//     transports: ["websocket"],
// });
export const socket = io(SOCKET_URL);

export default function GameLanding(){

    // socket.on("setCookie", (playerId) => {
    //     document.cookie = `playerId=${playerId}; path=/`;
    // });
    const navigate = useNavigate()

    // const socket = io('http://localhost:8001')

    socket.on('connect_error', (error) => {
        console.log('Connection error:', error);
    });

    // Use socket connection
    // const socket = useSocket();
    const [playerName, setPlayerName] = useState('');






    const handlePlayGame = () => {
        if (playerName.trim()) {
            socket.emit('play-game', {playerName});

            socket.onAny((eventName, ...args) => {
                console.log(`Received event: ${eventName}`, args);
            });

            // socket.once('game-state-updated', (data) => {
            //     console.log("Got game state:", data);
            //     navigate('/game', {state:{userName:playerName,gameData:data}} )
            //
            // });
            socket.once('your-game-state', (data) => {
                console.log("Got game state:", data);
                navigate('/game', {state:{userName:playerName,gameData:data}} )

            });

            // socket.once('game-state-updated', (data) => {
            //     console.log("Got initial game state:", data);
            //     navigate('/game', {
            //         state: {
            //             userName: playerName,
            //             initialGameData: data
            //         }
            //     });
            // });

        }
        // navigate('/game', {state:{userName:playerName}} )
    };











    return(
        <>

                <GameLayout>
                    <div className={"rounded-md w-full p-8 flex justify-center items-center gap-4 flex-col"}>
                        <div className={"bg-amber-100 p-8 flex  w-full justify-center items-center   rounded-md"}>
                            <input value={playerName} type={"text"} onChange={event => setPlayerName(event.target.value)} className={"bg-amber-400 p-8 text-center text-xl rounded-md"} placeholder={"Enter your name"}/>
                        </div>
                        {/*{gameData?.gameActive?*/}
                        {/*    <button onClick={()=>handleJoinGame()}  className={"bg-amber-400 p-2 active:scale-105 transition-transform rounded-md cursor-pointer border-2"}>Join game</button>: <button onClick={()=>handleStartGame()} className={"bg-amber-400 p-2 active:scale-105 cursor-pointer transition-transform rounded-md border-2"}>Click to start</button>*/}
                        {/*}*/}
                        <button onClick={()=>handlePlayGame()}  className={"bg-amber-400 p-2 active:scale-105 transition-transform rounded-md cursor-pointer border-2"}>Play game</button>

                    </div>
                </GameLayout>





        </>
    )
}