import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { socket } from './socket';


export default function Lobby({ handleIsHosting, handleIsJoining, handleNameSet, isHosting, name }) {


    // Effects
    useEffect(() => {
        socket.on("host_disconnected", (data) => {
        alert(data);
        handleIsJoining('false');
        handleNameSet('false');
        })
    },[ socket ])

    // Functions
    const quit = async () => {
        localStorage.setItem('hosting', 'false');
        handleIsHosting('false');
        handleIsJoining('false');
        handleNameSet('false');

        // Disconnect socket
        socket.emit("disconnectName", name);
        socket.disconnect();

        // Dispatch a custom event
        const event = new Event('storage');
        window.dispatchEvent(event);
      };


      return (
        <div>
          {isHosting === 'true' ? (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item style={{ textAlign: 'center' }}>
                <Button variant="contained">Game 1</Button>
              </Grid>
              <Grid item style={{ textAlign: 'center' }}>
                <Button variant="contained">Game 2</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={quit}>Quit</Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <Button variant="contained" onClick={quit}>Quit</Button>
              </Grid>
            </Grid>
          )}
        </div>
      );
}