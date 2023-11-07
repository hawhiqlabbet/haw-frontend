import * as React from 'react';
import { useState, useEffect } from 'react';
import Lobby from './lobby'
import MyInputField from './MyInputField';
import { socket } from './socket';

export default function App() {
    
    const [isHosting, setIsHosting] = useState(localStorage.getItem('hosting'));
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);
    
    useEffect(() => {
        function onConnect() {
          setIsConnected(true);
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }
    
        function onFooEvent(value) {
          setFooEvents(previous => [...previous, value]);
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('foo', onFooEvent);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
          socket.off('foo', onFooEvent);
        };
      }, []);

    return (
        <div>
          {isHosting === 'true' ? (
            <Lobby 
                handleIsHosting={(isHosting) => setIsHosting(isHosting)}
            />
          ) : (
            <MyInputField 
                handleIsHosting={(isHosting) => setIsHosting(isHosting)}
            />
          )}
        </div>
      );
}