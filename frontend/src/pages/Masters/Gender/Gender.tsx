import React, { useState, useEffect } from 'react';
import {
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, TablePagination
} from '@mui/material';

import { Card, Container } from 'react-bootstrap';
import Header from '../../../layouts/header/header';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import GenderApiService from '../../../data/services/master/Gender/gender_api_service';
import { GenderPayload } from '../../../data/services/master/Gender/gender_payload';

interface Gender {
  name(id: string, name: any): void;
  id: string;
  title: string;
  gender: string;
}
const Gender = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [genders, setGenders] = useState<Gender[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [activeTab, setActiveTab] = useState('insert');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serialNumber, setSerialNumber] = useState(1);
  const [deletedGenders, setDeletedGenders] = useState<string[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editGenderName, setEditGenderName] = useState('');
  const [editGenderGender, setEditGenderGender] = useState(''); 
  const [editGenderId, setEditGenderId] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteGenderId, setDeleteGenderId] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [blockedRows, setBlockedRows] = useState<string[]>([]);
  const authService = new GenderApiService();

  useEffect(() => {
    fetchGenders(); 
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

  const fetchGenders = async () => { 
    try {
      const fetchedGenders = await authService.getGender();
      setGenders(fetchedGenders);
    } catch (error) {
      console.error("Error fetching genders:", error);
    }
  };

  const handleEditClick = (id: string, name: string, gender: string) => { 
    setEditGenderId(id);
    setEditGenderName(name);
    setEditGenderGender(gender); 
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditGenderId('');
    setEditGenderName('');
    setEditGenderGender('');
  };

  const handleEditDialogSave = async () => {
    try {
      const payload: GenderPayload = {
        title: editGenderName,
        gender: editGenderGender, 
      };

      await authService.updateGender(Number(editGenderId), payload);

      setOpenEditDialog(false);
      setEditGenderId('');
      setEditGenderName('');
      setEditGenderGender(''); 
      fetchGenders();
      showSuccessMessage('Gender updated successfully.');
    } catch (error) {
      console.error("Error editing Gender:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gender) {
      showErrorMessage('Please fill out all fields.');
      return;
    }
    try {
      const payload: GenderPayload = {
        title: name,
        gender: gender,
      };

      await authService.insertGender(payload);

      setName('');
      setGender('');
      fetchGenders();
      showSuccessMessage('Gender added successfully.');
    } catch (error) {
      console.error("Error adding gender:", error);
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
      await authService.blockGender(Number(id));
      setBlockedRows([...blockedRows, id]);
      localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
      showSuccessMessage('Gender blocked successfully.');
    } catch (error) {
      console.error("Error blocking Gender:", error);
    }
  };

  const unblockRow = async (id: string) => {
    try {
      await authService.unblockGender(Number(id));
      setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
      localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
      showSuccessMessage('Gender unblocked successfully.');
    } catch (error) {
      console.error("Error unblocking Gender:", error);
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
      <Box m={6}>
        <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "30px", margin: "10px" }}>
          <Box m={4}>
            <h3>Gender</h3>
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
                          <TextField
                            id="filled-basic"
                            label="Name"
                            className="text-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            margin="dense"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            id="filled-basic"
                            label="Gender"
                            className="text-field"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            variant="outlined"
                            margin="dense"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={4}>
                          <Box mt={2}>
                            <button type="button" className="btn btn-outline-primary" onClick={handleSubmit} style={{ textAlign: 'center' }}>
                              Submit
                            </button>
                          </Box>
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
                                <TableCell>Gender</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {genders.filter((gender) => !blockedRows.includes(gender.id)).slice(startIndex, endIndex).map((gender, index) => (
                                <TableRow key={gender.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                  <TableCell>{serialNumber + index}</TableCell>
                                  <TableCell>{gender.title}</TableCell>
                                  <TableCell>{gender.gender}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => handleEditClick(gender.id, gender.title, gender.gender)}
                                      style={{ padding: '1px', marginRight: '4px' }}
                                      startIcon={<EditIcon />}
                                      variant="outlined"
                                      disabled={blockedRows.includes(gender.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleBlock(gender.id)}>
                                      Block
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <div>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={genders.length}
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
                              <TableCell >Gender</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {genders
                              .filter((gender) => blockedRows.includes(gender.id))
                              .slice(startIndex, endIndex)
                              .map((gender, index) => (
                                <TableRow key={gender.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                  <TableCell>{serialNumber + index}</TableCell>
                                  <TableCell>{gender.title}</TableCell>
                                  <TableCell>{gender.gender}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => handleEditClick(gender.id, gender.title, gender.gender)}
                                      style={{ padding: '1px', marginRight: '4px' }}
                                      startIcon={<EditIcon />}
                                      variant="outlined"
                                      disabled={blockedRows.includes(gender.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleUnblock(gender.id)}>
                                      Unblock
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 20]} 
                          component="div"
                          count={genders.filter((gender) => blockedRows.includes(gender.id)).length}
                          page={page}
                          onPageChange={handlePageChange} 
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={handleRowsPerPageChange} 
                          style={{ marginLeft: "500px" }} 
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
      <Dialog open={openEditDialog} onClose={handleEditDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Gender</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Gender Name"
                fullWidth
                variant="outlined"
                margin="dense"
                value={editGenderName}
                onChange={(e) => setEditGenderName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="filled-basic"
                label="Gender"
                className="text-field"
                value={editGenderGender}
                onChange={(e) => setEditGenderGender(e.target.value)}
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
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

export default Gender;
