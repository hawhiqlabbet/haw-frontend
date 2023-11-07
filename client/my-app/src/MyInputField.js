import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './MyInputField.css';
import io from 'socket.io-client';

export default function MyInputField({ handleIsHosting }) {
  // States
  const [fetchedData, setFetchedData] = useState(null);

  // Styling
  const containerStyle = {
    backgroundColor: 'lightblue', // Set the background color to light blue
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginRight: '10px', // Add a margin to the right side of the first button
  };

  // Functions
  const fetchJoin = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/join');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

  const fetchHost = async () => {

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/host');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { token, code } = await response.json();
      if(token !== ""){
        localStorage.setItem('token', token);
        localStorage.setItem('code',  code);
        localStorage.setItem('hosting', 'true')
        setFetchedData(code);
        console.log(code);

        handleIsHosting('true');


        // console.log(process.env.REACT_APP_API_URL);
        // connection 
        const socket = io('http://localhost:3001');

        socket.on("connect", () => {
          console.log('Connected to the WebSocket server');
        });


        // Dispatch a custom event
        const event = new Event('storage');
        window.dispatchEvent(event);
      }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
  };

  return (
    <Grid container style={containerStyle} justifyContent="center" alignItems="center">
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <TextField id="outlined-basic" label="Lobby Code" variant="outlined" />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button variant="contained" style={buttonStyle} onClick={fetchJoin}>Enter Lobby Code</Button>
        <Button variant="contained" onClick={fetchHost}>Host</Button>
      </Grid>
    </Grid>
  );
}
