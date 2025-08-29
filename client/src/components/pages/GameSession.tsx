
interface GameSessionProps{
    isGameMaster?:boolean
}

export default function GameSession({isGameMaster}:GameSessionProps){


    return(
        <>
            <div className={"bg-amber-100 flex p-5 justify-center items-end h-screen"}>
                {
                    isGameMaster?
                        <div className={"flex w-[700px] flex-col"}>
                            <input type={"text"} className={"bg-amber-400  p-8 rounded-md"} placeholder={"Enter your question"}/>
                            <input type={"text"} className={"bg-amber-400 p-8 rounded-md"} placeholder={"Enter the answer to your question"}/>
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