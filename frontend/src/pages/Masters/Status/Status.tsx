import React, { useState, useEffect } from 'react';
import {
  TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, TablePagination
} from '@mui/material';

import { Card, Container } from 'react-bootstrap';
import Header from '../../../layouts/header/header';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import { StatusPayload } from '../../../data/services/master/status/status-payload';
import statusApiService from '../../../data/services/master/status/status-api-service';


interface Status {
  id: string;
  name: string;
  code: string;
}

const Status = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [activeTab, setActiveTab] = useState('insert');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serialNumber, setSerialNumber] = useState(1);
  const [deletedStatuss, setDeletedStatuss] = useState<string[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editStatusName, setEditStatusName] = useState('');
  const [editStatusCode, setEditStatusCode] = useState('');
  const [editStatusId, setEditStatusId] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteStatusId, setDeleteStatusId] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [blockedRows, setBlockedRows] = useState<string[]>([]);
  const authService = new statusApiService();

  useEffect(() => {
    fetchStatuss();
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

  const fetchStatuss = async () => {
    try {
      const fetchedStatus = await authService.getStatus();
      setStatus(fetchedStatus);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const handleEditClick = (id: string, name: string, code: string) => {
    setEditStatusId(id);
    setEditStatusName(name);
    setEditStatusCode(code);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditStatusId('');
    setEditStatusName('');
    setEditStatusCode('');
  };

  const handleEditDialogSave = async () => {
    try {
      const payload: StatusPayload = {
        name: editStatusName,
        code: editStatusCode,
      };
      await authService.updateStatus(Number(editStatusId), payload);
      setOpenEditDialog(false);
      setEditStatusId('');
      setEditStatusName('');
      setEditStatusCode('');
      fetchStatuss();
      showSuccessMessage('Status updated successfully.');
    } catch (error) {
      console.error("Error editing Status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      showErrorMessage('Please fill out all fields.');
      return;
    }
    try {
      const payload: StatusPayload = {
        name: name,
        code: code,
      };
      await authService.CreateStatus(payload);
      setName('');
      setCode('');
      fetchStatuss();
      showSuccessMessage('Status added successfully.');
    } catch (error) {
      console.error("Error adding status:", error);
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
      await authService.blockStatus(Number(id));
      setBlockedRows([...blockedRows, id]);
      localStorage.setItem('blockedRows', JSON.stringify([...blockedRows, id]));
      showSuccessMessage('Status blocked successfully.');
    } catch (error) {
      console.error("Error blocking Status:", error);
    }
  };

  const unblockRow = async (id: string) => {
    try {
      await authService.unblockStatus(Number(id));
      setBlockedRows(blockedRows.filter((rowId) => rowId !== id));
      localStorage.setItem('blockedRows', JSON.stringify(blockedRows.filter((rowId) => rowId !== id)));
      showSuccessMessage('Status unblocked successfully.');
    } catch (error) {
      console.error("Error unblocking Status:", error);
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
            <h3>Status</h3>
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
                            label="Status"
                            className="text-field"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
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
                                <TableCell>Code</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {status.filter((status) => !blockedRows.includes(status.id)).slice(startIndex, endIndex).map((status, index) => (
                                <TableRow key={status.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                  <TableCell>{serialNumber + index}</TableCell>
                                  <TableCell>{status.name}</TableCell>
                                  <TableCell>{status.code}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => handleEditClick(status.id, status.name, status.code)}
                                      style={{ padding: '1px', marginRight: '4px' }}
                                      startIcon={<EditIcon />}
                                      variant="outlined"
                                      disabled={blockedRows.includes(status.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleBlock(status.id)}>
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
                            count={status.length}
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
                              <TableCell>Status</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {status
                              .filter((status) => blockedRows.includes(status.id))
                              .slice(startIndex, endIndex)
                              .map((status, index) => (
                                <TableRow key={status.id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e1e1e3' }}>
                                  <TableCell>{serialNumber + index}</TableCell>
                                  <TableCell>{status.name}</TableCell>
                                  <TableCell>{status.code}</TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() => handleEditClick(status.id, status.name, status.code)}
                                      style={{ padding: '1px', marginRight: '4px' }}
                                      startIcon={<EditIcon />}
                                      variant="outlined"
                                      disabled={blockedRows.includes(status.id)}
                                    >
                                      Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => handleUnblock(status.id)}>
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
                          count={status.filter((status) => blockedRows.includes(status.id)).length}
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
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent>
          <div className="p-2">
            <form>
              <div className="mb-2">
                <TextField
                  label="Name"
                  value={editStatusName}
                  onChange={(e) => setEditStatusName(e.target.value)}
                  fullWidth
                  required
                />
              </div>
              <div>
                <TextField
                  label="Status"
                  value={editStatusCode}
                  onChange={(e) => setEditStatusCode(e.target.value)}
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
          <p>Are you sure you want to {dialogAction === 'block' ? 'block' : 'unblock'} this status?</p>
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

export default Status;
