import * as React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './MyInputField.css';
import { socket } from './socket';

export default function MyInputField({ handleIsHosting }) {
  // States
  const [fetchedData, setFetchedData] = useState(null);
  const [inputCode, setInputCode] = useState(null);

  // Effects
  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data)
    })
  },[ socket ])

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
  const updateCode = (event) => {
    const newValue = event.target.value;
    setInputCode(newValue);
  };

  const fetchJoin = async () => {
    console.log("JOIN");
    console.log(inputCode);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/join', {
        method: 'POST', // Use the appropriate HTTP method
        headers: {
          'Content-Type': 'application/json', // Set the appropriate content type
        }, 
        body: JSON.stringify({"code": inputCode }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success === "true") {
        socket.emit("setClientUsername", "WOOO");
      }
      else {
        console.log("Invalid code");
      }
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

        // Connect socket
        socket.connect();
        socket.emit("setHostUsername", "WEEE");

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
        <TextField id="outlined-basic" label="Lobby Code" onChange={updateCode} variant="outlined"></TextField>
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button variant="contained" style={buttonStyle} onClick={fetchJoin}>Enter Lobby Code</Button>
        <Button variant="contained" onClick={fetchHost}>Host</Button>
      </Grid>
    </Grid>
  );
}
