import React from 'react'
import {Typography, TextField, Grid} from '@mui/material';

const BookForm = () => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Book detail
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="bookName"
            label="Name of book"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="bookCategory"
            label="Category"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="blockid"
            label="ID"
            fullWidth
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default BookForm