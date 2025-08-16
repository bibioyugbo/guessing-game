
interface GameSessionProps{
    isGameMaster:boolean
}

export default function GameSession({isGameMaster}:GameSessionProps){
    return(
        <>
            <div className={"bg-amber-100 flex justify-center items-center h-screen"}>
                {
                    isGameMaster?
                        <div className={"flex flex-col"}>
                            <input type={"text"} className={"bg-amber-400 p-8 rounded-md"} placeholder={"Enter your question"}/>
                            <input type={"text"} className={"bg-amber-400 p-8 rounded-md"} placeholder={"Enter the answer to your question"}/>
                        </div>:
                        <input type={"text"} className={"bg-amber-400 p-8 rounded-md"} placeholder={"Enter your guess"}/>
                }


            </div>
        </>
    )
}