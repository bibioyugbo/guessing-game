const SOCKET_URL = process.env.NODE_ENV === 'production'
    ? 'wss://your-app.onrender.com'
    : 'ws://localhost:3200';

export default SOCKET_URL;