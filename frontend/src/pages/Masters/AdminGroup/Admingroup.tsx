import React, { useState, useEffect } from 'react';
import {
    TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, FormControl, InputLabel, Select, MenuItem, Button, Box, Dialog, DialogTitle,
    DialogContent, Container, DialogActions, DialogContentText
} from '@mui/material'
import Header from '../../../layouts/header/header';
import AdmingroupApiService from '../../../data/services/master/AdminGroup/admingroup_api_service';
import { AdmingroupPayload } from '../../../data/services/master/AdminGroup/admingroup_payload';

interface  Admingroup {
    id: string;
    moduleUrl:String;
    name: string;
}

const Admingroup = () => {
    const [name, setName] = useState('');
    const [moduleUrl, setModuleUrl] = useState(''); 
    const [selectedAdmingroup, setSelectedAdmingroup] = useState('');
    const [Admingroup, setAdmingroup] = useState<Admingroup[]>([]);   
    const authService = new AdmingroupApiService();

    useEffect(() => {
        fetchrelativetypes();
       
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 

        try {
            const payload: AdmingroupPayload = {
                name: name,
                moduleUrl: moduleUrl
            };

            // Send the payload to your API
            const response = await authService.doMasterAdmingroup(payload);
            // console.log("Add Employee Response:", response);

            // Optionally, reset the form field after a successful submission
            setName('');
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };
    const fetchrelativetypes = async () => {
        try {
            let Admingroup = await authService.getAdmingroup(); // Change 'relativetypeService' to 'authService'
            setAdmingroup(Admingroup);
            // console.log(Admingroup);
        } catch (error) {
            // Handle errors, e.g., display an error message
        }
    };
    
    return (
        <>
            <Header />
            <Box > {/* Outer Box with full height */}
                <Container>
                    <h3> Admingroup</h3>
                    <br/>
                        <Grid container spacing={3} alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    id="filled-basic"
                                    label="Admingroup"
                                    className="txt-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    variant="outlined"
                                    margin="dense"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Box mt={4}>
                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={2} >
                                    <Button variant="contained" 
                                    onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box mt={4} display="flex" justifyContent="center">
                            <TableContainer component={Paper} style={{ width: '50%' }}>                                   
                               <Table>
                                   <TableHead>
                                       <TableRow>
                                           <TableCell>Admingroup Name</TableCell>
                                           <TableCell>Admingroup ModuleUrl</TableCell>

                                           <TableCell>Action</TableCell>
                                       </TableRow>
                                   </TableHead>
                                   <TableBody>
                                       {Admingroup.map((group) => (
                                           <TableRow key={group.id}>
                                         <TableCell>{group.name}</TableCell>

                                               <TableCell>{group.moduleUrl}</TableCell>
                                           </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                           </TableContainer>
                           </Box>
                 
                </Container>
             
            </Box>
        </>
    );
};

export default Admingroup;
