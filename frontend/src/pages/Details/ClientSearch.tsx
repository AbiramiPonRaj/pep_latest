// // import React, { useState, useEffect } from 'react';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { Container, Row, Col, Form, Button, Card, Alert, Table, Spinner } from 'react-bootstrap';
// // import Header from '../../layouts/header/header';
// // import { CardContent, Grid, TextField } from '@mui/material';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
// // import { Identifieds } from '../../data/services/Identify/Identify_payload';
// // import { useSelector } from 'react-redux';
// // import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';
// // import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
// // import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, TableRow, TableCell, TableBody, TableHead } from '@mui/material';

// // interface CategoryName {
// //     name: string;
// //     id: string;
// // }

// // interface Individual {
// //     [x: string]: string;
// //     userName: string;
// //     pepName: string;
// //     education: string;
// //     sourceLink: string;
// //     pepDob: string;
// //     pepPan: string;
// // }

// // interface Organization {
// //     companyId: string;
// //     originalDateOfAppointment: string;
// //     appointmentDate: string;
// //     cessationDate: string;
// //     companyName: string;
// //     cinfcrn: string;
// // }

// // function Identify() {
// //     const navigate = useNavigate();
// //     const [data, setData] = useState<searchIdentify[]>([]);
// //     const { pepId } = useParams<{ pepId: string }>();
// //     const [identifies, setIdentifies] = useState<Identifieds[]>([]);
// //     const [name, setName] = useState<string>('');
// //     const [uid, setUid] = useState<string>('');
// //     const [nameError, setNameError] = useState<string>('');
// //     const identifyApiService = new IdentifyApiService();
// //     const userDetails = useSelector((state: any) => state.loginReducer);
// //     const loginDetails = userDetails.loginDetails;
// //     const [loading, setLoading] = useState(false);
// //     const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
// //     const [categoryName, setCategoryName] = useState<CategoryName[]>([]);
// //     const [Individual, setIndividual] = useState<Individual[]>([]);
// //     const [Organization, setOrganization] = useState<Organization[]>([]);
// //     const [selectedcategoryName, setSelectedcategoryName] = useState<string>('');
// //     const [validationErrors, setValidationErrors] = useState<{ entity: string, name: string }>({ entity: '', name: '' });

// //     useEffect(() => {
// //         fetchCategory();
// //     }, []);

// //     const handleAddClick = () => {
// //         navigate(`/details`);
// //     };

// //     useEffect(() => {
// //         setValidationErrors((prevErrors) => ({
// //             entity: selectedcategoryName ? '' : prevErrors.entity,
// //             name: name ? '' : prevErrors.name
// //         }));
// //     }, [selectedcategoryName, name]);

// //     const handlecategoryNameChange = (event: SelectChangeEvent<string>) => {
// //         setSelectedcategoryName(event.target.value);
// //     };

// //     const fetchCategory = async () => {
// //         try {
// //             const categoryName = await identifyApiService.getCategory();
// //             setCategoryName(categoryName);
// //         } catch (error) {
// //             console.error("Error fetching Category Name:", error);
// //         }
// //     };

// //     const fetchIndividual = async () => {
// //         try {
// //             setOrganization([]);
// //             const individualResults = await identifyApiService.getIndividual(name);
// //             setIndividual(Array.isArray(individualResults) ? individualResults : []);
// //         } catch (error) {
// //             console.error('Error fetching Individual:', error);
// //         }
// //     };

// //     const fetchOrganization = async () => {
// //         try {
// //             setIndividual([]);
// //             const organizationResults = await identifyApiService.getOrganization(name);
// //             setOrganization([...organizationResults]);
// //         } catch (error) {
// //             console.error('Error fetching Organization:', error);
// //         }
// //     };

// //     const handleEditClick = (pepId: string, entity: string) => {
// //         const uid = loginDetails.id;
// //         navigate(`/ClientView/${pepId}/${uid}/${entity}`);
// //     };

// //     const handleCompanyEditClick = (companyId: string, entity: string) => {
// //         const uid = loginDetails.id;
// //         navigate(`/ClientView/${companyId}/${uid}/${entity}`);
// //     };

// //     const handleSearchClick = async () => {
// //         try {
// //             if (!selectedcategoryName) {
// //                 setValidationErrors((prevErrors) => ({ ...prevErrors, entity: 'Entity is required' }));
// //             } else {
// //                 setValidationErrors((prevErrors) => ({ ...prevErrors, entity: '' }));
// //             }
// //             if (!name) {
// //                 setValidationErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
// //             } else {
// //                 setValidationErrors((prevErrors) => ({ ...prevErrors, name: '' }));
// //             }
// //             if (validationErrors.entity || validationErrors.name) {
// //                 return;
// //             }
// //             setLoading(true);
// //             setSearchPerformed(true);
// //             if (selectedcategoryName == '1') {
// //                 setOrganization([]);
// //                 await fetchIndividual();
// //             }
// //             if (selectedcategoryName == '2') {
// //                 setIndividual([]);
// //                 await fetchOrganization();
// //             }
// //         } catch (error) {
// //             console.error('Error searching:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <>
// //             <h4 style={{ marginTop: '6%', marginLeft: '2%' }}></h4>
// //             <Header />
// //             <Card border='10px' style={{ margin: '2%' }}>
// //                 <CardContent>
// //                     <Container fluid>
// //                         <Form>
// //                             <Row>
// //                                 <Col xs={12} md={4}>
// //                                     <Form.Group>
// //                                         <Row>
// //                                             <Col>
// //                                                 <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
// //                                                     <InputLabel htmlFor="categoryName-select">Entity</InputLabel>
// //                                                     <Select
// //                                                         id="categoryName-select"
// //                                                         value={selectedcategoryName}
// //                                                         onChange={handlecategoryNameChange}
// //                                                         label="Entity"
// //                                                     >
// //                                                         {categoryName.map((category) => (
// //                                                             <MenuItem key={category.id} value={category.id}>
// //                                                                 {category.name}
// //                                                             </MenuItem>
// //                                                         ))}
// //                                                     </Select>
// //                                                     {validationErrors.entity && (
// //                                                         <p style={{ color: 'red' }}>
// //                                                             {validationErrors.entity}
// //                                                         </p>
// //                                                     )}
// //                                                 </FormControl>
// //                                             </Col>
// //                                             <Col>
// //                                                 <TextField
// //                                                     id="outlined-basic"
// //                                                     label="Name"
// //                                                     variant="outlined"
// //                                                     value={name}
// //                                                     onChange={(e) => {
// //                                                         setName(e.target.value);
// //                                                         setNameError('');
// //                                                     }}
// //                                                     onKeyPress={(e) => {
// //                                                         if (e.key === 'Enter') {
// //                                                             handleSearchClick();
// //                                                         }
// //                                                     }}
// //                                                 />
// //                                                 {validationErrors.name && (
// //                                                     <p style={{ color: 'red' }}>
// //                                                         {validationErrors.name}
// //                                                     </p>
// //                                                 )}
// //                                             </Col>
// //                                             <Col>
// //                                                 <TextField id="outlined-basic" label="Identifier" variant="outlined" />
// //                                             </Col>
// //                                         </Row>
// //                                     </Form.Group>
// //                                 </Col>
// //                                 <Col xs={12} md={4}>
// //                                     <Button type="button" variant="primary" style={{ marginTop: '2%' }} onClick={handleSearchClick}>
// //                                         Search
// //                                     </Button>
// //                                     <Button variant="primary" style={{ marginTop: '2%', marginLeft: '3%' }} onClick={handleAddClick}>
// //                                         Add
// //                                     </Button>
// //                                 </Col>
// //                             </Row>
// //                         </Form>

// //                         {searchPerformed && !loading && (Individual.length > 0 || Organization.length > 0) ? (
// //                             <Card border='10px' style={{ margin: '2%' }}>
// //                                 <CardContent>
// //                                     {loading && <Spinner animation="border" role="status">
// //                                         <span className="visually-hidden">Loading...</span>
// //                                     </Spinner>}
// //                                     {Individual.length > 0 && (
// //                                         <Table>
// //                                             <TableHead>
// //                                                 <TableRow>
// //                                                     <TableCell>UserName</TableCell>
// //                                                     {/* <TableCell>Date of Entry</TableCell> */}
// //                                                     <TableCell>Pep Name</TableCell>
// //                                                     <TableCell>Education</TableCell>
// //                                                     <TableCell>Source Link</TableCell>
// //                                                     <TableCell>Pep Dob</TableCell>
// //                                                     <TableCell>Pep Pan</TableCell>
// //                                                 </TableRow>
// //                                             </TableHead>
// //                                             <TableBody>
// //                                                 {Individual.map((result, index) => (
// //                                                     <TableRow key={index} onClick={() => handleEditClick(result.pepId, selectedcategoryName)}>
// //                                                         <TableCell>{result.userName}</TableCell>
// //                                                         <TableCell>{result.pepName}</TableCell>
// //                                                         <TableCell>{result.education}</TableCell>
// //                                                         <td>
// //                                                             <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
// //                                                                 {result.sourceLink}
// //                                                             </a>
// //                                                         </td>
// //                                                         <TableCell>{result.pepDob}</TableCell>
// //                                                         <TableCell>{result.pepPan}</TableCell>
// //                                                     </TableRow>
// //                                                 ))}
// //                                             </TableBody>
// //                                         </Table>
// //                                     )}
// //                                     {Organization.length > 0 && (
// //                                         <Table>
// //                                             <TableHead>
// //                                                 <TableRow>
// //                                                     <TableCell>Original Date Of Appointment</TableCell>
// //                                                     <TableCell>Appointment Date</TableCell>
// //                                                     <TableCell>Cessation Date</TableCell>
// //                                                     <TableCell>Company Name</TableCell>
// //                                                     <TableCell>Cinfcrn</TableCell>
// //                                                 </TableRow>
// //                                             </TableHead>
// //                                             <TableBody>
// //                                                 {Organization.map((result, index) => (
// //                                                     <TableRow key={index} onClick={() => handleCompanyEditClick(result.companyId, selectedcategoryName)}>
// //                                                         <TableCell>{result.originalDateOfAppointment}</TableCell>
// //                                                         <TableCell>{result.appointmentDate}</TableCell>
// //                                                         <TableCell>{result.cessationDate}</TableCell>
// //                                                         <TableCell>{result.companyName}</TableCell>
// //                                                         <TableCell>{result.cinfcrn}</TableCell>
// //                                                     </TableRow>
// //                                                 ))}
// //                                             </TableBody>
// //                                         </Table>
// //                                     )}
// //                                     {(Individual.length === 0 && Organization.length === 0) && (
// //                                         <p>No data available.</p>
// //                                     )}
// //                                 </CardContent>
// //                             </Card>
// //                         ) : (
// //                             searchPerformed && !loading && (
// //                                 (selectedcategoryName && name) ? (
// //                                     (validationErrors.entity || validationErrors.name) ? (
// //                                         <p style={{ textAlign: 'center', color: 'red' }}>
// //                                             {validationErrors.entity || validationErrors.name}
// //                                         </p>
// //                                     ) : (
// //                                         <p style={{ textAlign: 'center' }}>No data available.</p>
// //                                     )
// //                                 ) : null
// //                             )
// //                         )}
// //                     </Container>
// //                 </CardContent>
// //             </Card>
// //         </>
// //     );
// // }

// // export default Identify;


// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Container, Row, Col, Form, Button, Card, Alert, Table, Spinner } from 'react-bootstrap';
// import Header from '../../layouts/header/header';
// import { CardContent, Grid, TextField } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
// import { Identifieds } from '../../data/services/Identify/Identify_payload';
// import { useSelector } from 'react-redux';
// import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';
// import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
// import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, TableRow, TableCell, TableBody, TableHead } from '@mui/material';

// interface CategoryName {
//     name: string;
//     id: string;
// }

// interface Individual {
//     [x: string]: string;
//     userName: string;
//     pepName: string;
//     education: string;
//     sourceLink: string;
//     pepDob: string;
//     pepPan: string;
// }

// interface Organization {
//     companyId: string;
//     originalDateOfAppointment: string;
//     appointmentDate: string;
//     cessationDate: string;
//     companyName: string;
//     cinfcrn: string;
// }

// interface All {
//     userName: string;
//     pepName: string;
//     originalDateOfAppointment: string;
//     appointmentDate: string;
//     cessationDate: string;
//     pepDob: string;
//     pepPan: string;
//     education: string;
//     cinfcrn: string;
//     companyName: string;
//     sourceLink: string;
//     pepId: string;
//     companyId: string;
// }

// function Identify() {
//     const navigate = useNavigate();
//     const [data, setData] = useState<searchIdentify[]>([]);
//     const { pepId } = useParams<{ pepId: string }>();
//     const [identifies, setIdentifies] = useState<Identifieds[]>([]);
//     const [name, setName] = useState<string>('');
//     const [uid, setUid] = useState<string>('');
//     const [nameError, setNameError] = useState<string>('');
//     const identifyApiService = new IdentifyApiService();
//     const userDetails = useSelector((state: any) => state.loginReducer);
//     const loginDetails = userDetails.loginDetails;
//     const [loading, setLoading] = useState(false);
//     const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
//     const [categoryName, setCategoryName] = useState<CategoryName[]>([]);
//     const [Individual, setIndividual] = useState<Individual[]>([]);
//     const [Organization, setOrganization] = useState<Organization[]>([]);
//     const [allData, setAllData] = useState<All[]>([]);
//     const [selectedcategoryName, setSelectedcategoryName] = useState<string>('');
//     const [validationErrors, setValidationErrors] = useState<{ entity: string, name: string }>({ entity: '', name: '' });

//     useEffect(() => {
//         fetchCategory();
//     }, []);

//     const handleAddClick = () => {
//         navigate(`/details`);
//     };

//     useEffect(() => {
//         setValidationErrors((prevErrors) => ({
//             entity: selectedcategoryName ? '' : prevErrors.entity,
//             name: name ? '' : prevErrors.name
//         }));
//     }, [selectedcategoryName, name]);

//     const handlecategoryNameChange = (event: SelectChangeEvent<string>) => {
//         setSelectedcategoryName(event.target.value);
//     };

//     const fetchCategory = async () => {
//         try {
//             const categoryName = await identifyApiService.getCategory();
//             setCategoryName(categoryName);
//         } catch (error) {
//             console.error("Error fetching Category Name:", error);
//         }
//     };

//     const fetchIndividual = async () => {
//         try {
//             setOrganization([]);
//             setAllData([]);
//             const individualResults = await identifyApiService.getIndividual(name);
//             setIndividual(Array.isArray(individualResults) ? individualResults : []);
//         } catch (error) {
//             console.error('Error fetching Individual:', error);
//         }
//     };

//     const fetchOrganization = async () => {
//         try {
//             setIndividual([]);
//             setAllData([]);
//             const organizationResults = await identifyApiService.getOrganization(name);
//             setOrganization([...organizationResults]);
//         } catch (error) {
//             console.error('Error fetching Organization:', error);
//         }
//     };

//     const fetchAll = async () => {
//         try {
//             setIndividual([]);
//             setOrganization([]);
//             const allResults = await identifyApiService.getAll(name);
//             setAllData(allResults);
//         } catch (error) {
//             console.error('Error fetching All:', error);
//         }
//     };

//     const handleEditClick = (pepId: string, entity: string) => {
//         const uid = loginDetails.id;
//         navigate(`/ClientView/${pepId}/${uid}/${entity}`);
//     };

//     const handleCompanyEditClick = (companyId: string, entity: string) => {
//         const uid = loginDetails.id;
//         navigate(`/ClientView/${companyId}/${uid}/${entity}`);
//     };

//     const handleAllEditClick = (pepId: string, companyId: string, entity: string) => {
//         const uid = loginDetails.id;
//         navigate(`/ClientView/${pepId}/${companyId}/${uid}/${entity}`);
//     }

//     const handleSearchClick = async () => {
//         try {
//             if (!selectedcategoryName) {
//                 setValidationErrors((prevErrors) => ({ ...prevErrors, entity: 'Entity is required' }));
//             } else {
//                 setValidationErrors((prevErrors) => ({ ...prevErrors, entity: '' }));
//             }
//             if (!name) {
//                 setValidationErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
//             } else {
//                 setValidationErrors((prevErrors) => ({ ...prevErrors, name: '' }));
//             }
//             if (validationErrors.entity || validationErrors.name) {
//                 return;
//             }
//             setLoading(true);
//             setSearchPerformed(true);
//             if (selectedcategoryName == '1') {
//                 setOrganization([]);
//                 setAllData([]);
//                 await fetchIndividual();
//             }
//             if (selectedcategoryName == '2') {
//                 setIndividual([]);
//                 setAllData([]);
//                 await fetchOrganization();
//             }
//             if (selectedcategoryName == '3') {
//                 setIndividual([]);
//                 setOrganization([]);
//                 await fetchAll();
//             }
//         } catch (error) {
//             console.error('Error searching:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <h4 style={{ marginTop: '6%', marginLeft: '2%' }}></h4>
//             <Header />
//             <Card border='10px' style={{ margin: '2%' }}>
//                 <CardContent>
//                     <Container fluid>
//                         <Form>
//                             <Row>
//                                 <Col xs={12} md={4}>
//                                     <Form.Group>
//                                         <Row>
//                                             <Col>
//                                                 <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
//                                                     <InputLabel htmlFor="categoryName-select">Entity</InputLabel>
//                                                     <Select
//                                                         id="categoryName-select"
//                                                         value={selectedcategoryName}
//                                                         onChange={handlecategoryNameChange}
//                                                         label="Entity"
//                                                     >
//                                                         {categoryName.map((category) => (
//                                                             <MenuItem key={category.id} value={category.id}>
//                                                                 {category.name}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                     {validationErrors.entity && (
//                                                         <p style={{ color: 'red' }}>
//                                                             {validationErrors.entity}
//                                                         </p>
//                                                     )}
//                                                 </FormControl>
//                                             </Col>
//                                             <Col>
//                                                 <TextField
//                                                     id="outlined-basic"
//                                                     label="Name"
//                                                     variant="outlined"
//                                                     value={name}
//                                                     onChange={(e) => {
//                                                         setName(e.target.value);
//                                                         setNameError('');
//                                                     }}
//                                                     onKeyPress={(e) => {
//                                                         if (e.key === 'Enter') {
//                                                             handleSearchClick();
//                                                         }
//                                                     }}
//                                                 />
//                                                 {validationErrors.name && (
//                                                     <p style={{ color: 'red' }}>
//                                                         {validationErrors.name}
//                                                     </p>
//                                                 )}
//                                             </Col>
//                                             <Col>
//                                                 <TextField id="outlined-basic" label="Identifier" variant="outlined" />
//                                             </Col>
//                                         </Row>
//                                     </Form.Group>
//                                 </Col>
//                                 <Col xs={12} md={4}>
//                                     <Button type="button" variant="primary" style={{ marginTop: '2%' }} onClick={handleSearchClick}>
//                                         Search
//                                     </Button>
//                                     <Button variant="primary" style={{ marginTop: '2%', marginLeft: '3%' }} onClick={handleAddClick}>
//                                         Add
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </Form>
//                         {searchPerformed && !loading && (Individual.length > 0 || Organization.length > 0 || allData.length > 0) ? (
//                             <Card border='10px'>
//                                 <CardContent>
//                                     {loading && <Spinner animation="border" role="status">
//                                         <span className="visually-hidden">Loading...</span>
//                                     </Spinner>}
//                                     {Individual.length > 0 && (
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell>UserName</TableCell>
//                                                     <TableCell>Name</TableCell>
//                                                     <TableCell>Education</TableCell>
//                                                     <TableCell>Source Link</TableCell>
//                                                     <TableCell>Dob</TableCell>
//                                                     <TableCell>Pan</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {Individual.map((result, index) => (
//                                                     <TableRow key={index} onClick={() => handleEditClick(result.pepId, selectedcategoryName)}>
//                                                         <TableCell>{result.userName}</TableCell>
//                                                         <TableCell>{result.pepName}</TableCell>
//                                                         <TableCell>{result.education}</TableCell>
//                                                         <td>
//                                                             <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
//                                                                 {result.sourceLink}
//                                                             </a>
//                                                         </td>
//                                                         <TableCell>{result.pepDob}</TableCell>
//                                                         <TableCell>{result.pepPan}</TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     )}
//                                     {Organization.length > 0 && (
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell>Original Date Of Appointment</TableCell>
//                                                     <TableCell>Appointment Date</TableCell>
//                                                     <TableCell>Cessation Date</TableCell>
//                                                     <TableCell>Company Name</TableCell>
//                                                     <TableCell>Cinfcrn</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {Organization.map((result, index) => (
//                                                     <TableRow key={index} onClick={() => handleCompanyEditClick(result.companyId, selectedcategoryName)}>
//                                                         <TableCell>{result.originalDateOfAppointment}</TableCell>
//                                                         <TableCell>{result.appointmentDate}</TableCell>
//                                                         <TableCell>{result.cessationDate}</TableCell>
//                                                         <TableCell>{result.companyName}</TableCell>
//                                                         <TableCell>{result.cinfcrn}</TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     )}
//                                     {allData.length > 0 && (
//                                         <Table>
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell>UserName</TableCell>
//                                                     <TableCell>Name</TableCell>
//                                                     <TableCell>Original Date Of Appointment</TableCell>
//                                                     <TableCell>Appointment Date</TableCell>
//                                                     <TableCell>Cessation Date</TableCell>
//                                                     <TableCell>Dob</TableCell>
//                                                     <TableCell>Pan</TableCell>
//                                                     <TableCell>Education</TableCell>
//                                                     <TableCell>Cinfcrn</TableCell>
//                                                     <TableCell>Company Name</TableCell>
//                                                     <TableCell>Source Link</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {allData.map((result, index) => (
//                                                     <TableRow key={index} onClick={() => handleAllEditClick(result.pepId, result.companyId, selectedcategoryName)}>
//                                                         <TableCell>{result.userName}</TableCell>
//                                                         <TableCell>{result.pepName}</TableCell>
//                                                         <TableCell>{result.originalDateOfAppointment}</TableCell>
//                                                         <TableCell>{result.appointmentDate}</TableCell>
//                                                         <TableCell>{result.cessationDate}</TableCell>
//                                                         <TableCell>{result.pepDob}</TableCell>
//                                                         <TableCell>{result.pepPan}</TableCell>
//                                                         <TableCell>{result.education}</TableCell>
//                                                         <TableCell>{result.cinfcrn}</TableCell>
//                                                         <TableCell>{result.companyName}</TableCell>
//                                                         <td>
//                                                             <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
//                                                                 {result.sourceLink}
//                                                             </a>
//                                                         </td>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     )}
//                                     {(Individual.length === 0 && Organization.length === 0 && allData.length === 0) && (
//                                         <p>No data available.</p>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         ) : (
//                             searchPerformed && !loading && (
//                                 (selectedcategoryName && name) ? (
//                                     (validationErrors.entity || validationErrors.name) ? (
//                                         <p style={{ textAlign: 'center', color: 'red' }}>
//                                             {validationErrors.entity || validationErrors.name}
//                                         </p>
//                                     ) : (
//                                         <p style={{ textAlign: 'center' }}>No data available.</p>
//                                     )
//                                 ) : null
//                             )
//                         )}
//                     </Container>
//                 </CardContent>
//             </Card>
//         </>
//     );
// }

// export default Identify;

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Table, Spinner } from 'react-bootstrap';
import Header from '../../layouts/header/header';
import { CardContent, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
import { Identifieds } from '../../data/services/Identify/Identify_payload';
import { useSelector } from 'react-redux';
import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, TableRow, TableCell, TableBody, TableHead } from '@mui/material';

interface CategoryName {
    name: string;
    id: string;
}

interface Individual {
    [x: string]: string;
    userName: string;
    pepName: string;
    education: string;
    sourceLink: string;
    pepDob: string;
    pepPan: string;
}

interface Organization {
    companyId: string;
    originalDateOfAppointment: string;
    appointmentDate: string;
    cessationDate: string;
    companyName: string;
    cinfcrn: string;
}

interface All {
    userName: string;
    pepName: string;
    originalDateOfAppointment: string;
    appointmentDate: string;
    cessationDate: string;
    pepDob: string;
    pepPan: string;
    education: string;
    cinfcrn: string;
    companyName: string;
    sourceLink: string;
    pepId: string;
    companyId: string;
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
    const [Individual, setIndividual] = useState<Individual[]>([]);
    const [Organization, setOrganization] = useState<Organization[]>([]);
    const [allData, setAllData] = useState<All[]>([]);
    const [selectedcategoryName, setSelectedcategoryName] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<{ entity: string, name: string }>({ entity: '', name: '' });

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleAddClick = () => {
        navigate(`/details`);
    };

    useEffect(() => {
        setValidationErrors((prevErrors) => ({
            entity: selectedcategoryName ? '' : prevErrors.entity,
            name: name ? '' : prevErrors.name
        }));
    }, [selectedcategoryName, name]);

    const handlecategoryNameChange = (event: SelectChangeEvent<string>) => {
        setSelectedcategoryName(event.target.value);
    };

    const fetchCategory = async () => {
        try {
            const categoryName = await identifyApiService.getCategory();
            setCategoryName(categoryName);
        } catch (error) {
            console.error("Error fetching Category Name:", error);
        }
    };

    const fetchIndividual = async () => {
        try {
            setOrganization([]);
            setAllData([]);
            const individualResults = await identifyApiService.getIndividual(name);
            setIndividual(Array.isArray(individualResults) ? individualResults : []);
        } catch (error) {
            console.error('Error fetching Individual:', error);
        }
    };

    const fetchOrganization = async () => {
        try {
            setIndividual([]);
            setAllData([]);
            const organizationResults = await identifyApiService.getOrganization(name);
            setOrganization([...organizationResults]);
        } catch (error) {
            console.error('Error fetching Organization:', error);
        }
    };

    const fetchAll = async () => {
        try {
            setIndividual([]);
            setOrganization([]);
            const allResults = await identifyApiService.getAll(name);
            setAllData(allResults);
        } catch (error) {
            console.error('Error fetching All:', error);
        }
    };

    const handleEditClick = (pepId: string, entity: string) => {
        const uid = loginDetails.id;
        navigate(`/ClientView/${pepId}/${uid}/${entity}`);
    };

    const handleCompanyEditClick = (companyId: string, entity: string) => {
        const uid = loginDetails.id;
        navigate(`/ClientView/${companyId}/${uid}/${entity}`);
    };

    const handleAllEditClick = (pepId: string, companyId: string, entity: string) => {
        const uid = loginDetails.id;
        navigate(`/ClientView/${pepId}/${companyId}/${uid}/${entity}`);
    }

    const handleSearchClick = async () => {
        try {
            if (!selectedcategoryName) {
                setValidationErrors((prevErrors) => ({ ...prevErrors, entity: 'Entity is required' }));
            } else {
                setValidationErrors((prevErrors) => ({ ...prevErrors, entity: '' }));
            }
            if (!name) {
                setValidationErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
            } else {
                setValidationErrors((prevErrors) => ({ ...prevErrors, name: '' }));
            }
            if (validationErrors.entity || validationErrors.name) {
                return;
            }
            setLoading(true);
            setSearchPerformed(true);
            if (selectedcategoryName == '1') {
                setOrganization([]);
                setAllData([]);
                await fetchIndividual();
            }
            if (selectedcategoryName == '2') {
                setIndividual([]);
                setAllData([]);
                await fetchOrganization();
            }
            if (selectedcategoryName == '3') {
                setIndividual([]);
                setOrganization([]);
                await fetchAll();
            }
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 style={{ marginTop: '6%', marginLeft: '2%' }}></h4>
            <Header />
            <Card border='10px' style={{ margin: '2%' }}>
                <CardContent>
                    <Container fluid>
                        <Form>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Form.Group>
                                        <Row>
                                            <Col>
                                                <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
                                                    <InputLabel htmlFor="categoryName-select">Entity</InputLabel>
                                                    <Select
                                                        id="categoryName-select"
                                                        value={selectedcategoryName}
                                                        onChange={handlecategoryNameChange}
                                                        label="Entity"
                                                    >
                                                        {categoryName.map((category) => (
                                                            <MenuItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {validationErrors.entity && (
                                                        <p style={{ color: 'red' }}>
                                                            {validationErrors.entity}
                                                        </p>
                                                    )}
                                                </FormControl>
                                            </Col>
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
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSearchClick();
                                                        }
                                                    }}
                                                />
                                                {validationErrors.name && (
                                                    <p style={{ color: 'red' }}>
                                                        {validationErrors.name}
                                                    </p>
                                                )}
                                            </Col>
                                            <Col>
                                                <TextField id="outlined-basic" label="Identifier" variant="outlined" />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Button type="button" variant="primary" style={{ marginTop: '2%' }} onClick={handleSearchClick}>
                                        Search
                                    </Button>
                                    <Button variant="primary" style={{ marginTop: '2%', marginLeft: '3%' }} onClick={handleAddClick}>
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        {searchPerformed && !loading && (Individual.length > 0 || Organization.length > 0 || allData.length > 0) ? (
                            <Card border='10px'>
                                <CardContent>
                                    {loading && <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>}
                                    {Individual.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Education</TableCell>
                                                    <TableCell>Source Link</TableCell>
                                                    <TableCell>Dob</TableCell>
                                                    <TableCell>Pan</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Individual.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleEditClick(result.pepId, selectedcategoryName)}>
                                                        <TableCell>{result.userName}</TableCell>
                                                        <TableCell>{result.pepName}</TableCell>
                                                        <TableCell>{result.education}</TableCell>
                                                        <td>
                                                            <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {result.sourceLink}
                                                            </a>
                                                        </td>
                                                        <TableCell>{result.pepDob}</TableCell>
                                                        <TableCell>{result.pepPan}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {Organization.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Original Date Of Appointment</TableCell>
                                                    <TableCell>Appointment Date</TableCell>
                                                    <TableCell>Cessation Date</TableCell>
                                                    <TableCell>Company Name</TableCell>
                                                    <TableCell>Cinfcrn</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Organization.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleCompanyEditClick(result.companyId, selectedcategoryName)}>
                                                        <TableCell>{result.originalDateOfAppointment}</TableCell>
                                                        <TableCell>{result.appointmentDate}</TableCell>
                                                        <TableCell>{result.cessationDate}</TableCell>
                                                        <TableCell>{result.companyName}</TableCell>
                                                        <TableCell>{result.cinfcrn}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {allData.length > 0 && (
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Original Date Of Appointment</TableCell>
                                                    <TableCell>Appointment Date</TableCell>
                                                    <TableCell>Cessation Date</TableCell>
                                                    <TableCell>Dob</TableCell>
                                                    <TableCell>Pan</TableCell>
                                                    <TableCell>Education</TableCell>
                                                    <TableCell>Cinfcrn</TableCell>
                                                    <TableCell>Company Name</TableCell>
                                                    <TableCell>Source Link</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                allData.map((result, index) => (
                                                    <TableRow key={index} onClick={() => handleAllEditClick(result.pepId, result.companyId, selectedcategoryName)}>
                                                        <TableCell>{result.userName}</TableCell>
                                                        <TableCell>{result.pepName}</TableCell>
                                                        <TableCell>{result.originalDateOfAppointment}</TableCell>
                                                        <TableCell>{result.appointmentDate}</TableCell>
                                                        <TableCell>{result.cessationDate}</TableCell>
                                                        <TableCell>{result.pepDob}</TableCell>
                                                        <TableCell>{result.pepPan}</TableCell>
                                                        <TableCell>{result.education}</TableCell>
                                                        <TableCell>{result.cinfcrn}</TableCell>
                                                        <TableCell>{result.companyName}</TableCell>
                                                        <td>
                                                            <a href={result.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {result.sourceLink}
                                                            </a>
                                                        </td>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                    {(Individual.length === 0 && Organization.length === 0 && allData.length === 0) && (
                                        <p>No data available.</p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            searchPerformed && !loading && (
                                (selectedcategoryName && name) ? (
                                    (validationErrors.entity || validationErrors.name) ? (
                                        <p style={{ textAlign: 'center', color: 'red' }}>
                                            {validationErrors.entity || validationErrors.name}
                                        </p>
                                    ) : (
                                        <p style={{ textAlign: 'center' }}>No data available.</p>
                                    )
                                ) : null
                            )
                        )}
                    </Container>
                </CardContent>
            </Card>
        </>
    );
}

export default Identify;