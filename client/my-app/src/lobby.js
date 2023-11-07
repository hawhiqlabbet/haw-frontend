import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';

export default function Lobby({ handleIsHosting }) {

    // Functions
    const quit = async () => {
        localStorage.setItem('hosting', 'false');
        handleIsHosting('false');

        // Dispatch a custom event
        const event = new Event('storage');
        window.dispatchEvent(event);
      };
    return (
    <div> 
        LOBBY
        <Button variant="contained" onClick={quit}>Quit</Button>
    </div>
    )
}