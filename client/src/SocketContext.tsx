// Create a new file: contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context.socket;
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socket = useMemo(() => {
        console.log('Creating socket connection...');
        return io('http://localhost:8001'
            , {
            // Add connection options for better reliability
            transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
            timeout: 5000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        }
        );
    }, []);

    useEffect(() => {
        const handleConnect = () => {
            console.log('Socket connected:', socket.id);
        };

        const handleConnectError = (error: any) => {
            console.error('Socket connection error:', error);
        };

        const handleDisconnect = (reason: string) => {
            console.log('Socket disconnected:', reason);
        };

        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('connect_error', handleConnectError);
            socket.off('disconnect', handleDisconnect);
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};