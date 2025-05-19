import { useState } from 'react';
import Header from '../../layouts/header/header';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';
import { Card } from 'react-bootstrap';
import DirectorApiService from '../../data/services/DirectorEdit/directorEdit-api-service';
import { DirectorEditPayload } from '../../data/services/DirectorEdit/directorEdit-payload';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DirectorEdit = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [showDirectorSection, setShowDirectorSection] = useState(false);
    const [directorData, setDirectorData] = useState<DirectorEditPayload | null>(null);
    const directorApiService = new DirectorApiService();
    const [directorName, setDirectorName] = useState('');
    const [noDirectorFound, setNoDirectorFound] = useState(false);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    console.log('loginDetails:', loginDetails.id);

    const validatePAN = (pan: string) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const handleSearch = async () => {
        if (searchTerm === '') {
            setError('PAN is required.');
            setShowDirectorSection(false);
            setNoDirectorFound(false);
        } else if (!validatePAN(searchTerm)) {
            setError('Invalid PAN number. Please enter a valid PAN.');
            setShowDirectorSection(false);
            setNoDirectorFound(false);
        } else {
            setError('');
            setDirectorName('');
            setShowDirectorSection(true);
            try {
                const response = await directorApiService.getDirector(searchTerm);
                console.log('handleSearch:', response);
                if (response.length > 0 && response[0].name !== "") {
                    setShowDirectorSection(true);
                    setDirectorData(response[0]);
                    setDirectorName(response[0].name);
                    setNoDirectorFound(false);
                } else {
                    setDirectorData(null);
                    setNoDirectorFound(true);
                }
            } catch (error) {
                console.error('Error fetching director data:', error);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePanChange = (e: { target: { value: string; }; }) => {
        const value = e.target.value.toUpperCase();
        setSearchTerm(value);
        if (validatePAN(value)) {
            setError('');
        } else {
            setError('Invalid PAN number. Please enter a valid PAN.');
            setShowDirectorSection(false);
            setNoDirectorFound(false);
        }
    };

    const handleDirectorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDirectorName(e.target.value);
    };

    const handleEdit = async () => {
        if (directorData) {
            console.log('DirectorData:', directorData);
            try {
                const response = await directorApiService.updateDirector(directorData.directorId, directorName, directorData.din, loginDetails.id, 1);
                console.log('Director updated:', response);
            } catch (error) {
                console.error('Error updating director data:', error);
            }
        }
    };

    return (
        <>
            <Header />
            <Box m={6}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '14%' }}>
                            <h4 style={{ textAlign: 'center' }}>DIRECTOR EDIT</h4><br></br>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="PAN Number"
                                        variant="outlined"
                                        value={searchTerm}
                                        inputProps={{ maxLength: 10 }}
                                        onChange={handlePanChange}
                                        onKeyPress={handleKeyPress}
                                        error={!!error}
                                        helperText={error}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSearch}
                                        fullWidth
                                    >
                                        Search
                                    </Button>
                                </Grid>
                            </Grid>
                            {showDirectorSection && directorData && !noDirectorFound ? (
                                <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '3%' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Director Name"
                                                variant="outlined"
                                                value={directorName}
                                                onChange={handleDirectorNameChange}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleEdit}
                                                fullWidth
                                            >
                                                Edit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ) : noDirectorFound ? (
                                <Typography variant="body1" color="textSecondary" align="center" style={{ marginTop: '20px', color: 'red' }}>
                                    No director name found with the given PAN.
                                </Typography>
                            ) : null}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default DirectorEdit;