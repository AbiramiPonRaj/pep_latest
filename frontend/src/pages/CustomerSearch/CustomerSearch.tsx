// import React, { useEffect, useState } from 'react';
// import Header from '../../layouts/header/header';
// import { Container, Box, TextField, Button, Grid, FormControl, Select, InputLabel, FormGroup, MenuItem, FormControlLabel, Checkbox, ListItemText } from '@mui/material';
// import { Card } from 'react-bootstrap';
// import CustomerSearchApiService from '../../data/services/customerSearch/customerSearch-api-service';
// import { SelectChangeEvent } from '@mui/material';

// interface CustomerSearchData {
//     name: string;
//     matching_score: number;
//     winning_year: number;
//     stateIdList: string[];
// }

// interface State {
//     id: string;
//     state: string;
// }

// const CustomerSearch = () => {

//     const [name, setName] = useState('');
//     const [state, setState] = useState('');
//     const [searchData, setSearchData] = useState<CustomerSearchData[]>([]);
//     const [nameError, setNameError] = useState<string>('');
//     const customerSearchApiService = new CustomerSearchApiService();
//     const [states, setStates] = useState<State[]>([]);
//     const [selectedStates, setSelectedStates] = useState<string[]>([]);

//     useEffect(() => {
//         fetchStates();
//     }, []);

//     const fetchStates = async () => {
//         try {
//             const fetchedStates = await customerSearchApiService.getState();
//             setStates(fetchedStates);
//         } catch (error) {
//             console.error("Error fetching states:", error);
//         }
//     };

//     const handleStateChange = (stateId: string, checked: boolean) => {
//         setSelectedStates(prevSelected => {
//             if (checked) {
//                 return [...prevSelected, stateId];
//             } else {
//                 return prevSelected.filter(id => id !== stateId);
//             }
//         });
//     };

//     const handleSearch = async () => {
//         if (!name.trim()) {
//             setNameError('Name is required');
//         } else {
//             setNameError('');
//         }
//         const payload = {
//             stateIdList: Array.isArray(selectedStates) ? selectedStates.map(Number) : [selectedStates].map(Number),
//             matching_score: 0,
//             name: name,
//         };
//         try {
//             const responseData = await customerSearchApiService.saveCustomerSearch(payload);
//             const sortedData = responseData.sort((a: { matching_score: number; }, b: { matching_score: number; }) => b.matching_score - a.matching_score);
//             setSearchData(sortedData);
//         } catch (error) {
//             console.error('Error in Customer Search:', error);
//         }
//     };

//     const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSearch();
//         }
//     };

//     const tableStyle: React.CSSProperties = {
//         width: '100%',
//         borderCollapse: 'collapse',
//         marginTop: '2%',
//     };

//     const thStyle: React.CSSProperties = {
//         border: '1px solid #dddddd',
//         padding: '8px',
//         textAlign: 'left',
//         backgroundColor: '#f2f2f2',
//         position: 'sticky',
//         top: '0',
//         zIndex: 1,
//     };

//     const tdStyle: React.CSSProperties = {
//         border: '1px solid #dddddd',
//         padding: '8px',
//         textAlign: 'left',
//     };

//     return (
//         <>
//             <Header />
//             <Box m={6}>
//                 <Card style={{ margin: '9% 6% 6% 10%', padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginLeft: '10%' }}>
//                     <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
//                         <Box m={4}>
//                             <h3></h3>
//                             <form>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12} sm={6} md={4}>
//                                         <Card style={{ padding: '6%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginLeft: '10%' }}>
//                                             <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
//                                                 <h6>State</h6>
//                                                 <FormGroup>
//                                                     {states.map((state) => (
//                                                         <FormControlLabel
//                                                             key={state.id}
//                                                             control={
//                                                                 <Checkbox
//                                                                     checked={selectedStates.includes(state.id)}
//                                                                     onChange={(e) => handleStateChange(state.id, e.target.checked)}
//                                                                 />
//                                                             }
//                                                             label={state.state}
//                                                         />
//                                                     ))}
//                                                 </FormGroup>
//                                             </FormControl>
//                                         </Card>
//                                     </Grid>
//                                     <Grid item xs={12} sm={6} md={4}>
//                                         <TextField
//                                             fullWidth
//                                             label="Name"
//                                             variant="outlined"
//                                             style={{ marginBottom: '10px' }}
//                                             value={name}
//                                             onChange={(e) => {
//                                                 setName(e.target.value);
//                                                 setNameError('');
//                                             }}
//                                             onKeyDown={handleKeyPress}
//                                         />
//                                         {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
//                                     </Grid>
//                                     <Grid item xs={12} sm={6} md={4}>
//                                         <Grid item style={{ marginTop: '2%' }}>
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 onClick={handleSearch}
//                                                 fullWidth
//                                                 size="small"
//                                                 style={{ width: '80px', fontSize: '12px' }}
//                                             >
//                                                 Search
//                                             </Button>
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                             </form>
//                             {searchData.length > 0 ? (
//                                 <div>
//                                     <table style={tableStyle}>
//                                         <thead>
//                                             <tr>
//                                                 <th style={thStyle}>Name</th>
//                                                 <th style={thStyle}>Winning Year</th>
//                                                 <th style={thStyle}>Matching Score</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {searchData.map((item, index) => (
//                                                 <tr key={index}>
//                                                     <td style={tdStyle}>{item.name}</td>
//                                                     <td style={tdStyle}>{item.winning_year}</td>
//                                                     <td style={tdStyle}>{item.matching_score}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             ) : (
//                                 <div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
//                                     No data available
//                                 </div>
//                             )}
//                         </Box>
//                     </Container>
//                 </Card>
//             </Box>
//         </>
//     );
// };


// export default CustomerSearch;

// import React, { useEffect, useState } from 'react';
// import Header from '../../layouts/header/header';
// import { Container, Box, TextField, Button, Grid, FormControl, Select, InputLabel, FormGroup, MenuItem, FormControlLabel, Checkbox, ListItemText } from '@mui/material';
// import { Card } from 'react-bootstrap';
// import CustomerSearchApiService from '../../data/services/customerSearch/customerSearch-api-service';
// import { SelectChangeEvent } from '@mui/material';

// interface CustomerSearchData {
//     name: string;
//     matching_score: number;
//     winning_year: number;
//     stateIdList: string[];
// }

// interface State {
//     id: string;
//     state: string;
// }

// const CustomerSearch = () => {

//     const [name, setName] = useState('');
//     const [state, setState] = useState('');
//     const [searchData, setSearchData] = useState<CustomerSearchData[]>([]);
//     const [nameError, setNameError] = useState<string>('');
//     const customerSearchApiService = new CustomerSearchApiService();
//     const [states, setStates] = useState<State[]>([]);
//     const [selectedStates, setSelectedStates] = useState<string[]>([]);

//     useEffect(() => {
//         fetchStates();
//     }, []);

//     const fetchStates = async () => {
//         try {
//             const fetchedStates = await customerSearchApiService.getState();
//             setStates(fetchedStates);
//         } catch (error) {
//             console.error("Error fetching states:", error);
//         }
//     };

//     const handleStateChange = (stateId: string, checked: boolean) => {
//         setSelectedStates(prevSelected => {
//             if (checked) {
//                 return [...prevSelected, stateId];
//             } else {
//                 return prevSelected.filter(id => id !== stateId);
//             }
//         });
//     };

//     const handleSearch = async () => {
//         if (!name.trim()) {
//             setNameError('Name is required');
//         } else {
//             setNameError('');
//         }
//         const payload = {
//             stateIdList: Array.isArray(selectedStates) ? selectedStates.map(Number) : [selectedStates].map(Number),
//             matching_score: 0,
//             name: name,
//         };
//         try {
//             const responseData = await customerSearchApiService.saveCustomerSearch(payload);
//             const sortedData = responseData.sort((a: { matching_score: number; }, b: { matching_score: number; }) => b.matching_score - a.matching_score);
//             setSearchData(sortedData);
//         } catch (error) {
//             console.error('Error in Customer Search:', error);
//         }
//     };

//     const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSearch();
//         }
//     };

//     const tableStyle: React.CSSProperties = {
//         width: '100%',
//         borderCollapse: 'collapse',
//         marginTop: '2%',
//     };

//     const thStyle: React.CSSProperties = {
//         border: '1px solid #dddddd',
//         padding: '8px',
//         textAlign: 'left',
//         backgroundColor: '#f2f2f2',
//         position: 'sticky',
//         top: '0',
//         zIndex: 1,
//     };

//     const tdStyle: React.CSSProperties = {
//         border: '1px solid #dddddd',
//         padding: '8px',
//         textAlign: 'left',
//     };

//     return (
//         <>
//             <Header />
//             <Box m={6}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6} md={4}>
//                         <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '14%', width: '50%', marginLeft: '-9%' }}>
//                             <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
//                                 <h4 style={{ textAlign: 'center' }}>State</h4>
//                                 <FormGroup>
//                                     {states.map((state) => (
//                                         <FormControlLabel
//                                             key={state.id}
//                                             control={
//                                                 <Checkbox
//                                                     checked={selectedStates.includes(state.id)}
//                                                     onChange={(e) => handleStateChange(state.id, e.target.checked)}
//                                                 />
//                                             }
//                                             label={state.state}
//                                         />
//                                     ))}
//                                 </FormGroup>
//                             </FormControl>
//                         </Card>
//                     </Grid>
//                     <Card style={{ margin: '9% 6% 6% 10%', padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '6%', width: '78%', marginLeft: '-18%' }}>
//                         <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
//                             <Box m={4}>
//                                 <h3></h3>
//                                 <form>
//                                     <Grid item xs={12} sm={6} md={4}>
//                                         <TextField
//                                             fullWidth
//                                             label="Name"
//                                             variant="outlined"
//                                             style={{ marginBottom: '10px' }}
//                                             value={name}
//                                             onChange={(e) => {
//                                                 setName(e.target.value);
//                                                 setNameError('');
//                                             }}
//                                             onKeyDown={handleKeyPress}
//                                         />
//                                         {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
//                                     </Grid>
//                                     <Grid item xs={12} sm={6} md={4}>
//                                         <Grid item style={{ marginTop: '2%' }}>
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 onClick={handleSearch}
//                                                 fullWidth
//                                                 size="small"
//                                                 style={{ width: '80px', fontSize: '12px', marginLeft: '108%', marginTop: '-34%' }}
//                                             >
//                                                 Search
//                                             </Button>
//                                         </Grid>
//                                     </Grid>

//                                 </form>
//                                 {searchData.length > 0 ? (
//                                     <div>
//                                         <table style={tableStyle}>
//                                             <thead>
//                                                 <tr>
//                                                     <th style={thStyle}>Name</th>
//                                                     <th style={thStyle}>Winning Year</th>
//                                                     <th style={thStyle}>Matching Score</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {searchData.map((item, index) => (
//                                                     <tr key={index}>
//                                                         <td style={tdStyle}>{item.name}</td>
//                                                         <td style={tdStyle}>{item.winning_year}</td>
//                                                         <td style={tdStyle}>{item.matching_score}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 ) : (
//                                     <div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
//                                         No data available
//                                     </div>
//                                 )}
//                             </Box>
//                         </Container>
//                     </Card>
//                 </Grid>
//             </Box >
//         </>
//     );

// };


// export default CustomerSearch;
import React, { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import { Container, Box, TextField, Button, Grid, FormControl, Select, InputLabel, FormGroup, MenuItem, FormControlLabel, Checkbox, ListItemText } from '@mui/material';
import { Card } from 'react-bootstrap';
import CustomerSearchApiService from '../../data/services/customerSearch/customerSearch-api-service';
import { SelectChangeEvent } from '@mui/material';

interface CustomerSearchData {
    name: string;
    matching_score: number;
    winning_year: number;
    stateIdList: string[];
    state: string;
}

interface State {
    id: string;
    state: string;
}

const CustomerSearch = () => {

    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [searchData, setSearchData] = useState<CustomerSearchData[]>([]);
    const [nameError, setNameError] = useState<string>('');
    const customerSearchApiService = new CustomerSearchApiService();
    const [states, setStates] = useState<State[]>([]);
    const [selectedStates, setSelectedStates] = useState<string[]>([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const fetchedStates = await customerSearchApiService.getState();
            setStates(fetchedStates);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const handleStateChange = (stateId: string, checked: boolean) => {
        setSelectedStates(prevSelected => {
            if (checked) {
                return [...prevSelected, stateId];
            } else {
                return prevSelected.filter(id => id !== stateId);
            }
        });
    };

    const handleSearch = async () => {
        if (!name.trim()) {
            setNameError('Name is required');
        } else {
            setNameError('');
        }
        const payload = {
            stateIdList: Array.isArray(selectedStates) ? selectedStates.map(Number) : [selectedStates].map(Number),
            matching_score: 0,
            name: name,
        };
        try {
            const responseData = await customerSearchApiService.saveCustomerSearch(payload);
            const sortedData = responseData.sort((a: { matching_score: number; }, b: { matching_score: number; }) => b.matching_score - a.matching_score);
            setSearchData(sortedData);
        } catch (error) {
            console.error('Error in Customer Search:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleSelectAll = () => {
        if (selectAllChecked) {
            setSelectedStates([]);
        } else {
            const allStateIds = states.map(state => state.id);
            setSelectedStates(allStateIds);
        }
        setSelectAllChecked(prevState => !prevState);
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '2%',
    };

    const thStyle: React.CSSProperties = {
        border: '1px solid #dddddd',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
        position: 'sticky',
        top: '0',
        zIndex: 1,
    };

    const tdStyle: React.CSSProperties = {
        border: '1px solid #dddddd',
        padding: '8px',
        textAlign: 'left',
    };

    return (
        <>
            <Header />
            <Box m={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card style={{ padding: '4%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '14%', width: '50%', marginLeft: '-9%' }}>
                            <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
                                <h4 style={{ textAlign: 'center' }}>State</h4>
                                <Button variant="contained" color="primary" fullWidth size="small" onClick={handleSelectAll} style={{ marginBottom: '10px' }}> {selectAllChecked ? 'Unselect All' : 'Select All'}</Button>
                                <FormGroup>
                                    {states.map((state) => (
                                        <FormControlLabel
                                            key={state.id}
                                            control={
                                                <Checkbox
                                                    checked={selectedStates.includes(state.id)}
                                                    onChange={(e) => handleStateChange(state.id, e.target.checked)}
                                                />
                                            }
                                            label={state.state}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Card>
                    </Grid>
                    <Card style={{ margin: '9% 6% 6% 10%', padding: '1%', boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px', marginTop: '6%', width: '78%', marginLeft: '-18%' }}>
                        <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
                            <Box m={4}>
                                <h3></h3>
                                <form>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            variant="outlined"
                                            style={{ marginBottom: '10px' }}
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                setNameError('');
                                            }}
                                            onKeyDown={handleKeyPress}
                                        />
                                        {nameError && <div style={{ color: 'red' }}>{nameError}</div>}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Grid item style={{ marginTop: '2%' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSearch}
                                                fullWidth
                                                size="small"
                                                style={{ width: '80px', fontSize: '12px', marginLeft: '108%', marginTop: '-34%' }}
                                            >
                                                Search
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </form>
                                {searchData.length > 0 ? (
                                    <div>
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>Name</th>
                                                    <th style={thStyle}>Winning Year</th>
                                                    <th style={thStyle}>Matching Score</th>
                                                    <th style={thStyle}>State</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {searchData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td style={tdStyle}>{item.name}</td>
                                                        <td style={tdStyle}>{item.winning_year}</td>
                                                        <td style={tdStyle}>{item.matching_score}</td>
                                                        <td style={tdStyle}>{item.state}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
                                        No data available
                                    </div>
                                )}
                            </Box>
                        </Container>
                    </Card>
                </Grid>
            </Box >
        </>
    );

};


export default CustomerSearch;






