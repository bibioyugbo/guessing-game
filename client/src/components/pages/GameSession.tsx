
interface GameSessionProps{
    isGameMaster?:boolean
}

export default function GameSession({isGameMaster}:GameSessionProps){


    return(
        <>
            <div className={"bg-amber-100 flex p-5 justify-center items-end h-screen"}>
                {
                    isGameMaster?
                        <div className={"flex  h-full gap-4 flex-col"}>
                            <div className={"bg-amber-700 rounded-md text-white border-2 text-center p-5 w-auto"}>Hi GameMaster!</div>
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
                        <div className={"flex gap-60 flex-col"}>
                            <div className={"bg-amber-700  rounded-t-3xl rounded-br-3xl w-[700px] p-8 rounded-md"}>
                                My question
                            </div>
                            <label></label>
                            <input type={"text"} className={"bg-amber-400 rounded-t-3xl rounded-bl-3xl w-[700px] p-8 rounded-md"} placeholder={"Enter your guess"}/>
                        </div>

                }
            </div>
        </>
    )
}