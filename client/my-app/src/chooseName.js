import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { socket } from './socket';

export default function ChooseName( {isHosting, isJoining, handleNameSet, handleName} ) {
    // states
    const [inputName, setInputName] = useState(null);


    // Functions
    const updateName = (event) => {
        const newValue = event.target.value;
        setInputName(newValue);
    };

    const sendName = () => {
        if(isHosting === 'true'){
            socket.emit("setHostUsername", inputName);
        }
        if(isJoining === 'true'){
            socket.emit("setClientUsername", inputName);
        }
        handleNameSet('true');
        handleName(inputName);
    }

    return( 
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Button variant="contained" onClick={sendName}>Enter Name</Button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <TextField id="outlined-basic" label="Nickname" onChange={updateName} variant="outlined"></TextField>)
            </Grid>
        </Grid>
    )
}