const express = require('express');
const http = require('http');
const cookieParser = require("cookie-parser");
const path = require('path')
const socketio = require('socket.io');
const cookie = require("cookie");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();
const app = express();
app.use(cookieParser());


const server = http.createServer(app)
const PORT = process.env.PORT



//bind to socket.io module
const io = new socketio.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.ALLOWED_ORIGINS?.split(',') || "https://yourdomain.com"
            : ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],  credentials: true
    }
});

let gameMaster = {
    name:"",
    playerId:"",
    masterId: ""
};
const players = [];

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


// const gameState = {
//     // playerId: Math.floor(Math.random() * 100) + 1,
//     // isGameActive: false,
//     players: [],
//     // isGameMaster:false,
//     gameMaster: null
// };



server.listen(PORT, ()=>{
    console.log(`Guessing Game is running at http://localhost:${PORT}`)
})

io.on('connection',(socket)=>{
    console.log("New connection established", socket.id)
    // Parse cookies from handshake headers
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    let playerId = cookies.playerId;

    if (!playerId) {
        playerId = uuidv4()
        socket.emit("setCookie", playerId);
    }

    socket.on('play-game', (data) => {
        const { playerName } = data;
        console.log(`🎮 ${playerName} joined with ID: ${playerId}`);

        if (!gameMaster.playerId) {
            gameMaster = {name:playerName,playerId, masterId:playerId};
            // socket.emit("youAreMaster", gameMaster );
        }
        const isGameMaster = gameMaster.playerId === playerId

        // if (!isGameMaster){
        //     connectedPlayers.set(playerId, {
        //         socketId: socket.id,
        //         name: playerName,
        //     });
        // }
        if (!isGameMaster){
            const newPlayer = {
                id :playerId,
                name: playerName,
                guesses: 0,

            }
            players.push(newPlayer)
        }

        // Send the same game state to everyone
        const gameState = {
            players: players,
            gameMaster: gameMaster
            // Remove isGameMaster from here
        };


        socket.emit("your-game-state", {
            ...gameState,
            isGameMaster: isGameMaster
        });

        // Update everyone else with just the shared state
        socket.broadcast.emit("game-state-updated", gameState);


        // else {
        //     socket.emit("youArePlayer",  {
        //         name:playerName,
        //         playerId,
        //         masterId: gameMaster.name // optional: let them know who’s master
        //     })
        //     // players.push({ socketId: socket.id, name: playerName, playerId })
        //
        //     ;
        // }

        // io.emit("playersUpdated", {
        //     master: gameMaster,
        //     players
        // });



        // gameState.players = Array.from(connectedPlayers.values());




        // connectedPlayers.set(socket.id, {
        //     id: socket.id,
        //     name: playerName,
        //     guesses: 0
        // });

        // if (!gameState.gameMaster) {
        //     gameState.gameMaster = connectedPlayers.values().next().value;
        // }
        //
        //
        // if (!gameState.isGameActive) {
        //     gameState.isGameActive = true;
        //     // gameState.playerId = Math.floor(Math.random() * 100) + 1;
        // }
        // gameState.players = Array.from(connectedPlayers.values());

        // const isGameMaster = gameState.gameMaster.id ===  socket.id


        // socket.emit('player-started', {
        //     playerId: socket.id,
        //     playerName: playerName,
        //     isGameMaster: isGameMaster,
        //     players:gameState.players,
        //     gameMaster: gameState.gameMaster,
        //     gameActive: gameState.isGameActive
        // });
        //
        // io.emit('game-state-updated', {
        //     players: gameState.players,
        //     gameMaster: gameState.gameMaster,
        //     gameActive: gameState.isGameActive
        // });

    });

    socket.on("round-ended", pickRandomGameMaster)


    socket.on('join-game', (data)=>{
        const { playerName } = data;
        connectedPlayers.set(socket.id, {
            id: socket.id,
            name: playerName,
            guesses: 0
        });
        gameState.players = Array.from(connectedPlayers.values());

    })

    socket.on('question-set', (data)=>{
        console.log(data)
        socket.broadcast.emit('question-set', data)
    })
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

