import * as React from 'react';
import { useState, useEffect } from 'react';
import Lobby from './lobby'
import ChooseName from './chooseName';
import MyInputField from './MyInputField';
import { socket } from './socket';

export default function App() {
    
    const [isHosting, setIsHosting] = useState('false');
    const [isJoining, setIsJoining] = useState('false');
    const [nameSet, setNameSet] = useState('false');
    const [name, setName] = useState('');
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
          {isHosting === 'false' && isJoining === 'false' ? (
            <MyInputField
                handleIsHosting={(isHosting) => setIsHosting(isHosting)}
                handleIsJoining={(isJoining) => setIsJoining(isJoining)}
            />
          ) : nameSet === 'false' ? (
            <ChooseName 
                isHosting={isHosting}
                isJoining={isJoining}
                handleNameSet={(nameSet) => setNameSet(nameSet)}
                handleName={(name) => setName(name)}
              />
          ) : (
            <Lobby
                handleIsHosting={(isHosting) => setIsHosting(isHosting)}
                handleIsJoining={(isJoining) => setIsJoining(isJoining)}
                handleNameSet={(nameSet) => setNameSet(nameSet)}
                isHosting={isHosting}
                name={name}
            />
          )}
        </div>
      );
        /*
        <div>
          {isHosting === 'true' ?(
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
      */
}