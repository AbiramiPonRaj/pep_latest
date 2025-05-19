import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, TextField,Box,Container, Button, FormControl, InputLabel, FormHelperText,Grid } from '@mui/material';
import Header from '../../layouts/header/header';

const ChangePassword: React.FC = () => {
  const [loginId, setLoginId] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    // Perform validation checks
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      // Make an API request to change the password
      const response = await axios.post<{ message: string }>('http://localhost:8081/api/reset', {
        loginId,
        oldPassword,
        newPassword,
      });

      // Handle the response and show success message
      const { message } = response.data;
      alert(message);

      // Reset the form fields and clear stored login credentials
      setLoginId('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');

      // Navigate to the Dashboard page
      navigate('/changepassword');
    } catch (error) {
      // Handle the error and show error message
      // const { message } = error.response.data;
      // setErrorMessage(message);
    }
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: '6%', marginLeft: '2%' }}>
        <Box m={2}>
          <Container>
          <h4>Change Password</h4>
        {errorMessage && <p>{errorMessage}</p>}
        
          <form className="form-container">
          

          <Grid container spacing={3} alignItems="center" justifyContent="center">             
           <Grid item xs={12} sm={3} >
                <TextField
                   label="Login ID"
                  name="name"
                  variant="outlined"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                  }}
                  margin="dense"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                   label="Old Password"
                  name="password"
                  variant="outlined"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  margin="dense"
                  size="small"
                  fullWidth
                />
              </Grid>
            
            </Grid>

            <Grid container spacing={3} alignItems="center" justifyContent="center">             
              <Grid item xs={12} sm={3}>
              <TextField
                  label="Confirm Password"
                  name="password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="dense"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
              <TextField
                  label="New Password"
                  name="password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="dense"
                  size="small"
                  fullWidth
                /> 
              </Grid>
             
            </Grid>
            <br/>
            <Grid container  spacing={3} alignItems="center" justifyContent="center"> 
            <Grid item xs={12} sm={3} >        
                  <Button variant="contained" color="primary">
                  Change Password
                  </Button>
                  </Grid>
                </Grid>
            
         
            
          </form>
          </Container>
          <br/>
          <Container>
    </Container>
    </Box>
    </div>
    
    </>
  );
};

export default ChangePassword;
