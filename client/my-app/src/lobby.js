import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { socket } from './socket';


export default function Lobby({ handleIsHosting }) {

    // Functions
    const quit = async () => {
        localStorage.setItem('hosting', 'false');
        handleIsHosting('false');

        // Disconnect socket
        socket.emit("disconnectName", "WEEE");
        socket.disconnect();

        // Dispatch a custom event
        const event = new Event('storage');
        window.dispatchEvent(event);
      };
    return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item style={{ textAlign: 'center' }}>
        <Button variant="contained">Game1</Button>
      </Grid>
      <Grid item style={{ textAlign: 'center' }}>
        <Button variant="contained">Game 2</Button>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={quit}>Quit</Button>
      </Grid>
    </Grid>
        
    )
}