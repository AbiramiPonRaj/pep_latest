
import React, { useState, useEffect } from 'react';
import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';
import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import { useSelector } from 'react-redux';

interface Params {
    countryId: string;
    stateId: string;
}


const SearchIdentify: React.FC = () => {
    const [data, setData] = useState<searchIdentify[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const locationState = location.state as Params | null;
    const { countryId, stateId} = locationState || {};
    console.log('countryName:', countryId);
    console.log('stateName:', stateId);
    
        

    useEffect(() => {
        console.log('userDetails:', userDetails);
    }, [userDetails]);


    useEffect(() => {
        fetchData();
    }, [loginDetails.id, countryId, stateId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiService = new searchIdentifyApiService();
            const response = await apiService.getSearchIdentify(loginDetails.id);
            setData(response);
            console.log('apiService:', response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleTableRowClick = (taskId: number, clickedCountryName: number, clickedStateName: number) => {
        navigate(`/details/${taskId}`, {
            state: {
                countryName: clickedCountryName,
                stateName: clickedStateName
            }
        });
    
    };
 


    return (
        <>
            <Header />
            <Box m={6}>
                <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: '52px', margin: '10px' }}>
                    <Card>
                        <CardContent>
                            {loading ? <p>Loading...</p> : (
                                <Table className="table search-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User Name</TableCell>
                                            <TableCell>Country Name</TableCell>
                                            <TableCell>State Name</TableCell>
                                            <TableCell>Year</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((item: searchIdentify, index: number) => (
    <TableRow key={index} onClick={() => handleTableRowClick(Number(item.taskId), item.countryId, item.stateId)}>
    <TableCell>{item.manName}</TableCell>
                                                <TableCell>{item.countryName}</TableCell>
                                                <TableCell>{item.stateName}</TableCell>
                                                <TableCell>{item.year}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default SearchIdentify;
