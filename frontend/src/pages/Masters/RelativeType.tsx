
import React, { useState, useEffect } from 'react';
import {
    TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, Button, IconButton, Box, Dialog, DialogTitle, DialogContent, Container, DialogActions, Snackbar, Card
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../layouts/header/header';
import RelativeTypeApiService from "../../data/services/master/RelativeType/relativetype_api_service";
import { RelativeTypePayload } from '../../data/services/master/RelativeType/relativetype_payload';
import MuiAlert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RelativeType {
    id: string;
    name: string;
}

const RelativeType = () => {
    const [name, setName] = useState('');
    const [selectedrelativetype, setSelectedrelativetype] = useState('');
    const [relativetype, setRelativeType] = useState<RelativeType[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editrelativetypeName, setEditrelativetypeName] = useState('');
    const [editrelativetypeId, setEditrelativetypeId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleterelativetypeId, setDeleterelativetypeId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState('insert');
    const [serialNumber, setSerialNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const authService = new RelativeTypeApiService();

    useEffect(() => {
        fetchRelativeType();
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]);
        }
    }, []);

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
    };

    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setIsErrorOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            showErrorMessage('Please fill out all fields.');
            return;
        }
        try {
            const payload: RelativeTypePayload = {
                name: name
            };
            const response = await authService.doMasterRelativeType(payload);
            setName('');
            fetchRelativeType();
            showSuccessMessage('RelativeType added successfully.');
        } catch (error) {
            console.error("Error adding RelativeType:", error);
        }
    };

    const fetchRelativeType = async () => {
        try {
            const RelativeType = await authService.getRelativeTypeOptions();
            setRelativeType(RelativeType);
            setSerialNumber(page * rowsPerPage + 1);
        } catch (error) {
            console.error("Error fetching RelativeType:", error);
        }
    };

    const handleEditClick = (id: string, name: string) => {
        setEditrelativetypeId(id);
        setEditrelativetypeName(name);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditrelativetypeId('');
        setEditrelativetypeName('');
    };

    const handleEditDialogSave = async () => {
        try {
            const payload: RelativeTypePayload = {
                name: editrelativetypeName
            };
            await authService.updateRelativeType(Number(editrelativetypeId), payload);
            setOpenEditDialog(false);
            setEditrelativetypeId('');
            setEditrelativetypeName('');
            fetchRelativeType();
            showSuccessMessage('RelativeType updated successfully.');
        } catch (error) {
            console.error("Error editing RelativeType:", error);
        }
    };

    const handleUnblock = (id: string) => {
        setSelectedRowId(id);
        setDialogAction('unblock');
        setDialogOpen(true);
    };

    const handleBlock = (id: string) => {
        setSelectedRowId(id);
        setDialogAction('block');
        setDialogOpen(true);
    };

    const handleConfirmDialog = async (confirmed: boolean) => {
        if (confirmed && selectedRowId !== null) {
            if (dialogAction === 'block') {
                await blockRow(selectedRowId);
            } else if (dialogAction === 'unblock') {
                await unblockRow(selectedRowId);
            }
        }
        setSelectedRowId(null);
        setDialogOpen(false);
        setDialogAction(null);
    };

    const blockRow = async (id: string) => {
        try {
            await authService.blockRelativeType(Number(id));
            setBlockedRows([...blockedRows, id]);
            localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
            showSuccessMessage('RelativeType blocked successfully.');
        } catch (error) {
            console.error("Error blocking RelativeType:", error);
        }
    };

    const unblockRow = async (id: string) => {
        try {
            await authService.unblockRelativeType(Number(id));
            setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
            localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
            showSuccessMessage('RelativeType unblocked successfully.');
        } catch (error) {
            console.error("Error unblocking RelativeType:", error);
        }
    };

    const handleDialogCancel = () => {
        setSelectedRowId(null);
        setDialogOpen(false);
        setDialogAction(null);
    };

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        setSerialNumber(newPage * rowsPerPage + 1);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return (
        <>
            <Header />
            <Box m={2}>
                <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "10px" }}>
                    <Box m={4}>
                        <h3>RelativeType</h3>
                        <div className="d-flex justify-content-center">
                            <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                                <div className="card-body">
                                    <ul className="nav gap-2 p-1 small shadow-sm">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === 'insert' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
                                                onClick={() => setActiveTab('insert')}
                                                type="button"
                                            >
                                                INSERT
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === 'edit' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
                                                onClick={() => setActiveTab('edit')}
                                                type="button"
                                            >
                                                EDIT
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === 'unblock' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
                                                onClick={() => setActiveTab('unblock')}
                                                type="button"
                                            >
                                                UNBLOCK
                                            </button>
                                        </li>
                                    </ul>
                                    {activeTab === 'insert' && (
                                        <div className="nav gap-2 p-3 small shadow-sm">
                                            <Grid container spacing={3} alignItems="center" justifyContent="center">
                                                <Grid item xs={12} sm={4}>
                                                    <h6>Add RelativeType</h6>
                                                    <Box>
                                                        <TextField
                                                            id="filled-basic"
                                                            label="RelativeType"
                                                            className="text-field"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            variant="outlined"
                                                            margin="dense"
                                                            size="small"
                                                            fullWidth
                                                        />
                                                    </Box>
                                                    <Grid container spacing={3} alignItems="center" justifyContent="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <Box mt={2}>
                                                                <button type="button" className="btn btn-outline-primary" onClick={handleSubmit} style={{ textAlign: 'center' }}>
                                                                    Submit
                                                                </button>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )}
                                    {activeTab === 'edit' && (
                                        <div className="card-body">
                                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                                <TableContainer component={Card} sx={{ maxHeight: 440 }} style={{ width: "85%", margin: "20px" }}>
                                                    <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
                                                        <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                                            <TableRow className="tableHeading">
                                                                <TableCell>S.No</TableCell>
                                                                <TableCell>Name</TableCell>
                                                                <TableCell>Action</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {relativetype.filter((relativetype) => !blockedRows.includes(relativetype.id))
                                                                .slice(startIndex, endIndex).map((relativetype, index) => (
                                                                    <TableRow key={relativetype.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                        <TableCell>{serialNumber + index}</TableCell>
                                                                        <TableCell>{relativetype.name}</TableCell>
                                                                        <TableCell>
                                                                            <Button
                                                                                onClick={() => handleEditClick(relativetype.id, relativetype.name)}
                                                                                style={{ padding: '1px 1px', marginRight: '4px' }}
                                                                                startIcon={<EditIcon />}
                                                                                variant="outlined"
                                                                                disabled={blockedRows.includes(relativetype.id)}
                                                                            >
                                                                                Edit
                                                                            </Button>

                                                                            <Button variant="outlined" onClick={() => handleBlock(relativetype.id)} style={{ padding: '1px 1px', marginRight: '4px' }}>
                                                                                Block
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <div >
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 20]}
                                                        component="div"
                                                        count={relativetype.length}
                                                        page={page}
                                                        onPageChange={handlePageChange}
                                                        rowsPerPage={rowsPerPage}
                                                        onRowsPerPageChange={handleRowsPerPageChange}
                                                        style={{ marginLeft: "500px" }}
                                                    />
                                                </div>
                                            </Grid>
                                        </div>
                                    )}
                                    {activeTab === 'unblock' && (
                                        <div className="card-body">
                                            <TableContainer component={Card} sx={{ maxHeight: 440 }}>
                                                <Table size="small" aria-label="a dense table" >
                                                    <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                                                        <TableRow className="tableHeading" >
                                                            <TableCell >S.No</TableCell>
                                                            <TableCell >Name</TableCell>
                                                            <TableCell>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {relativetype
                                                            .filter((relativetype) => blockedRows.includes(relativetype.id))
                                                            .slice(startIndex, endIndex)
                                                            .map((relativetype, index) => (
                                                                <TableRow key={relativetype.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                    <TableCell>{serialNumber + index}</TableCell>
                                                                    <TableCell>{relativetype.name}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            onClick={() => handleEditClick(relativetype.id, relativetype.name)}
                                                                            style={{ padding: '1px', marginRight: '4px' }}
                                                                            startIcon={<EditIcon />}
                                                                            variant="outlined"
                                                                            disabled={blockedRows.includes(relativetype.id)}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                        <Button variant="outlined" onClick={() => handleUnblock(relativetype.id)} style={{ padding: '1px 1px', marginRight: '4px' }}>
                                                                            Unblock
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={blockedRows.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    onPageChange={(event, newPage) => setPage(newPage)}
                                                    onRowsPerPageChange={(event) => {
                                                        setRowsPerPage(parseInt(event.target.value, 10));
                                                        setPage(0);
                                                    }}
                                                />
                                            </TableContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Box>
                </Container>
            </Box>
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Edit RelativeType</DialogTitle>
                <DialogContent>
                    <TextField
                        label="RelativeType Name"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={editrelativetypeName}
                        onChange={(e) => setEditrelativetypeName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditDialogSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogOpen} onClose={handleDialogCancel}>
                <DialogTitle>
                    {dialogAction === 'block' ? 'Block State' : 'Unblock State'}
                </DialogTitle>
                <DialogContent>
                    <p>
                        Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this RelativeType?
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmDialog(true)} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={isSuccessOpen}
                autoHideDuration={5000}
                onClose={() => setIsSuccessOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="success"
                    onClose={() => setIsSuccessOpen(false)}
                >
                    {successMessage}
                </MuiAlert>
            </Snackbar>
            <Snackbar
                open={isErrorOpen}
                autoHideDuration={5000}
                onClose={() => setIsErrorOpen(false)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity="error"
                    onClose={() => setIsErrorOpen(false)}
                >
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
};


export default RelativeType;
