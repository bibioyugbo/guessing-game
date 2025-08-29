// GameContext.js
import {createContext, useContext, useState, useEffect, type ReactNode} from 'react'



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

interface GameContextType {
    gameData: gameDataType
    setGameData: (data: gameDataType) => void
    gameInSession: boolean
    setGameInSession: (inSession: boolean) => void
    gameMasterUser: boolean
    setGameMasterUser: (isMaster: boolean) => void
}

// Create context with default value
const GameContext = createContext<GameContextType>({
    gameData: gameDataInit,
    setGameData: () => {},
    gameInSession: false,
    setGameInSession: () => {},
    gameMasterUser: false,
    setGameMasterUser: () => {}
})

interface GameProviderProps{
    children:ReactNode
}
export const GameProvider = ({ children }:GameProviderProps) => {
    const [gameData, setGameData] = useState<gameDataType>(gameDataInit)
    const [gameInSession, setGameInSession] = useState(false)
    const [gameMasterUser, setGameMasterUser] = useState(false)

    // Process gameData changes
    useEffect(() => {
        if (gameData && Object.keys(gameData).length > 0) {
            console.log("Game data updated:", gameData)

            // Check if user is game master
            const isGameMaster = gameData.gameMaster?.id === gameData.playerId
            setGameMasterUser(isGameMaster)

            // Other game data processing...
        }
    }, [gameData])

    const value = {
        gameData,
        setGameData,
        gameInSession,
        setGameInSession,
        gameMasterUser,
        setGameMasterUser
    }

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    )
}

// Custom hook to use game context
export const useGame = () => {
    const context = useContext(GameContext)
    if (!context) {
        throw new Error('useGame must be used within GameProvider')
    }
    return context
}