

// import React, { useState, useEffect } from 'react';
// import {
//     TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Grid, Button, IconButton, Box, Dialog, DialogTitle, DialogContent, Container, DialogActions, Snackbar,Card
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Header from '../../layouts/header/header';
// import MuiAlert from '@mui/material/Alert';
// import { IdTypePayload } from "../../data/services/master/IdType/idtype_payload";
// import IdTypeApiService from "../../data/services/master/IdType/idtype_api_service";
// import TablePagination from '@mui/material/TablePagination';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// interface IdType {
//     id: string;
//     idsname : string;
// }

// const IdType = () => {
//     const [name, setName] = useState('');
//     const [selectedIdType, setSelectedIdType] = useState('');
//     const [IdType, setIdType] = useState<IdType[]>([]);
//     const [openEditDialog, setOpenEditDialog] = useState(false);
//     const [editIdTypeName, setEditIdTypeName] = useState('');
//     const [editIdTypeId, setEditIdTypeId] = useState('');
//     const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//     const [deleteIdTypeId, setDeleteIdTypeId] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [activeTab, setActiveTab] = useState('insert'); // Track the active tab
//     const [serialNumber, setSerialNumber] = useState(1);
//     const [deleteIdType, setDeletedIdType] = useState<IdType[]>([]); // Track deleted ministries
//     const authService = new IdTypeApiService();
//     useEffect(() => {
//         fetchidypes();
//     }, []);

//     const showSuccessMessage = (message: string) => {
//         setSuccessMessage(message);
//         setIsSuccessOpen(true);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             const payload: IdTypePayload = {
//                 idsname: name
//             };

//             const response = await authService.doMasterIdType(payload);

//             setName('');
//             fetchidypes();
//             showSuccessMessage('IdType added successfully.');
//         } catch (error) {
//             console.error("Error adding IdType:", error);
//         }
//     };

//     const fetchidypes = async () => {
//         try {
//             const IdType = await authService.getIdTypes();
//             setIdType(IdType);
//             setSerialNumber(page * rowsPerPage + 1);
//         } catch (error) {
//             console.error("Error fetching IdType:", error);
//         }
//     };

//     const handleEditClick = (id: string, name: string) => {
//         setEditIdTypeId(id);
//         setEditIdTypeName(name);
//         setOpenEditDialog(true);
//     };

//     const handleEditDialogClose = () => {
//         setOpenEditDialog(false);
//         setEditIdTypeId('');
//         setEditIdTypeName('');
//     };

//     const handleEditDialogSave = async () => {
//         try {
//             const payload: IdTypePayload = {
//                 idsname: editIdTypeName
//             };
//             await authService.updateIdTypes(Number(editIdTypeId), payload);
//             setOpenEditDialog(false);
//             setEditIdTypeId('');
//             setEditIdTypeName('');
//             fetchidypes();
//             showSuccessMessage('IdType updated successfully.');
//         } catch (error) {
//             console.error("Error editing IdType:", error);
//         }
//     };
//     const handleInputKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             // Trigger the form submission
//             handleSubmit(e as React.FormEvent);
//         }
//     };

//     const handleDeleteClick = (id: string) => {
//         setDeleteIdTypeId(id);
//         setOpenDeleteDialog(true);
//     };

//     const handleDeleteDialogClose = () => {
//         setOpenDeleteDialog(false);
//         setDeleteIdTypeId('');
//     };

//     const handleDeleteDialogConfirm = async () => {
//         try {
//             await authService.deleteIdTypes(Number(deleteIdTypeId));
    
//             // Update the deleted IdType list
//             const deletedIdType = IdType.find(idType => idType.id === deleteIdTypeId);
//             if (deletedIdType) {
//                 setDeletedIdType([...deleteIdType, deletedIdType]);
//             }
    
//             setOpenDeleteDialog(false);
//             setDeleteIdTypeId('');
//             fetchidypes();
//             showSuccessMessage('IdType deleted successfully.');
//         } catch (error) {
//             console.error("Error deleting IdType:", error);
//         }
//     };
    

  
//     const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
//         setPage(newPage);
//         setSerialNumber(newPage * rowsPerPage + 1);
//     };

//     const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const startIndex = page * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;

//     return (
//         <>
//             <Header />
//             <Box m={2}>
//                 <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "10px" }}>
//                     <Box m={4}>
//                         <h3>IdType</h3>
//                         <div className="d-flex justify-content-center">
//                             <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
//                                 <div className="card-body">
//                                     <ul className="nav gap-2 p-1 small shadow-sm">
//                                         <li className="nav-item" role="presentation">
//                                             <button
//                                                 className={`nav-link ${activeTab === 'insert' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
//                                                 onClick={() => setActiveTab('insert')}
//                                                 type="button"
//                                             >
//                                                 INSERT
//                                             </button>
//                                         </li>
//                                         <li className="nav-item" role="presentation">
//                                             <button
//                                                 className={`nav-link ${activeTab === 'edit' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
//                                                 onClick={() => setActiveTab('edit')}
//                                                 type="button"
//                                             >
//                                                 EDIT
//                                             </button>
//                                         </li>
//                                         <li className="nav-item" role="presentation">
//                                             <button
//                                                 className={`nav-link ${activeTab === 'unblock' ? 'active btn btn-outline-primary' : 'btn btn-outline-primary'}`}
//                                                 onClick={() => setActiveTab('unblock')}
//                                                 type="button"
//                                             >
//                                                 UNBLOCK
//                                             </button>
//                                         </li>
//                                     </ul>
//                                     {activeTab === 'insert' && (
//                                         <div className="nav gap-2 p-3 small shadow-sm">
//                                             <Grid container spacing={3} alignItems="center" justifyContent="center">
//                                                 <Grid item xs={12} sm={4}>
//                                                     <h6>Add IdType</h6>
//                                                     <Box>
//                                                         <TextField
//                                                             id="filled-basic"
//                                                             label="IdType"
//                                                             className="text-field"
//                                                             value={name}
//                                                             onChange={(e) => setName(e.target.value)}
//                                                             variant="outlined"
//                                                             margin="dense"
//                                                             size="small"
//                                                             fullWidth
//                                                             onKeyDown={handleInputKeyDown}
//                                                         />
//                                                     </Box>
//                                                     <Grid container spacing={3} alignItems="center" justifyContent="center">
//                                                         <Grid item xs={12} sm={4}>
//                                                             <Box mt={2}>
//                                                                 <button type="button" className="btn btn-outline-primary" onClick={handleSubmit} style={{ textAlign: 'center' }}>
//                                                                     Submit
//                                                                 </button>
//                                                             </Box>
//                                                         </Grid>
//                                                     </Grid>
//                                                 </Grid>
//                                             </Grid>
//                                         </div>
//                                     )}
//                                     {activeTab === 'edit' && (
//                                         <div className="card-body">
//                                             <Grid container spacing={1} alignItems="center" justifyContent="center">
//                                                 <TableContainer component={Card} sx={{ maxHeight: 440 }} style={{ width: "85%", margin: "20px" }}>
//                                                     <Table size="small" aria-label="a dense table" style={{ margin: '0 auto' }}>
//                                                         <TableHead sx={{ backgroundColor: '#cccdd1' }}>
//                                                             <TableRow className="tableHeading">
//                                                                 <TableCell>S.No</TableCell>
//                                                                 <TableCell>Name</TableCell>
//                                                                 <TableCell>Action</TableCell>
//                                                             </TableRow>
//                                                         </TableHead>
//                                                         <TableBody>
//                                                             {IdType.slice(startIndex, endIndex).map((IdType, index) => (
//                                                                 <TableRow key={IdType.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
//                                                                     <TableCell>{serialNumber + index}</TableCell>
//                                                                     <TableCell>{IdType.idsname}</TableCell>
//                                                                     <TableCell>
//                                                                         <IconButton onClick={() => handleEditClick(IdType.id, IdType.idsname)} style={{ padding: '1px', marginRight: '4px' }}>
//                                                                             <EditIcon style={{ color: "#0d6efd" }}  />
//                                                                         </IconButton>
//                                                                         <IconButton
//                                                                             onClick={() => handleDeleteClick(IdType.id)} style={{ padding: '1px', marginRight: '4px' }}
//                                                                         >
//                                                                             <DeleteIcon style={{ color: 'red' }} />
//                                                                         </IconButton>
//                                                                     </TableCell>
//                                                                 </TableRow>
//                                                             ))}
//                                                         </TableBody>
//                                                     </Table>
//                                                 </TableContainer>
//                                                 <div >
//                                                     <TablePagination
//                                                         rowsPerPageOptions={[5, 10, 20]}
//                                                         component="div"
//                                                         count={IdType.length}
//                                                         page={page}
//                                                         onPageChange={handlePageChange}
//                                                         rowsPerPage={rowsPerPage}
//                                                         onRowsPerPageChange={handleRowsPerPageChange}
//                                                         style={{ marginLeft: "500px" }}
//                                                     />
//                                                 </div>
//                                             </Grid>
//                                         </div>
//                                     )}
//                                     {activeTab === 'unblock' && (
//                                         <div className="card-body">
//                                             <TableContainer component={Card} sx={{ maxHeight: 440 }}>
//                                                 <Table size="small" aria-label="a dense table" >
//                                                     <TableHead sx={{ backgroundColor: '#cccdd1' }}>
//                                                         <TableRow className="tableHeading" >
//                                                             <TableCell >S.No</TableCell>
//                                                             <TableCell >Name</TableCell>
//                                                             <TableCell>Action</TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {deleteIdType.map((IdType, index) => (
//                                                             <TableRow key={IdType.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
//                                                                 <TableCell>{serialNumber + index}</TableCell>
//                                                                 <TableCell>{IdType.idsname}</TableCell>
//                                                                 <TableCell>
//                                                                     {/* Add your "Unblock" button or action here */}
//                                                                 </TableCell>
//                                                             </TableRow>
//                                                         ))}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </Box>
//                 </Container>
//             </Box>
//             <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
//                 <DialogTitle>Edit IdType</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="IdType Name"
//                         fullWidth
//                         variant="outlined"
//                         margin="dense"
//                         value={editIdTypeName}
//                         onChange={(e) => setEditIdTypeName(e.target.value)}
                    
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleEditDialogClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleEditDialogSave} color="primary">
//                         Save
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
//                 <DialogTitle>Delete Ministry</DialogTitle>
//                 <DialogContent>
//                     Are you sure you want to delete this ministry?
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDeleteDialogClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleDeleteDialogConfirm} color="secondary">
//                         Delete
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             <Snackbar
//                 open={isSuccessOpen}
//                 autoHideDuration={5000}
//                 onClose={() => setIsSuccessOpen(false)}
//                 anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                 }}
//             >
//                 <MuiAlert
//                     elevation={6}
//                     variant="filled"
//                     severity="success"
//                     onClose={() => setIsSuccessOpen(false)}
//                 >
//                     {successMessage}
//                 </MuiAlert>
//             </Snackbar>
//         </>
//     );
// };

// export default IdType;


import React, { useState, useEffect } from 'react';
import {
    TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Grid, Button, IconButton, Box, Dialog, DialogTitle, DialogContent, Container, DialogActions, Snackbar, Card
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../layouts/header/header';
import MuiAlert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import IdTypeApiService from '../../data/services/master/IdType/idtype_api_service';
import { IdTypePayload } from '../../data/services/master/IdType/idtype_payload';
interface IdType {
    id: string;
    idsname: string;
}

const IdType = () => {
    const [name, setName] = useState('');
    const [selectedIdType, setSelectedIdType] = useState('');
    const [IdType, setCountries] = useState<IdType[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editIdTypeName, setEditIdTypeName] = useState('');
    const [editIdTypeId, setEditIdTypeId] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteIdTypeId, setDeleteIdTypeId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState('insert'); // Track the active tab
    const [serialNumber, setSerialNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [blockedRows, setBlockedRows] = useState<string[]>([]);
    const authService = new IdTypeApiService();
    useEffect(() => {
        fetchIdType();
        const storedBlockedRows = localStorage.getItem('blockedRows');
        if (storedBlockedRows) {
            setBlockedRows(JSON.parse(storedBlockedRows) as string[]); // Parse as an array of strings
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
            return; // Prevent further execution of the function
        }
        try {
            const payload: IdTypePayload = {
                idsname: name
            };

            const response = await authService.doMasterIdType(payload);

            setName('');
            fetchIdType();
            showSuccessMessage('IdType added successfully.');
        } catch (error) {
            console.error("Error adding IdType:", error);
        }
    };

    const fetchIdType = async () => {
        try {
            const IdType = await authService.getIdTypes();
            setCountries(IdType);
            setSerialNumber(page * rowsPerPage + 1);
        } catch (error) {
            console.error("Error fetching IdType:", error);
        }
    };

    const handleEditClick = (id: string, name: string) => {
        setEditIdTypeId(id);
        setEditIdTypeName(name);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setEditIdTypeId('');
        setEditIdTypeName('');
    };

    const handleEditDialogSave = async () => {
        try {
            const payload: IdTypePayload = {
                idsname: editIdTypeName
            };
            await authService.updateIdTypes(Number(editIdTypeId), payload);
            setOpenEditDialog(false);
            setEditIdTypeId('');
            setEditIdTypeName('');
            fetchIdType();
            showSuccessMessage('IdType updated successfully.');
        } catch (error) {
            console.error("Error editing IdType:", error);
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
            await authService.blockIdType(Number(id));
            setBlockedRows([...blockedRows, id]);
            localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
            showSuccessMessage('IdType blocked successfully.');

        } catch (error) {
            console.error("Error blocking IdType:", error);
        }
    };

    const unblockRow = async (id: string) => {
        try {
            await authService.unblockIdType(Number(id));
            setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
            localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
            showSuccessMessage('IdType unblocked successfully.');
        } catch (error) {
            console.error("Error unblocking IdType:", error);
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
                        <h3>IdType</h3>
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
                                                    <h6>Add IdType</h6>
                                                    <Box>
                                                        <TextField
                                                            id="filled-basic"
                                                            label="IdType"
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
                                                            {IdType.filter((idtype) => !blockedRows.includes(idtype.id))
                                                                .slice(startIndex, endIndex).map((idtype, index) => (
                                                                    <TableRow key={idtype.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                        <TableCell>{serialNumber + index}</TableCell>
                                                                        <TableCell>{idtype.idsname}</TableCell>
                                                                        <TableCell>
                                                                            <Button
                                                                                onClick={() => handleEditClick(idtype.id, idtype.idsname)}
                                                                                style={{ padding: '1px', marginRight: '4px' }}
                                                                                startIcon={<EditIcon />}
                                                                                variant="outlined"
                                                                                disabled={blockedRows.includes(idtype.id)}
                                                                            >
                                                                                Edit
                                                                            </Button>

                                                                            <Button variant="outlined" onClick={() => handleBlock(idtype.id)}>
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
                                                        count={IdType.length}
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
                                                        {IdType
                                                            .filter((idtype) => blockedRows.includes(idtype.id))
                                                            .slice(startIndex, endIndex)
                                                            .map((idtype, index) => (
                                                                <TableRow key={idtype.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                                                    <TableCell>{serialNumber + index}</TableCell>
                                                                    <TableCell>{idtype.idsname}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            onClick={() => handleEditClick(idtype.id, idtype.idsname)}
                                                                            style={{ padding: '1px', marginRight: '4px' }}
                                                                            startIcon={<EditIcon />}
                                                                            variant="outlined"
                                                                            disabled={blockedRows.includes(idtype.id)}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                        <Button variant="outlined" onClick={() => handleUnblock(idtype.id)}>
                                                                            Unblock
                                                                        </Button>                                                                </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                                <TablePagination
                rowsPerPageOptions={[5, 10, 25]} // You can customize the available rows per page options
                component="div"
                count={blockedRows.length} // Total number of rows
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
                <DialogTitle>Edit IdType</DialogTitle>
                <DialogContent>
                    <TextField
                        label="IdType Name"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={editIdTypeName}
                        onChange={(e) => setEditIdTypeName(e.target.value)}
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
            Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this state?
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

export default IdType;
