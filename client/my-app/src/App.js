import * as React from 'react';
import { useState, useEffect } from 'react';
import Lobby from './lobby'
import MyInputField from './MyInputField';

export default function App() {
    //s
    const [isHosting, setIsHosting] = useState(localStorage.getItem('hosting'));
    
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