const SOCKET_URL = process.env.NODE_ENV === 'production'
    ? "https://guessing-game-nhdp.onrender.com"
    : 'ws://localhost:3200';

export default SOCKET_URL;