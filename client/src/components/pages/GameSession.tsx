import {useEffect, useState} from "react";
import {type gameMasterType, socket} from "./GameLanding";
import {useLocation} from "react-router-dom";


type gameDataType ={
    players: [],
    isGameMaster:boolean,
    gameMaster: gameMasterType
}
const gameDataTypeInit:gameDataType={
    players: [],
    isGameMaster:false,
    gameMaster: {name:"", playerId: ""}
}


export default function GameSession(){

    socket.on('connect_error', (error) => {
        console.log('Connection error:', error);
    });

    const location = useLocation()


    const [gameData, setGameData] = useState<gameDataType>(location.state.gameData);



    // const socket = useMemo(()=>io('http://localhost:8002'),[]);
    // // Use socket connection
    // const socket = useSocket();


    // const form = document.getElementById("form")
    // const input = document.getElementById("input") as HTMLInputElement
    // const realPlayers = gameData.players.length-1



    useEffect(() => {

        const form = document.getElementById("form")
        const input = document.getElementById("input") as HTMLInputElement
        const realPlayers = gameData.players.length-1
        const handleSubmit = (e) => {  // Store function in a variable
            e.preventDefault()
            if (gameData?.players && realPlayers < 2) {
                console.log("Players number", realPlayers)
                console.log("Total players number", gameData.players.length-1)
                console.log("gameData", gameData)
                alert(`Wait for ${Math.abs(realPlayers - 2)} more player(s) before starting`)
                return
            }
            if (input?.value) {
                socket.emit('question-set', {message: input.value})
                input.value = ''
            }
        }

        if (form) {
            form.addEventListener('submit', handleSubmit)
        }

        const setQuestion = (data:{ message: string })=>{
            console.log(data)
            const liElement = document.createElement('li')
            liElement.textContent = data.message
            document.getElementById('question')?.appendChild(liElement)
            input.value = ''
        }

        socket.on('question-set', setQuestion)

        const liElement = document.getElementById('questionText')
        console.log("Li element",liElement)
        if (liElement){
            liElement.classList.add("li-element");
            if (!liElement.textContent) {
                liElement.textContent = 'Waiting for the game master to start...';
                console.log("Li element",liElement)

            }
        }

        return () => {
            form?.removeEventListener('submit', handleSubmit)
            socket.off('question-set', setQuestion)

        }
    }, []);


    useEffect(() => {
            const liElement = document.getElementById('questionText')
                console.log("Li element",liElement)
            if (liElement){
                liElement.classList.add("li-element");
                if (!liElement.textContent) {
                    liElement.textContent = 'Waiting for others to join...';
                    console.log("Li element",liElement)

                }
            }

    }, []);


    useEffect(() => {
        const handleGameStateUpdated = (data: gameDataType) => {
            console.log("Game state updated from other players:", data);
            // Since this comes from socket.broadcast.emit(), it won't have isGameMaster
            // So preserve your existing isGameMaster value
            setGameData(prevData => ({
                ...prevData,
                players: data.players || prevData.players,
                gameMaster: data.gameMaster || prevData.gameMaster,
                // Keep your existing isGameMaster status
                isGameMaster: prevData.isGameMaster
            }));
        }

        const handleYourGameState = (data: any) => {
            console.log("Your personalized game state updated:", data);
            // This will have the correct isGameMaster for you
            setGameData(data);
        };

        // Listen for ongoing updates
        socket.on('game-state-updated', handleGameStateUpdated);
        socket.on('your-game-state', handleYourGameState);


        return () => {
            socket.off('game-state-updated', handleGameStateUpdated);
            socket.off('your-game-state', handleYourGameState);

        };
    }, []);

    // useEffect(() => {
    //     socket.once('game-state-updated', (data) => {
    //         console.log("Got initial game state:", data);
    //         setGameData(data)
    //     });
    //     console.log("Real data from joining",location.state.initialGameData)
    //     setGameData(location.state.initialGameData)
    // }, []);
    // useEffect(() => {
    //     console.log("Data from joining",gameData)
    //
    //     const handleGameStateUpdated =(data:gameDataType)=>{
    //         console.log("Data from joining",data)
    //         setGameData(data)
    //     }
    //     socket.on('game-state-updated', handleGameStateUpdated)
    //
    //     return () => {
    //         socket.off("game-state-updated", handleGameStateUpdated);
    //     };
    //
    // }, []);

    // socket.on('question-set', (data)=>{
    //     console.log(data)
    //     const liElement = document.createElement('li')
    //     liElement.textContent = data.message
    //     document.getElementById('question')?.appendChild(liElement)
    //     input.value = ''
    // })

    return(
        <>
            <div className={"bg-amber-100 flex p-5 w-full   items-end h-screen"}>
                {
                    gameData.isGameMaster?
                        <div className={"flex justify-center m-auto h-full gap-4 flex-col"}>
                            <div className={"bg-amber-700 rounded-md text-white border-2 text-center capitalize p-5 w-auto"}>Hi GameMaster {gameData?.gameMaster.name}!</div>
                           <div className={"justify-between h-full flex flex-col"}>
                               <form id={"form"} className={"bg-amber-400 gap-3 p-4 justify-center items-center flex rounded-md"}>
                                   <input id={"input"} type={"text"} className={"bg-white outline-none w-[650px] p-8 rounded-[12px]"} placeholder={"Enter your question"}/>
                                   <button type={"submit"} className={"bg-amber-700 active:scale-105 transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2"}>Set question</button>
                               </form>
                               <input type={"text"} className={"bg-amber-400 outline-none w-full rounded-br-3xl p-8 rounded-md"} placeholder={"Enter the answer to your question"}/>
                           </div>
                            <div className={"flex justify-end"}>
                                <button className={"bg-amber-700 active:scale-105 max-w-[200px] transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>Set answer</button>
                            </div>


                        </div>:
                        <div className={"h-full w-full items-center gap-[15%]  flex"}>
                            <div className={" flex flex-col items-center justify-center bg-amber-700 h-full max-h-20 p-3 text-white  rounded-md"}>
                               <div> Number of players</div>
                                <p>{gameData?.players.length}</p>
                            </div>

                            <div className={"flex h-full justify-between flex-col"}>
                                <ul id={'question'} className={"bg-amber-700  rounded-t-3xl rounded-br-3xl w-[700px] p-8 rounded-md"}>
                                    <li id={'questionText'}></li>
                                </ul>
                                <ul id={'guesses'}>
                                    {/*<li className={"bg-amber-400 outline-none rounded-br-3xl rounded-t-3xl w-[700px] p-8 rounded-md"}>hello</li>*/}
                                </ul>
                                <form>
                                    <label className={"text-gray-600 capitalize flex text-[14px] mr-6 justify-end"}>{location.state?.userName}</label>
                                    <input type={"text"} className={"bg-amber-400 outline-none rounded-t-3xl rounded-bl-3xl w-[700px] p-8 rounded-md"} placeholder={"Enter your guess"}/>
                                    <div className={"flex mt-4 justify-end"}>
                                        <button className={"bg-amber-700 active:scale-105 max-w-[200px] transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>Guess answer</button>
                                    </div>
                                </form>

                            </div>
                        </div>

                }
            </div>
        </>
    )
}