

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Header from '../../layouts/header/header';
import { CardContent, Grid, TextField } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
import { Identifieds } from '../../data/services/Identify/Identify_payload';
import { useSelector } from 'react-redux';
import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';
import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';

interface CategoryName {
    name: string;
    id: string;
}

function Identify() {
    const navigate = useNavigate();
    const [data, setData] = useState<searchIdentify[]>([]);
    const { pepId } = useParams<{ pepId: string }>();
    const [identifies, setIdentifies] = useState<Identifieds[]>([]);
    const [name, setName] = useState<string>('');
    const [uid, setUid] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const identifyApiService = new IdentifyApiService();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<CategoryName[]>([]);
    const [selectedcategoryName, setSelectedcategoryName] = useState<string>('');
    const { taskId } = useParams<{ taskId: string }>();
    const location = useLocation();
    const { countryName, stateName } = location.state || { countryName: '', stateName: '' };

    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
    }, [countryName, stateName]);

    const handleAddClick = () => {
        sessionStorage.setItem('countryName', countryName);
        sessionStorage.setItem('stateName', stateName);
        navigate('/details');
    };

    const handlecategoryNameChange = (event: SelectChangeEvent<string>) => {
        setSelectedcategoryName(event.target.value);
    };

    const search = async () => {
        try {
            setLoading(true);
            const apiService = new IdentifyApiService();
            const response = await apiService.getIdentify(name);
            setIdentifies(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategory = async () => {
        try {
            const categoryName = await identifyApiService.getCategory();
            setCategoryName(categoryName);
        } catch (error) {
            console.error("Error fetching Category Name:", error);
        }
    };

    const handleSearchClick = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!name.trim()) {
                setNameError('Please enter a valid Name before searching.');
                return;
            } else {
                setNameError('');
            }
            sessionStorage.setItem('countryName', countryName);
            sessionStorage.setItem('stateName', stateName);
            await search();
            setSearchPerformed(true);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    const handleKeyPress = (e: { key: string; }) => {
        sessionStorage.setItem('countryName', countryName);
        sessionStorage.setItem('stateName', stateName);
        if (e.key === 'Enter') {
            search();
        }
    };

    const fetchData = async () => {
        try {
            const apiService = new searchIdentifyApiService();
            const response = await apiService.getSearchIdentify(loginDetails.id);
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    const handleEditClick = (pepId: string, clickedCountryName: string, clickedStateName: string) => {
        const uid = loginDetails.id;
        navigate(`/Edit/${pepId}/${uid}`);
    };

    return (
        <>
            <h4 style={{ marginTop: '6%', marginLeft: '2%' }}></h4>
            <Header />
            <Card border='10px' style={{ margin: '2%' }}>
                <CardContent>
                    <Form onSubmit={handleSearchClick}>
                        <Row>
                            <Col xs={4}>
                                <Form.Group>
                                    <Row>
                                        <Col>
                                            <TextField
                                                id="outlined-basic"
                                                label="Name"
                                                variant="outlined"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                    setNameError('');
                                                }}
                                                onKeyPress={handleKeyPress}
                                            />
                                            {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                                        </Col>
                                        <Col>
                                            <TextField id="outlined-basic" label="Identifier" variant="outlined" />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Grid item xs={12}>
                                    <Grid xs={3}>
                                        <Button type="submit" variant="primary" style={{ marginTop: '2%' }}>
                                            Search
                                        </Button>
                                        <Button variant="primary" style={{ marginTop: '2%', marginLeft: '3%' }} onClick={handleAddClick}>
                                            Add
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Col>
                        </Row>
                    </Form>
                    {searchPerformed && (
                        <table className="table report-table">
                            <thead>
                                <tr>
                                    <th>Sl no</th>
                                    <th>Name</th>
                                    <th>PepName</th>
                                    <th>Identity</th>
                                    <th>Who</th>
                                    <th>SourceLink</th>
                                    <th>DOB</th>
                                </tr>
                            </thead>
                            <tbody>
                                {identifies.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center' }}>
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    identifies.map((item, index) => (
                                        <tr key={index} onClick={() => handleEditClick(String(item.pepId), countryName, stateName)}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.pepName}</td>
                                            <td>{item.identity}</td>
                                            <td>{item.who}</td>
                                            <td>
                                                <a href={item.sourceLink} target="_blank" rel="noopener noreferrer">
                                                    {item.sourceLink}
                                                </a>
                                            </td>
                                            <td>{item.dob}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default Identify;

