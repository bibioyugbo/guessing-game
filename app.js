const express = require('express');
const http = require('http');
const path = require('path')
const socketio = require('socket.io');
require('dotenv').config();
const app = express();

const server = http.createServer(app)
const PORT = process.env.PORT



//bind to socket.io module
const io = new socketio.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.ALLOWED_ORIGINS?.split(',') || "https://yourdomain.com"
            : ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
    }
});

const connectedPlayers = new Map();
function pickRandomGameMaster() {
    const players = Array.from(connectedPlayers.values());
    if (players.length === 0) {
        gameState.gameMaster = null;
        return;
    }

    const randomIndex = Math.floor(Math.random() * players.length);
    gameState.gameMaster = players[randomIndex];
}


const gameState = {
    // playerId: Math.floor(Math.random() * 100) + 1,
    isGameActive: false,
    players: [],
    gameMaster: null
};



server.listen(PORT, ()=>{
    console.log(`Guessing Game is running at http://localhost:${PORT}`)
})

io.on('connection',(socket)=>{
    console.log("New connection established", socket.id)

    socket.on('join-game', (data) => {
        const { playerName } = data;
        console.log(`🎮 ${playerName} joined with ID: ${socket.id}`);

        connectedPlayers.set(socket.id, {
            id: socket.id,
            name: playerName,
            guesses: 0
        });

        if (!gameState.gameMaster) {
            gameState.gameMaster = connectedPlayers.values().next().value;
        }


        if (!gameState.isGameActive) {
            gameState.isGameActive = true;
            // gameState.playerId = Math.floor(Math.random() * 100) + 1;
        }
        gameState.players = Array.from(connectedPlayers.values());

        const isGameMaster = gameState.gameMaster.id ===  socket.id


        socket.emit('player-joined', {
            playerId: socket.id,
            playerName: playerName,
            isGameMaster: isGameMaster,
            players:gameState.players,
            gameMaster: gameState.gameMaster,
            gameActive: gameState.isGameActive
        });

        io.emit('game-state-updated', {
            players: gameState.players,
            gameMaster: gameState.gameMaster,
            gameActive: gameState.isGameActive
        });
        socket.on("round-ended", pickRandomGameMaster)

    });
})

// app.get("/", (_req,res)=>{
//     res.sendFile(__dirname + '/client/src/App.tsx');
// })

app.use(express.static(path.join(__dirname, 'client/dist'))); // or 'client/build'

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'client/dist', 'index.html')); // or 'build'
    // console.log("hey bibs")
    res.json({
        status: "OK",
        message: "Guessing Game API is running!",
        connectedPlayers: connectedPlayers.size
    });
});



app.get("/health", (_req, res)=>{
    res.send("OK");
})

