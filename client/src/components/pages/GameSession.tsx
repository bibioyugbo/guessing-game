import {useEffect, useState} from "react";
import {type gameMasterType, socket} from "./GameLanding";
import {useLocation} from "react-router-dom";

type PlayerType = {
    id: string;
    name: string;
    guessCount: number;
    guess: string;
};

// Fix: Change players type from any[] to PlayersData (object)
type gameDataType = {
    players: PlayersData; // Changed from any[] to PlayersData
    isGameMaster: boolean,
    gameMaster: gameMasterType
}

type PlayersData = Record<string, PlayerType>;

const gameDataTypeInit: gameDataType = {
    players: {}, // Changed from [] to {} since it's now an object
    isGameMaster: false,
    gameMaster: {name: "", playerId: ""}
}

type guessObjectType = {
    guessQuestion:string,
    guessAnswer:string
}

// const guessObjectInit:guessObjectType = {
//     guessQuestion:"",
//     guessAnswer:""
// }

export default function GameSession() {
    socket.on('connect_error', (error) => {
        console.log('Connection error:', error);
    });
    const [playerId, setPlayerId] = useState<string>("");

    console.log(playerId)

    const location = useLocation();

    const [gameData, setGameData] = useState<gameDataType>(
        location?.state?.gameData || gameDataTypeInit // Add fallback
    );

    const [currentQuestion, setCurrentQuestion] = useState('Waiting for the game master to start...');

    // Fix: Change playerGuess type from string to PlayerType array
    const [playerGuesses, setPlayerGuesses] = useState<PlayerType[]>([]);

    console.log("Current gameData:", gameData);

    useEffect(() => {
        const form = document.getElementById("form");
        const input1 = document.getElementById("guess-question") as HTMLInputElement;
        const input2 = document.getElementById("guess-answer") as HTMLInputElement;

        const handleSubmit = (e: Event) => {
            e.preventDefault();
            console.log("Form submitted, gameData:", gameData);
            console.log("Players length:", Object.keys(gameData?.players ?? {}).length);
            console.log("Input values:", input1.value, input2.value)

            if (gameData?.players && Object.keys(gameData?.players ?? {}).length < 3) {
                const currentLength = Object.keys(gameData?.players ?? {}).length
                alert(`Wait for ${3 - currentLength} more player(s) before starting`);
                return; // Add return to prevent further execution
            }

            if (input2.value === "") {
                alert(`Set up your answer`);
                return;
            }

            if (input1.value === "") {
                alert(`Set up your question`);
                return;
            }

            const guessObject = {
                guessQuestion: input1.value,
                guessAnswer: input2.value
            };

            socket.emit('question-set', guessObject);
            input1.value = ""
            input2.value = ""
        }

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        return () => {
            if (form) {
                form.removeEventListener('submit', handleSubmit);
            }
        };
    }, [gameData]);

    useEffect(() => {
        const setQuestion = (data: guessObjectType) => {
            console.log(data);
            setCurrentQuestion(data.guessQuestion);
        };

        socket.on('question-set', setQuestion);

        return () => {
            socket.off('question-set', setQuestion);
        };
    }, []);

    const handleSubmitAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        const playerAnswerInput = document.getElementById('player-answer-form') as HTMLInputElement;

        if (!playerAnswerInput?.value || playerAnswerInput.value === "") {
            alert(`Take a guess`);
            return;
        }

        socket.emit('player-answer', playerAnswerInput.value);
        playerAnswerInput.value = "";
    };

    useEffect(() => {
        const handlePlayerGuesses = (data: PlayersData) => {
            console.log("Player guesses received", data);

            const guessesArray = Object.values(data).filter(player => player.guess !== "");

            console.log("Filtered guesses:", guessesArray);
            setPlayerGuesses(guessesArray); // Fix: Use setPlayerGuesses instead of setPlayerGuess
        }

        socket.on("guesses-made", handlePlayerGuesses);

        return () => {
            socket.off("guesses-made", handlePlayerGuesses);
        };
    }, []);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return '';
        };

        const id = getCookie('playerId');
        if (id) {
            setPlayerId(id);
        }
    }, []);

    useEffect(() => {
        const handleGameStateUpdated = (data: gameDataType) => {
            console.log("Game state updated from other players:", data);
            console.log("Players w guesses:", data.players);

            setGameData(prevData => ({
                ...prevData,
                players: data.players || prevData.players,
                gameMaster: data.gameMaster || prevData.gameMaster,
                isGameMaster: prevData.isGameMaster
            }));
        };

        socket.on('game-state-updated', handleGameStateUpdated);

        return () => {
            socket.off('game-state-updated', handleGameStateUpdated);
        };
    }, []);

    return (
        <>
            <div className={"bg-amber-100 flex p-5 w-full items-end h-screen"}>
                {
                    gameData?.isGameMaster ?
                        <div className={"flex justify-center m-auto h-full gap-4 flex-col"}>
                            <div className={"bg-amber-700 rounded-md text-white border-2 text-center capitalize p-5 w-auto"}>
                                Hi GameMaster {gameData?.gameMaster.name}!
                            </div>
                            <div className={"justify-between w-full h-full flex flex-col"}>
                                <form id={"form"} className={" h-full flex-col  justify-between p-4 items-center flex rounded-md"}>
                                    <div className={"bg-amber-400 items-center flex p-3 rounded-md justify-center "}>
                                        <input
                                            id={"guess-question"}
                                            type={"text"}
                                            className={"bg-white  outline-none w-[650px] p-8 rounded-[12px]"}
                                            placeholder={"Enter your question"}
                                        />
                                    </div>
                                    <div className={"w-full"}>
                                        <input
                                            id={"guess-answer"}
                                            type={"text"}
                                            className={"bg-amber-400 outline-none w-full rounded-br-3xl p-8 rounded-md"}
                                            placeholder={"Enter the answer to your question"}
                                        />
                                        <div className={"flex mt-3 justify-end"}>
                                            <button type={'submit'} className={"bg-amber-700 active:scale-105 max-w-[200px] transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>
                                                Start Game
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        :
                        <div className={"h-full w-full items-center gap-[15%] flex"}>
                            <div className={" flex flex-col items-center justify-center bg-amber-700 h-full max-h-20 p-3 text-white rounded-md"}>
                                <div>Number of players</div>
                                <p>{Object.keys(gameData?.players ?? {}).length}</p>
                            </div>

                            <div className={"flex h-full justify-between flex-col"}>
                                <ul id={'question'} className={"bg-amber-700 rounded-t-3xl rounded-br-3xl w-[700px] p-8 rounded-md"}>
                                    <li className={"li-element"} id={'questionText'}>{currentQuestion}</li>
                                </ul>

                                {/* Fix: Render the player guesses */}
                                <ul id={'guesses'}>
                                    {playerGuesses.map((player) => (
                                        <li
                                            key={player.id}
                                            className={"bg-amber-400 outline-none rounded-br-3xl rounded-t-3xl w-[700px] p-8 rounded-md mb-2"}
                                        >
                                            <strong>{player.name}:</strong> {player.guess}
                                            <span className="text-sm ml-2">({player.guessCount} guesses)</span>
                                        </li>
                                    ))}
                                    {playerGuesses.length === 0 && (
                                        <li className={"text-gray-500 p-4"}>No guesses yet...</li>
                                    )}
                                </ul>

                                <form onSubmit={handleSubmitAnswer} id={"player-answer"}>
                                    <label className={"text-gray-600 capitalize flex text-[14px] mr-6 justify-end"}>
                                        {location.state?.userName}
                                    </label>
                                    <input id={'player-answer-form'}
                                           type={"text"}
                                           className={"bg-amber-400 outline-none rounded-t-3xl rounded-bl-3xl w-[700px] p-8 rounded-md"}
                                           placeholder={"Enter your guess"}
                                    />
                                    <div className={"flex mt-4 justify-end"}>
                                        <button type="submit" className={"bg-amber-700 active:scale-105 max-w-[200px] transition-transform cursor-pointer rounded-[10px] text-white max-h-[40px] p-2 "}>
                                            Guess answer
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}