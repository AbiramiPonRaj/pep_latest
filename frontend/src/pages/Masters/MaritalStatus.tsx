import React, { useState, useEffect } from 'react';
import {
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, TablePagination
} from '@mui/material';

import { Card, Container } from 'react-bootstrap';

import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import { MaritalStatusPayload } from '../../data/services/master/Maritalstatus/maritalstatus_payload';
import Header from '../../layouts/header/header';
import MaritalStatusApiService from '../../data/services/master/Maritalstatus/maritalstatus_api_service';



interface MaritalStatus {
  id: string;
  name: string;
  prefix: string; // Add a semicolon
}

const MaritalStatus = () => {
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState(''); // Changed 'status' to 'prefix'
  const [maritalstatus, setMaritalMaritalStatus] = useState<MaritalStatus[]>([]); // Initialize 'maritalstatus' as an array of MaritalStatus
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<MaritalStatus | null>(null); // Use 'MaritalStatus' type
  const [activeTab, setActiveTab] = useState('insert');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serialNumber, setSerialNumber] = useState(1);
  const [deletedMaritalStatuss, setDeletedMaritalStatuss] = useState<string[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editMaritalStatusName, setEditMaritalStatusName] = useState('');
  const [editMaritalStatusPrefix, setEditMaritalStatusPrefix] = useState(''); // Changed 'maritalstatus' to 'prefix'
  const [editMaritalStatusId, setEditMaritalStatusId] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteMaritalStatusId, setDeleteMaritalStatusId] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [blockedRows, setBlockedRows] = useState<string[]>([]);
  const authService = new MaritalStatusApiService();
  useEffect(() => {
    fetchMaritalStatuss(); // Renamed function to fetchMaritalStatuss
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
  const fetchMaritalStatuss = async () => {
    try {
      const fetchedMaritalStatus = await authService.getMaritalStatus();
      setMaritalMaritalStatus(fetchedMaritalStatus); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching maritalstatus:", error);
    }
  };
  
  

  const handleEditClick = (id: string, name: string, prefix: string) => {
    setEditMaritalStatusId(id);
    setEditMaritalStatusName(name);
    setEditMaritalStatusPrefix(prefix); // Set the prefix
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditMaritalStatusId('');
    setEditMaritalStatusName('');
    setEditMaritalStatusPrefix(''); // Reset prefix
  };

  const handleEditDialogSave = async () => {
    try {
      const payload: MaritalStatusPayload = {
        name: editMaritalStatusName,
        prefix: editMaritalStatusPrefix, // Use the edited prefix value
      };

      await authService.updateMaritalStatus(Number(editMaritalStatusId), payload);

      setOpenEditDialog(false);
      setEditMaritalStatusId('');
      setEditMaritalStatusName('');
      setEditMaritalStatusPrefix(''); // Reset prefix
      fetchMaritalStatuss();
      showSuccessMessage('MaritalStatus updated successfully.');
    } catch (error) {
      console.error("Error editing MaritalStatus:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prefix) {
      showErrorMessage('Please fill out all fields.');
      return;
    }
    try {
      const payload: MaritalStatusPayload = {
        name: name,
        prefix: prefix,
      };

      await authService.CreateMaritalStatus(payload); // Use the corrected function name

      setName('');
      setPrefix('');
      fetchMaritalStatuss();
      showSuccessMessage('MaritalStatus added successfully.');
    } catch (error) {
      console.error("Error adding maritalstatus:", error);
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
      await authService.blockMaritalStatus(Number(id));
      setBlockedRows([...blockedRows, id]);
      localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
      showSuccessMessage('MaritalStatus blocked successfully.');
    } catch (error) {
      console.error("Error blocking MaritalStatus:", error);
    }
  };

  const unblockRow = async (id: string) => {
    try {
      await authService.unblockMaritalStatus(Number(id));
      setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
      localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
      showSuccessMessage('MaritalStatus unblocked successfully.');
    } catch (error) {
      console.error("Error unblocking MaritalStatus:", error);
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
            <h3>MaritalStatus</h3>
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
                            label="MaritalStatus"
                            className="text-field"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
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
                                <TableCell>Prefix</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {maritalstatus.filter((maritalstatus) => !blockedRows.includes(maritalstatus.id)).slice(startIndex, endIndex).map((maritalstatus, index) => (
                                <TableRow key={maritalstatus.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                  <TableCell>{serialNumber + index}</TableCell>
                                  <TableCell>{maritalstatus.name}</TableCell>
                                  <TableCell>{maritalstatus.prefix}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => handleEditClick(maritalstatus.id, maritalstatus.name, maritalstatus.prefix)}
                                      style={{ padding: '1px', marginRight: '4px' }}
                                      startIcon={<EditIcon />}
                                      variant="outlined"
                                      disabled={blockedRows.includes(maritalstatus.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleBlock(maritalstatus.id)}>
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
                            count={maritalstatus.length}
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
                        <Table size="small" aria-label="a dense table">
                          <TableHead sx={{ backgroundColor: '#cccdd1' }}>
                            <TableRow className="tableHeading">
                              <TableCell>S.No</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>MaritalStatus</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {maritalstatus
                              .filter((maritalstatus) => blockedRows.includes(maritalstatus.id))
                              .slice(startIndex, endIndex)
                              .map((maritalstatus, index) => (
                                <TableRow key={maritalstatus.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                  <TableCell>{serialNumber + index}</TableCell>
                                  <TableCell>{maritalstatus.name}</TableCell>
                                  <TableCell>{maritalstatus.prefix}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => handleEditClick(maritalstatus.id, maritalstatus.name, maritalstatus.prefix)}
                                      style={{ padding: '1px', marginRight: '4px' }}
                                      startIcon={<EditIcon />}
                                      variant="outlined"
                                      disabled={blockedRows.includes(maritalstatus.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleUnblock(maritalstatus.id)}>
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
                          count={maritalstatus.filter((maritalstatus) => blockedRows.includes(maritalstatus.id)).length}
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
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit MaritalStatus</DialogTitle>
        <DialogContent>
          <div className="p-2">
            <form>
              <div className="mb-2">
                <TextField
                  label="Name"
                  value={editMaritalStatusName}
                  onChange={(e) => setEditMaritalStatusName(e.target.value)}
                  fullWidth
                  required
                />
              </div>
              <div>
                <TextField
                  label="MaritalStatus"
                  value={editMaritalStatusPrefix}
                  onChange={(e) => setEditMaritalStatusPrefix(e.target.value)}
                  fullWidth
                  required
                />
              </div>
            </form>
          </div>
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
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this maritalstatus?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleConfirmDialog(true)} color="primary">
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

export default MaritalStatus;
