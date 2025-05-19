import React, { ChangeEvent, useState } from 'react';
import Header from '../../layouts/header/header';
import { Box, Grid, TextField, Button } from '@mui/material';
import { Card } from 'react-bootstrap';

import { useSelector } from 'react-redux';
import { DirectorNameEditPayload } from '../../data/services/DirectorNameEdit/directorNameEdit_payload';
import DirectorNameEditApiService from '../../data/services/DirectorNameEdit/directorNameEdit_api_service';

const DinNameEdit: React.FC = () => {

    const [dinNumber, setDinNumber] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [requiredError, setRequiredError] = useState<string | null>(null);
    const directorNameApi = new DirectorNameEditApiService();
    const [directorName, setDirectorName] = useState('');
    const [directorData, setDirectorData] = useState<DirectorNameEditPayload | null>(null);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [showDirectorCard, setShowDirectorCard] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [directorNameError, setDirectorNameError] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setDinNumber(value);
     
    };

    const handleSearch = async () => {
        setSuccessMessage(null);
        if (dinNumber.trim() === '') {
            setRequiredError('DIN Number is required');
            setShowDirectorCard(false);
        } else {
            setRequiredError(null);
            try {
                const response = await directorNameApi.getDirectorName(dinNumber);
                if (response.length > 0) {
                    setDirectorData(response[0]);
                    setDirectorName(response[0].name);
                    setShowDirectorCard(true);
                } else {
                    setShowDirectorCard(false);
                    setError('No director found with this DIN Number');
                }
                return response;
            } catch (error) {
                console.error('Error fetching the DirectorName:', error);
                setShowDirectorCard(false);
            }
        }
    };

    const handleKeyPressDin = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    const handleEdit = async () => {
        if (!directorData) {
            console.error('No director data available.');
            return;
        }
        if (directorName.trim() === '') {
            setDirectorNameError('Director Name is required');
            return;
        }
        setDirectorNameError(null);
        const payload: DirectorNameEditPayload = {
            id: 0,
            name: directorData.name,
            din: directorData.din,
            uid: loginDetails.id,
            euid: 1
        };
        try {
            await directorNameApi.updateDirector(directorData.id, directorName, directorData.din, loginDetails.id, 1);
            // await directorNameApi.saveDirectorName(payload);
            setSuccessMessage('Director name updated successfully.');
        } catch (error) {
            console.error('Error saving the director name:', error);
        }
    };

    const handleKeyPressDirectorName = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleEdit();
        }
    };

    const handleDirectorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDirectorName(e.target.value);
        if (e.target.value.trim() !== '') {
            setDirectorNameError(null);
        }
    };

    return (
        <>
            <Header />
            <Box m={6}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '2%' }}>
                            <h4 style={{ textAlign: 'center' }}>DIN NAME EDIT</h4>
                            <br />
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="DIN Number"
                                        variant="outlined"
                                        fullWidth
                                        value={dinNumber}
                                        inputProps={{ maxLength: 10 }}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPressDin}
                                       
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                            {showDirectorCard && (
                                <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '3%' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Director Name"
                                                variant="outlined"
                                                value={directorName}
                                                onChange={handleDirectorNameChange}
                                                onKeyPress={handleKeyPressDirectorName}
                                                fullWidth
                                                error={!!directorNameError}
                                                helperText={directorNameError}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                onClick={handleEdit}
                                            >
                                                Edit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Card>
                            )}
                            {successMessage && (
                                <Box mt={2} p={1} bgcolor="success.main" color="white" borderRadius={1} width="50%">
                                    {successMessage}
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default DinNameEdit;