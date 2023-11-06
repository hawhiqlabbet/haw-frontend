import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './MyInputField.css';

export default function MyInputField() {
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

  return (
    <Grid container style={containerStyle} justifyContent="center" alignItems="center">
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <TextField id="outlined-basic" label="Lobby Code" variant="outlined" />
      </Grid>
      <Grid item xs={12} style={{ textAlign: 'center' }}>
        <Button variant="contained" style={buttonStyle}>Enter Lobby Code</Button>
        <Button variant="contained">Host</Button>
      </Grid>
    </Grid>
  );
}
