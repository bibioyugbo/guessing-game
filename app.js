const express = require('express');
const http = require('http');
const path = require('path')
const socketio = require('socket.io');
const env = require('dotenv');
env.config()
const app = express();

const server = http.createServer(app)
const PORT = process.env.PORT || 3000



//bind to socket.io module
const io = new socketio.Server(server)


server.listen(PORT, ()=>{
    console.log(`Guessing Game is running at http://localhost:${PORT}`)
})

io.on('connection',(socket)=>{
    console.log("New connection established", socket.id)
})

// app.get("/", (_req,res)=>{
//     res.sendFile(__dirname + '/client/src/App.tsx');
// })

app.use(express.static(path.join(__dirname, 'client/dist'))); // or 'client/build'

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html')); // or 'build'
});

app.get("/health", (res)=>{
    res.send("OK");
})

