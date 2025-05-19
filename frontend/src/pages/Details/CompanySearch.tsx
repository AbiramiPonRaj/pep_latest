import React, { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import {
    Container,
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
} from '@mui/material';
import { Card } from 'react-bootstrap';
import { Payload } from '../../data/services/viewpage/viewpagedetails-payload';
import { useSelector } from 'react-redux';

const CompanySearch = () => {
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [companyName, setCompanyName] = useState('');
    const [dinNumber, setDinNumber] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [companyNameError, setCompanyNameError] = useState('');


    const handleSearch = async () => {
        setCompanyNameError('');
        if (!companyName) {
            setCompanyNameError('Company Name is required');
            return;
        }
        setShowPopup(true);
    };

const [formDatas, setformDatas] = useState<Payload>({
        combinedDTO: [
            {
                companyDTO: {
                    id: 0,
                    sourceLink: '',
                    associateMasterId: 0,
                    companyName: '',
                    listAdverseInformation: 0,
                    listRegulatoryAction: 0,
                    listGovernment: 0,
                    originalDateOfAppointment: '',

                    typeId: 0,
                    cinfcrn: '',

                    document: '',

                },
                addressDTOS: [
                    {
                        id: 0,
                        companyId: 0,
                        registeredAddress: '',
                    },
                ],
                contactDTOS: [
                    {
                        companyId: 0,
                        emailID: '',
                    },
                ],
                companiesDirectorsDTOS: [
                    {
                        id: 0,

                        din: '',
                        companyId: 0,
                        directorId: 0,
                        designationId: 0,
                        companyMasterId: 0,
                        appointmentDate: '',
                        cessationDate: '',
                        designation: '',
                        directorStatus: '',
                        directorName: '',


                    },
                ],
                companyDocumentsDTOS: [
                    {
                        companyId: 0,
                        documentTypeId: 0,
                        documentType: '',
                        imageName3: '',
                        uid: 0,
                        files3: [],
                        path: [],
                        euid: 0,
                    },
                ],
                companyAssociationDTOS: [
                    {
                        id: 0,
                        companyId: 0,
                        companyAssociation: '',
                        uid: loginDetails.id,

                    },
                ],

            },
        ],
    });

    const closePopup = () => {
        setShowPopup(false);
    };


    return (
        <div>
            <Header />

            <Container>
                <Box mt={4}>
                    <Card.Body style={{ marginTop: '13%' }}>
                        <Typography variant="h5" gutterBottom>
                            Company Search
                        </Typography>
                        <form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Company Name"
                                        variant="outlined"
                                        fullWidth
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            setCompanyNameError('');
                                        }}
                                        error={Boolean(companyNameError)}
                                        helperText={companyNameError}
                                    />

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="DIN Number"
                                        variant="outlined"
                                        fullWidth
                                        value={dinNumber}
                                        onChange={(e) => setDinNumber(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSearch}
                                style={{ marginTop: '5%', width: '15%' }}
                            >
                                Search
                            </Button>
                        </form>
                    </Card.Body>
                </Box>
            </Container>

            {/* Popup Dialog */}
            <Dialog open={showPopup} onClose={closePopup} fullWidth maxWidth="lg">
                <DialogTitle>List Of Associated Details</DialogTitle>
                <DialogContent>
                    {formDatas.combinedDTO.map((item, index) => (
                        <div key={index}>
                            <Typography>
                                <strong>Company Name:</strong> {item.companyDTO.companyName || 'Not Available'}
                            </Typography>
                            <Typography>
                                <strong>CINFCRN:</strong> {item.companyDTO.cinfcrn || 'Not Available'}
                            </Typography>
                            <Typography>
                                <strong>Original Date Of Appointment:</strong>{' '}
                                {item.companyDTO.originalDateOfAppointment || 'Not Available'}
                            </Typography>
                            <Typography>
                                <strong>Email ID:</strong>{' '}
                                {item.contactDTOS && item.contactDTOS.length > 0
                                    ? item.contactDTOS[0].emailID || 'Not Available'
                                    : 'Not Available'}
                            </Typography>
                            <Typography>
                                <strong>Registered Address:</strong>{' '}
                                {item.addressDTOS && item.addressDTOS.length > 0
                                    ? item.addressDTOS[0].registeredAddress || 'Not Available'
                                    : 'Not Available'}
                            </Typography>
                            {/* Add more details as needed */}
                        </div>
                    ))}
                </DialogContent>

                <DialogActions>
                <Button variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button variant="contained" color="primary" onClick={closePopup}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CompanySearch;