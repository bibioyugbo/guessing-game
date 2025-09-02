import type {gameDataType} from "@/components/pages/GameLanding.tsx";

interface GameSessionProps{
    isGameMaster?:boolean
    gameData?:gameDataType
}

export default function GameSession({isGameMaster,gameData}:GameSessionProps){


    return(
        <>
            <div className={"bg-amber-100 flex p-5 w-full   items-end h-screen"}>
                {
                    isGameMaster?
                        <div className={"flex  h-full gap-4 flex-col"}>
                            <div className={"bg-amber-700 rounded-md text-white border-2 text-center capitalize p-5 w-auto"}>Hi GameMaster {gameData?.playerName}!</div>
                           <div className={"justify-between h-full flex flex-col"}>
                               <div className={"bg-amber-400 gap-3 p-4 justify-center items-center flex rounded-md"}>
                                   <input type={"text"} className={"bg-white outline-none w-[650px] p-8 rounded-[12px]"} placeholder={"Enter your question"}/>
                                   <button className={"bg-amber-700 active:scale-105 transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>Set question</button>
                               </div>
                               <input type={"text"} className={"bg-amber-400 outline-none w-full rounded-br-3xl p-8 rounded-md"} placeholder={"Enter the answer to your question"}/>
                           </div>
                            <div className={"flex justify-end"}>
                                <button className={"bg-amber-700 active:scale-105 max-w-[200px] transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>Set answer</button>
                            </div>


                        </div>:
                        <div className={"h-full w-full items-center gap-[15%]  flex"}>
                            <div className={" flex flex-col items-center justify-center bg-amber-700 h-full max-h-20 p-3 text-white  rounded-md"}>
                               <div> Number of players:</div>
                                <p>{gameData?.players.length}</p>
                            </div>

                            <div className={"flex h-full justify-between flex-col"}>
                                <div className={"bg-amber-700  rounded-t-3xl rounded-br-3xl w-[700px] p-8 rounded-md"}>
                                    My question
                                </div>
                                <div>
                                    <label className={"text-gray-600 capitalize flex text-[14px] mr-6 justify-end"}>{gameData?.playerName}</label>
                                    <input type={"text"} className={"bg-amber-400 outline-none rounded-t-3xl rounded-bl-3xl w-[700px] p-8 rounded-md"} placeholder={"Enter your guess"}/>
                                    <div className={"flex mt-4 justify-end"}>
                                        <button className={"bg-amber-700 active:scale-105 max-w-[200px] transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>Guess answer</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                }
            </div>
        </>
    )
}